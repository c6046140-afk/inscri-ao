import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { MarathonRegistration, SupabaseConfig } from '../types/marathon';

const STORAGE_KEY_CONFIG = 'maratona_supabase_config_v1';
const STORAGE_KEY_REGISTRATIONS = 'maratona_local_registrations_v1';
export const DEFAULT_TABLE_NAME = 'maratona_inscricoes';

// SQL Schema completo com RLS e políticas de armazenamento ativadas
export const SUPABASE_SQL_SCHEMA = `-- ==============================================================================
-- 1. CRIAÇÃO DA TABELA DE INSCRIÇÕES DA MARATONA 10 KM
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.${DEFAULT_TABLE_NAME} (
    id TEXT PRIMARY KEY,
    nome TEXT NOT NULL,
    email TEXT NOT NULL,
    telefone TEXT NOT NULL,
    cpf TEXT,
    data_nascimento TEXT,
    genero TEXT,
    tamanho_camiseta TEXT,
    tipo_kit TEXT,
    ritmo_estimado TEXT,
    contato_emergencia_nome TEXT,
    contato_emergencia_telefone TEXT,
    observacoes_medicas TEXT,
    numero_peito INTEGER UNIQUE,
    status_pagamento TEXT DEFAULT 'confirmado',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Índices para busca rápida
CREATE INDEX IF NOT EXISTS idx_maratona_email ON public.${DEFAULT_TABLE_NAME} (email);
CREATE INDEX IF NOT EXISTS idx_maratona_numero_peito ON public.${DEFAULT_TABLE_NAME} (numero_peito);
CREATE INDEX IF NOT EXISTS idx_maratona_created_at ON public.${DEFAULT_TABLE_NAME} (created_at DESC);

-- ==============================================================================
-- 2. ATIVAÇÃO DAS POLÍTICAS DE SEGURANÇA (ROW LEVEL SECURITY - RLS) NA TABELA
-- ==============================================================================
ALTER TABLE public.${DEFAULT_TABLE_NAME} ENABLE ROW LEVEL SECURITY;

-- Limpeza de políticas existentes para evitar conflitos em re-execução
DROP POLICY IF EXISTS "Permitir inscricoes publicas anonimas" ON public.${DEFAULT_TABLE_NAME};
DROP POLICY IF EXISTS "Permitir leitura de inscricoes" ON public.${DEFAULT_TABLE_NAME};
DROP POLICY IF EXISTS "Permitir atualizacao de inscricoes" ON public.${DEFAULT_TABLE_NAME};

-- POLÍTICA 1 (INSERT): Permite que qualquer atleta (anônimo ou autenticado) envie sua inscrição
CREATE POLICY "Permitir inscricoes publicas anonimas"
ON public.${DEFAULT_TABLE_NAME}
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- POLÍTICA 2 (SELECT): Permite consulta pública das inscrições para visualização do comprovante e painel
CREATE POLICY "Permitir leitura de inscricoes"
ON public.${DEFAULT_TABLE_NAME}
FOR SELECT
TO anon, authenticated
USING (true);

-- POLÍTICA 3 (UPDATE): Permite atualização (ex: status de pagamento, sincronização)
CREATE POLICY "Permitir atualizacao de inscricoes"
ON public.${DEFAULT_TABLE_NAME}
FOR UPDATE
TO anon, authenticated
USING (true)
WITH CHECK (true);

-- ==============================================================================
-- 3. POLÍTICAS DE ARMAZENAMENTO (SUPABASE STORAGE BUCKET)
-- Criação do Bucket e políticas para upload de comprovantes/documentos
-- ==============================================================================
-- Criar bucket público de armazenamento para a maratona se não existir
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'comprovantes-maratona',
    'comprovantes-maratona',
    true,
    5242880, -- Limite de 5MB por arquivo
    ARRAY['image/png', 'image/jpeg', 'image/webp', 'application/pdf']
)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Políticas de Storage para o bucket 'comprovantes-maratona'
DROP POLICY IF EXISTS "Acesso publico para leitura de comprovantes" ON storage.objects;
DROP POLICY IF EXISTS "Permitir upload publico de comprovantes" ON storage.objects;
DROP POLICY IF EXISTS "Permitir atualizacao de comprovantes" ON storage.objects;

-- Permite que qualquer pessoa visualize/baixe comprovantes e imagens do bucket
CREATE POLICY "Acesso publico para leitura de comprovantes"
ON storage.objects
FOR SELECT
TO anon, authenticated
USING (bucket_id = 'comprovantes-maratona');

-- Permite upload de comprovantes no bucket
CREATE POLICY "Permitir upload publico de comprovantes"
ON storage.objects
FOR INSERT
TO anon, authenticated
WITH CHECK (bucket_id = 'comprovantes-maratona');

-- Permite atualizar arquivos no bucket
CREATE POLICY "Permitir atualizacao de comprovantes"
ON storage.objects
FOR UPDATE
TO anon, authenticated
USING (bucket_id = 'comprovantes-maratona');
`;

let cachedClient: SupabaseClient | null = null;
let lastClientKey: string = '';

export function getSupabaseConfig(): SupabaseConfig {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_CONFIG);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.url && parsed.anonKey) {
        return {
          url: parsed.url.trim(),
          anonKey: parsed.anonKey.trim(),
          tableName: parsed.tableName?.trim() || DEFAULT_TABLE_NAME,
        };
      }
    }
  } catch (e) {
    console.warn('Erro ao ler config do Supabase:', e);
  }

  // Fallback para variáveis de ambiente VITE
  const envUrl = (import.meta.env.VITE_SUPABASE_URL || '').trim();
  const envKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim();

  return {
    url: envUrl,
    anonKey: envKey,
    tableName: DEFAULT_TABLE_NAME,
  };
}

export function saveSupabaseConfig(config: Partial<SupabaseConfig>): void {
  const current = getSupabaseConfig();
  const updated: SupabaseConfig = {
    url: (config.url ?? current.url).trim(),
    anonKey: (config.anonKey ?? current.anonKey).trim(),
    tableName: (config.tableName ?? current.tableName).trim() || DEFAULT_TABLE_NAME,
  };
  localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(updated));
  cachedClient = null; // Invalida o cache
}

export function clearSupabaseConfig(): void {
  localStorage.removeItem(STORAGE_KEY_CONFIG);
  cachedClient = null;
}

export function isSupabaseConfigured(): boolean {
  const config = getSupabaseConfig();
  return Boolean(
    config.url && 
    config.url.startsWith('https://') && 
    config.anonKey && 
    config.anonKey.length > 20
  );
}

export function getSupabaseClient(): SupabaseClient | null {
  const config = getSupabaseConfig();
  if (!config.url || !config.anonKey) {
    return null;
  }

  const key = `${config.url}::${config.anonKey}`;
  if (cachedClient && lastClientKey === key) {
    return cachedClient;
  }

  try {
    cachedClient = createClient(config.url, config.anonKey, {
      auth: {
        persistSession: false,
      },
    });
    lastClientKey = key;
    return cachedClient;
  } catch (error) {
    console.error('Falha ao instanciar Supabase client:', error);
    return null;
  }
}

export async function testSupabaseConnection(): Promise<{
  success: boolean;
  message: string;
  tableExists?: boolean;
}> {
  const client = getSupabaseClient();
  const config = getSupabaseConfig();

  if (!client) {
    return {
      success: false,
      message: 'URL ou Chave Anon do Supabase não configuradas.',
    };
  }

  try {
    // Tenta consultar 1 registro na tabela configurada
    const { data, error } = await client
      .from(config.tableName)
      .select('id')
      .limit(1);

    if (error) {
      if (error.code === '42P01' || error.message?.includes('relation') || error.message?.includes('does not exist')) {
        return {
          success: true,
          tableExists: false,
          message: `Conexão com o Supabase estabelecida com sucesso! No entanto, a tabela "${config.tableName}" ainda não foi criada no banco de dados. Use o script SQL fornecido abaixo.`,
        };
      }
      return {
        success: false,
        message: `Erro do Supabase: ${error.message} (Código: ${error.code || 'N/A'})`,
      };
    }

    return {
      success: true,
      tableExists: true,
      message: `Conectado com sucesso ao Supabase! Tabela "${config.tableName}" encontrada e pronta para receber inscrições.`,
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return {
      success: false,
      message: `Falha na requisição de rede: ${msg}. Verifique a URL informada.`,
    };
  }
}

// Armazenamento local de backup / fallback
export function getLocalRegistrations(): MarathonRegistration[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_REGISTRATIONS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveLocalRegistration(registration: MarathonRegistration): void {
  const all = getLocalRegistrations();
  const existingIdx = all.findIndex((r) => r.id === registration.id);
  if (existingIdx >= 0) {
    all[existingIdx] = registration;
  } else {
    all.unshift(registration);
  }
  localStorage.setItem(STORAGE_KEY_REGISTRATIONS, JSON.stringify(all));
}

export async function saveRegistration(
  regData: Omit<MarathonRegistration, 'id' | 'numero_peito' | 'status_pagamento' | 'sync_status' | 'created_at'>
): Promise<{ registration: MarathonRegistration; savedToSupabase: boolean; error?: string }> {
  // Gerar ID e número de peito
  const localList = getLocalRegistrations();
  const lastBib = localList.reduce((max, r) => Math.max(max, r.numero_peito || 1000), 1000);
  const nextBib = lastBib + 1;

  const registration: MarathonRegistration = {
    ...regData,
    id: `maratona-10k-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    numero_peito: nextBib,
    status_pagamento: 'confirmado',
    sync_status: 'local_only',
    created_at: new Date().toISOString(),
  };

  // Salva localmente primeiro (garantindo que os dados nunca sejam perdidos)
  saveLocalRegistration(registration);

  const client = getSupabaseClient();
  const config = getSupabaseConfig();

  if (!client || !isSupabaseConfigured()) {
    return {
      registration,
      savedToSupabase: false,
      error: 'Supabase ainda não configurado. Dados salvos localmente.',
    };
  }

  try {
    const { error } = await client.from(config.tableName).insert({
      id: registration.id,
      nome: registration.nome,
      email: registration.email,
      telefone: registration.telefone,
      cpf: registration.cpf || null,
      data_nascimento: registration.data_nascimento,
      genero: registration.genero,
      tamanho_camiseta: registration.tamanho_camiseta,
      tipo_kit: registration.tipo_kit,
      ritmo_estimado: registration.ritmo_estimado,
      contato_emergencia_nome: registration.contato_emergencia_nome,
      contato_emergencia_telefone: registration.contato_emergencia_telefone,
      observacoes_medicas: registration.observacoes_medicas || null,
      numero_peito: registration.numero_peito,
      status_pagamento: registration.status_pagamento,
      created_at: registration.created_at,
    });

    if (error) {
      registration.sync_status = 'error';
      registration.sync_error = error.message;
      saveLocalRegistration(registration);
      return {
        registration,
        savedToSupabase: false,
        error: error.message,
      };
    }

    registration.sync_status = 'synced';
    registration.sync_error = undefined;
    saveLocalRegistration(registration);

    return {
      registration,
      savedToSupabase: true,
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    registration.sync_status = 'error';
    registration.sync_error = errorMsg;
    saveLocalRegistration(registration);
    return {
      registration,
      savedToSupabase: false,
      error: errorMsg,
    };
  }
}

export async function fetchAllRegistrations(): Promise<{
  registrations: MarathonRegistration[];
  source: 'supabase' | 'local';
  error?: string;
}> {
  const client = getSupabaseClient();
  const config = getSupabaseConfig();

  if (client && isSupabaseConfigured()) {
    try {
      const { data, error } = await client
        .from(config.tableName)
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        const mapped: MarathonRegistration[] = data.map((item) => ({
          id: item.id,
          nome: item.nome,
          email: item.email,
          telefone: item.telefone,
          cpf: item.cpf,
          data_nascimento: item.data_nascimento,
          genero: item.genero,
          tamanho_camiseta: item.tamanho_camiseta,
          tipo_kit: item.tipo_kit,
          ritmo_estimado: item.ritmo_estimado,
          contato_emergencia_nome: item.contato_emergencia_nome,
          contato_emergencia_telefone: item.contato_emergencia_telefone,
          observacoes_medicas: item.observacoes_medicas,
          numero_peito: item.numero_peito,
          status_pagamento: item.status_pagamento || 'confirmado',
          sync_status: 'synced',
          created_at: item.created_at,
        }));

        // Atualiza cache local com os do Supabase
        mapped.forEach((reg) => saveLocalRegistration(reg));
        return { registrations: mapped, source: 'supabase' };
      }
    } catch (err) {
      console.warn('Erro ao carregar do Supabase, usando local:', err);
    }
  }

  return {
    registrations: getLocalRegistrations(),
    source: 'local',
  };
}

export async function syncPendingRegistrations(): Promise<{
  synced: number;
  total: number;
  failed: number;
}> {
  const client = getSupabaseClient();
  const config = getSupabaseConfig();
  if (!client || !isSupabaseConfigured()) {
    return { synced: 0, total: 0, failed: 0 };
  }

  const all = getLocalRegistrations();
  const pending = all.filter((r) => r.sync_status !== 'synced');

  let synced = 0;
  let failed = 0;

  for (const reg of pending) {
    try {
      const { error } = await client.from(config.tableName).upsert({
        id: reg.id,
        nome: reg.nome,
        email: reg.email,
        telefone: reg.telefone,
        cpf: reg.cpf || null,
        data_nascimento: reg.data_nascimento,
        genero: reg.genero,
        tamanho_camiseta: reg.tamanho_camiseta,
        tipo_kit: reg.tipo_kit,
        ritmo_estimado: reg.ritmo_estimado,
        contato_emergencia_nome: reg.contato_emergencia_nome,
        contato_emergencia_telefone: reg.contato_emergencia_telefone,
        observacoes_medicas: reg.observacoes_medicas || null,
        numero_peito: reg.numero_peito,
        status_pagamento: reg.status_pagamento,
        created_at: reg.created_at,
      });

      if (!error) {
        reg.sync_status = 'synced';
        reg.sync_error = undefined;
        synced++;
      } else {
        reg.sync_status = 'error';
        reg.sync_error = error.message;
        failed++;
      }
    } catch (err: unknown) {
      reg.sync_status = 'error';
      reg.sync_error = err instanceof Error ? err.message : String(err);
      failed++;
    }
  }

  localStorage.setItem(STORAGE_KEY_REGISTRATIONS, JSON.stringify(all));
  return { synced, total: pending.length, failed };
}
