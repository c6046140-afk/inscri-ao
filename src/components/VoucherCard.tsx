import React from 'react';
import { 
  Trophy, 
  Printer, 
  Share2, 
  Calendar, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  Database, 
  ArrowLeft,
  QrCode,
  ShieldCheck,
  Tag
} from 'lucide-react';
import { MarathonRegistration } from '../types/marathon';

interface VoucherCardProps {
  registration: MarathonRegistration;
  savedToSupabase: boolean;
  onNewRegistration: () => void;
  onViewAll: () => void;
}

export const VoucherCard: React.FC<VoucherCardProps> = ({
  registration,
  savedToSupabase,
  onNewRegistration,
  onViewAll,
}) => {
  const handlePrint = () => {
    window.print();
  };

  const formattedDate = new Date(registration.created_at).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="max-w-3xl mx-auto py-6 animate-in fade-in zoom-in-95 duration-300">
      
      {/* Top Success Banner */}
      <div className="text-center mb-8 no-print">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 mb-4 shadow-lg shadow-emerald-500/20">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">
          Inscrição Confirmada com Sucesso!
        </h2>
        <p className="text-slate-300 mt-2 text-sm sm:text-base max-w-xl mx-auto">
          Parabéns, <span className="font-bold text-orange-400">{registration.nome}</span>! Seu lugar na 
          linha de largada da <strong>Maratona 10 Km</strong> está garantido.
        </p>

        {/* Database Status Alert */}
        <div className="mt-4 inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold border bg-slate-900 border-slate-800">
          <Database className="w-3.5 h-3.5 text-orange-400" />
          {savedToSupabase ? (
            <span className="text-emerald-400">
              ✓ Gravado e sincronizado com o banco de dados Supabase
            </span>
          ) : (
            <span className="text-amber-300">
              ✓ Gravado com segurança localmente (pronto para sincronização Supabase)
            </span>
          )}
        </div>
      </div>

      {/* ATHLETIC RACE BIB (NÚMERO DE PEITO) */}
      <div className="bg-white text-slate-900 rounded-3xl p-6 sm:p-10 shadow-2xl border-4 border-orange-500 relative overflow-hidden">
        
        {/* Safety pin holes imitation */}
        <div className="absolute top-4 left-4 w-3.5 h-3.5 rounded-full bg-slate-200 border border-slate-300 shadow-inner" />
        <div className="absolute top-4 right-4 w-3.5 h-3.5 rounded-full bg-slate-200 border border-slate-300 shadow-inner" />
        <div className="absolute bottom-4 left-4 w-3.5 h-3.5 rounded-full bg-slate-200 border border-slate-300 shadow-inner" />
        <div className="absolute bottom-4 right-4 w-3.5 h-3.5 rounded-full bg-slate-200 border border-slate-300 shadow-inner" />

        {/* Header of Bib */}
        <div className="border-b-2 border-slate-900 pb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center text-white font-black text-xs">
              10K
            </div>
            <div>
              <span className="font-black tracking-tighter text-lg uppercase text-slate-950 block leading-tight">
                CIRCUITO MARATONA 10 KM
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500 block">
                Edição Oficial 2026 • Etapa Ibirapuera
              </span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] uppercase font-black tracking-wider bg-slate-950 text-white px-2.5 py-1 rounded-md">
              {registration.tipo_kit.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Main Bib Number */}
        <div className="py-6 text-center">
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-orange-600 block mb-1">
            NÚMERO DE PEITO OFICIAL
          </span>
          <div className="text-6xl sm:text-8xl font-black tracking-tight font-mono text-slate-950 select-all">
            #{registration.numero_peito}
          </div>
          <div className="mt-2 text-xl sm:text-2xl font-black uppercase text-slate-800 tracking-wide">
            {registration.nome}
          </div>
        </div>

        {/* Bib Footer Details */}
        <div className="border-t-2 border-slate-900 pt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
          <div className="bg-slate-100 p-2.5 rounded-xl">
            <span className="text-[10px] text-slate-500 uppercase font-bold block">Onda / Pelotão</span>
            <span className="font-extrabold text-slate-900 uppercase">
              {registration.ritmo_estimado}
            </span>
          </div>
          <div className="bg-slate-100 p-2.5 rounded-xl">
            <span className="text-[10px] text-slate-500 uppercase font-bold block">Camiseta</span>
            <span className="font-extrabold text-slate-900">
              {registration.tamanho_camiseta}
            </span>
          </div>
          <div className="bg-slate-100 p-2.5 rounded-xl">
            <span className="text-[10px] text-slate-500 uppercase font-bold block">Chip Timing</span>
            <span className="font-extrabold text-slate-900 font-mono">
              RFID-{registration.numero_peito}
            </span>
          </div>
          <div className="bg-slate-100 p-2.5 rounded-xl">
            <span className="text-[10px] text-slate-500 uppercase font-bold block">Status</span>
            <span className="font-extrabold text-emerald-700 uppercase">
              CONFIRMADO
            </span>
          </div>
        </div>

        {/* QR Code & Kit pickup instructions */}
        <div className="mt-6 pt-5 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-950 text-white rounded-xl">
              <QrCode className="w-12 h-12" />
            </div>
            <div className="text-left text-xs">
              <span className="font-black text-slate-900 block">
                QR CODE PARA RETIRADA DO KIT
              </span>
              <span className="text-slate-600 block text-[11px]">
                Apresente este código com documento original com foto.
              </span>
              <span className="text-[10px] text-slate-500 font-mono block mt-0.5">
                ID: {registration.id}
              </span>
            </div>
          </div>

          <div className="text-right text-xs text-slate-600 space-y-0.5">
            <div className="flex items-center gap-1.5 justify-end">
              <Calendar className="w-3.5 h-3.5 text-orange-600" />
              <span>15 de Novembro de 2026 • 06h30</span>
            </div>
            <div className="flex items-center gap-1.5 justify-end">
              <MapPin className="w-3.5 h-3.5 text-orange-600" />
              <span>Parque Ibirapuera, São Paulo - SP</span>
            </div>
          </div>
        </div>

      </div>

      {/* Action buttons (hidden on print) */}
      <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 no-print">
        <button
          onClick={handlePrint}
          className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20 active:scale-95 transition-all"
        >
          <Printer className="w-4 h-4" />
          <span>Imprimir / Salvar PDF</span>
        </button>

        <button
          onClick={onViewAll}
          className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-semibold text-sm flex items-center justify-center gap-2 transition-all"
        >
          <span>Ver no Painel de Inscritos</span>
        </button>

        <button
          onClick={onNewRegistration}
          className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-900/60 hover:bg-slate-800/80 text-slate-400 hover:text-white font-medium text-sm flex items-center justify-center gap-2 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Nova Inscrição</span>
        </button>
      </div>

    </div>
  );
};
