export type Genero = 'masculino' | 'feminino' | 'outro' | 'prefiro_nao_dizer';

export type TamanhoCamiseta = 
  | 'Baby Look P' 
  | 'Baby Look M' 
  | 'Baby Look G' 
  | 'Baby Look GG'
  | 'Unissex P' 
  | 'Unissex M' 
  | 'Unissex G' 
  | 'Unissex GG' 
  | 'Unissex XGG';

export type TipoKit = 'essencial' | 'premium' | 'vip';

export type RitmoEstimado = 
  | 'sub40' // < 40 min (Elite / Ritmo forte)
  | 'sub50' // 40 - 50 min (Avançado)
  | 'sub60' // 50 - 60 min (Intermediário)
  | 'acima60' // > 60 min (Iniciante / Conclusão)
  | 'caminhada'; // Caminhada / Trote leve

export interface MarathonRegistration {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  cpf?: string;
  data_nascimento: string;
  genero: Genero;
  tamanho_camiseta: TamanhoCamiseta;
  tipo_kit: TipoKit;
  ritmo_estimado: RitmoEstimado;
  contato_emergencia_nome: string;
  contato_emergencia_telefone: string;
  observacoes_medicas?: string;
  numero_peito: number;
  status_pagamento: 'confirmado' | 'pendente';
  sync_status: 'synced' | 'local_only' | 'error';
  sync_error?: string;
  created_at: string;
}

export interface SupabaseConfig {
  url: string;
  anonKey: string;
  tableName: string;
}

export interface KitOption {
  id: TipoKit;
  nome: string;
  preco: number;
  descricao: string;
  itens: string[];
  popular?: boolean;
}
