import React from 'react';
import { Trophy, Database, CheckCircle2, AlertCircle, Users, Sparkles } from 'lucide-react';
import { isSupabaseConfigured } from '../lib/supabase';

interface MarathonHeaderProps {
  onOpenSupabaseConfig: () => void;
  onOpenAdmin: () => void;
  onScrollToForm: () => void;
  activeTab: 'landing' | 'admin';
  setActiveTab: (tab: 'landing' | 'admin') => void;
  totalInscritosCount: number;
}

export const MarathonHeader: React.FC<MarathonHeaderProps> = ({
  onOpenSupabaseConfig,
  onScrollToForm,
  activeTab,
  setActiveTab,
  totalInscritosCount,
}) => {
  const isConnected = isSupabaseConfigured();

  return (
    <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand / Logo */}
        <div 
          onClick={() => setActiveTab('landing')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-orange-600 via-amber-500 to-yellow-400 p-0.5 shadow-lg shadow-orange-500/20 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Trophy className="w-6 h-6 text-orange-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl tracking-tight text-white group-hover:text-orange-400 transition-colors">
                MARATONA <span className="text-orange-500">10K</span>
              </span>
              <span className="px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase bg-orange-500/10 text-orange-400 border border-orange-500/30 rounded-full">
                OFICIAL
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Circuito da Cidade • Edição 2026
            </p>
          </div>
        </div>

        {/* Center Nav */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-900/60 p-1.5 rounded-full border border-slate-800">
          <button
            onClick={() => {
              setActiveTab('landing');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
              activeTab === 'landing'
                ? 'bg-orange-500 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            Início & Prova
          </button>
          <button
            onClick={onScrollToForm}
            className="px-4 py-1.5 rounded-full text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800/60 transition-all"
          >
            Fazer Inscrição
          </button>
          <button
            onClick={() => setActiveTab('admin')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'admin'
                ? 'bg-orange-500 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            Painel de Inscritos
            {totalInscritosCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 text-[10px] bg-slate-950/60 rounded-full font-bold">
                {totalInscritosCount}
              </span>
            )}
          </button>
        </nav>

        {/* Actions (Supabase status + CTA) */}
        <div className="flex items-center gap-3">
          {/* Supabase status badge */}
          <button
            onClick={onOpenSupabaseConfig}
            title={isConnected ? "Supabase Conectado - Clique para gerenciar" : "Supabase Pendente - Clique para conectar"}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
              isConnected
                ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/40'
                : 'bg-amber-950/40 border-amber-500/40 text-amber-300 hover:bg-amber-900/40 animate-pulse'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Supabase:</span>
            {isConnected ? (
              <span className="flex items-center gap-1 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Ativo
              </span>
            ) : (
              <span className="flex items-center gap-1 font-semibold">
                <AlertCircle className="w-3.5 h-3.5 text-amber-400" /> Configurar
              </span>
            )}
          </button>

          {/* Quick CTA button */}
          <button
            onClick={onScrollToForm}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-lg shadow-orange-500/25 active:scale-95 transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>Garantir Vaga</span>
          </button>
        </div>

      </div>
    </header>
  );
};
