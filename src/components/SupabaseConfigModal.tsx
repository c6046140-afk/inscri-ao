import React, { useState, useEffect } from 'react';
import { 
  X, 
  Database, 
  Check, 
  Copy, 
  RefreshCw, 
  AlertCircle, 
  CheckCircle2, 
  ExternalLink,
  Code,
  UploadCloud,
  Key,
  Globe
} from 'lucide-react';
import { 
  getSupabaseConfig, 
  saveSupabaseConfig, 
  testSupabaseConnection, 
  syncPendingRegistrations,
  SUPABASE_SQL_SCHEMA,
  DEFAULT_TABLE_NAME,
  getLocalRegistrations
} from '../lib/supabase';

interface SupabaseConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfigSaved: () => void;
}

export const SupabaseConfigModal: React.FC<SupabaseConfigModalProps> = ({
  isOpen,
  onClose,
  onConfigSaved,
}) => {
  const [url, setUrl] = useState('');
  const [anonKey, setAnonKey] = useState('');
  const [tableName, setTableName] = useState(DEFAULT_TABLE_NAME);

  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
    tableExists?: boolean;
  } | null>(null);

  const [copiedSql, setCopiedSql] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      const current = getSupabaseConfig();
      setUrl(current.url);
      setAnonKey(current.anonKey);
      setTableName(current.tableName || DEFAULT_TABLE_NAME);
      setTestResult(null);
      setSyncResult(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    saveSupabaseConfig({
      url: url.trim(),
      anonKey: anonKey.trim(),
      tableName: tableName.trim() || DEFAULT_TABLE_NAME,
    });
    onConfigSaved();
  };

  const handleTest = async () => {
    handleSave();
    setTesting(true);
    setTestResult(null);

    const result = await testSupabaseConnection();
    setTesting(false);
    setTestResult(result);
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  const handleSyncNow = async () => {
    setSyncing(true);
    setSyncResult(null);
    const res = await syncPendingRegistrations();
    setSyncing(false);
    setSyncResult(
      `Sincronização concluída: ${res.synced} inscrições enviadas com sucesso ao Supabase! ${res.failed ? `(${res.failed} falhas)` : ''}`
    );
    onConfigSaved();
  };

  const localList = getLocalRegistrations();
  const pendingCount = localList.filter((r) => r.sync_status !== 'synced').length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl relative">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between sticky top-0 bg-slate-900/95 backdrop-blur z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                Conexão com o Supabase
              </h3>
              <p className="text-xs text-slate-400">
                Pronto para salvar as inscrições no seu banco de dados Supabase
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">

          {/* Quick Explanatory Banner */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 text-xs text-slate-300 leading-relaxed">
            <span className="font-bold text-orange-400 block mb-1">
              Como funciona quando você criar no Supabase:
            </span>
            Basta criar um projeto gratuito no <a href="https://supabase.com" target="_blank" rel="noreferrer" className="text-orange-400 underline font-semibold inline-flex items-center gap-1">supabase.com <ExternalLink className="w-3 h-3" /></a>, copiar a <strong>Project URL</strong> e a <strong>Anon / Public Key</strong> (em Project Settings &gt; API) e colar nos campos abaixo.
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-slate-400" />
                Project URL do Supabase
              </label>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://seu-projeto.supabase.co"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-3.5 text-xs sm:text-sm text-white placeholder-slate-600 focus:outline-none focus:border-orange-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-slate-400" />
                Chave Anon / Public Key
              </label>
              <textarea
                rows={2}
                value={anonKey}
                onChange={(e) => setAnonKey(e.target.value)}
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIs..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-orange-500 font-mono resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-slate-400" />
                Nome da Tabela
              </label>
              <input
                type="text"
                value={tableName}
                onChange={(e) => setTableName(e.target.value)}
                placeholder={DEFAULT_TABLE_NAME}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-orange-500 font-mono"
              />
            </div>
          </div>

          {/* Test Connection Button */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={handleTest}
              disabled={testing || !url}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                testing || !url
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/20 active:scale-95'
              }`}
            >
              {testing ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Testando conexão...</span>
                </>
              ) : (
                <>
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Salvar & Testar Conexão</span>
                </>
              )}
            </button>

            {pendingCount > 0 && (
              <button
                onClick={handleSyncNow}
                disabled={syncing || !url}
                className="px-4 py-2.5 rounded-xl text-xs font-bold bg-orange-600 hover:bg-orange-500 text-white flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50"
              >
                <UploadCloud className="w-3.5 h-3.5" />
                <span>Sincronizar {pendingCount} inscrições locais pendentes</span>
              </button>
            )}
          </div>

          {/* Test Result Feedback */}
          {testResult && (
            <div
              className={`p-4 rounded-xl text-xs flex items-start gap-3 border ${
                testResult.success && testResult.tableExists
                  ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                  : testResult.success && !testResult.tableExists
                  ? 'bg-amber-950/40 border-amber-500/40 text-amber-200'
                  : 'bg-red-950/40 border-red-500/40 text-red-200'
              }`}
            >
              {testResult.success && testResult.tableExists ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              )}
              <div className="space-y-1">
                <span className="font-bold block">
                  {testResult.success ? 'Conexão Estabelecida!' : 'Falha na Conexão'}
                </span>
                <p className="leading-relaxed">{testResult.message}</p>
              </div>
            </div>
          )}

          {syncResult && (
            <div className="p-3 bg-emerald-950/30 border border-emerald-500/30 rounded-xl text-xs text-emerald-300">
              {syncResult}
            </div>
          )}

          {/* SQL Script Box */}
          <div className="border border-slate-800 rounded-2xl p-4 bg-slate-950/90">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
              <div>
                <span className="text-xs font-bold text-slate-200 uppercase flex items-center gap-1.5">
                  <Code className="w-3.5 h-3.5 text-orange-400" />
                  Script SQL Completo (Tabela + RLS + Políticas de Armazenamento)
                </span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
                    RLS Ativado
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-blue-500/10 text-blue-400 border border-blue-500/20 font-semibold">
                    Bucket de Storage Incluído
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-purple-500/10 text-purple-400 border border-purple-500/20 font-semibold">
                    Políticas Anon & Auth
                  </span>
                </div>
              </div>

              <button
                onClick={handleCopySql}
                className="px-3 py-1.5 rounded-lg text-xs font-bold bg-orange-600 hover:bg-orange-500 text-white flex items-center gap-1.5 transition-all shadow-md active:scale-95 self-start sm:self-auto"
              >
                {copiedSql ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-white" /> Copiado!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" /> Copiar SQL Completo
                  </>
                )}
              </button>
            </div>

            <pre className="text-[11px] font-mono text-slate-300 bg-slate-950 p-3.5 rounded-xl overflow-x-auto max-h-64 border border-slate-800/80 leading-relaxed select-all">
              {SUPABASE_SQL_SCHEMA}
            </pre>
            
            <p className="text-[11px] text-slate-400 mt-2">
              💡 <strong>Instrução:</strong> No painel do seu Supabase, vá em <strong>SQL Editor</strong> &gt; <strong>New Query</strong>, cole este script e clique em <strong>Run</strong> (Ctrl+Enter). Todas as tabelas, índices e políticas de segurança e storage serão criadas instantaneamente.
            </p>
          </div>

        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-800 flex items-center justify-between bg-slate-900/90">
          <span className="text-[11px] text-slate-400">
            As configurações ficam salvas no navegador e prontas para uso.
          </span>
          <button
            onClick={() => {
              handleSave();
              onClose();
            }}
            className="px-5 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs uppercase tracking-wide transition-all shadow-md active:scale-95"
          >
            Concluir & Fechar
          </button>
        </div>

      </div>
    </div>
  );
};
