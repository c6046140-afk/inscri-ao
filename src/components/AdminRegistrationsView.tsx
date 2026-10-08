import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Download, 
  RefreshCw, 
  Database, 
  CheckCircle2, 
  AlertCircle, 
  Shirt, 
  DollarSign, 
  Calendar,
  Filter,
  UserCheck,
  Phone,
  Mail,
  PlusCircle
} from 'lucide-react';
import { MarathonRegistration } from '../types/marathon';
import { 
  isSupabaseConfigured, 
  syncPendingRegistrations, 
  saveRegistration 
} from '../lib/supabase';

interface AdminRegistrationsViewProps {
  registrations: MarathonRegistration[];
  onRefresh: () => void;
  onOpenSupabaseConfig: () => void;
  onBackToLanding: () => void;
}

export const AdminRegistrationsView: React.FC<AdminRegistrationsViewProps> = ({
  registrations,
  onRefresh,
  onOpenSupabaseConfig,
  onBackToLanding,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedKitFilter, setSelectedKitFilter] = useState<string>('todos');
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncFeedback, setSyncFeedback] = useState<string | null>(null);

  const isConnected = isSupabaseConfigured();

  // Filtros
  const filtered = registrations.filter((r) => {
    const term = searchTerm.toLowerCase();
    const matchText = 
      r.nome.toLowerCase().includes(term) ||
      r.email.toLowerCase().includes(term) ||
      r.telefone.toLowerCase().includes(term) ||
      String(r.numero_peito).includes(term);

    const matchKit = selectedKitFilter === 'todos' || r.tipo_kit === selectedKitFilter;

    return matchText && matchKit;
  });

  // Métricas
  const totalCount = registrations.length;
  const syncedCount = registrations.filter((r) => r.sync_status === 'synced').length;
  const pendingCount = totalCount - syncedCount;

  // Distribuição de tamanhos de camiseta
  const sizesSummary = registrations.reduce((acc, r) => {
    acc[r.tamanho_camiseta] = (acc[r.tamanho_camiseta] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Total arrecadado estimado
  const totalRevenue = registrations.reduce((acc, r) => {
    const price = r.tipo_kit === 'vip' ? 199.9 : r.tipo_kit === 'premium' ? 139.9 : 89.9;
    return acc + price;
  }, 0);

  const handleSyncAll = async () => {
    setIsSyncing(true);
    setSyncFeedback(null);
    try {
      const res = await syncPendingRegistrations();
      setSyncFeedback(`Sincronizado: ${res.synced} registros enviados com sucesso.`);
      onRefresh();
    } catch {
      setSyncFeedback('Erro ao sincronizar com o Supabase.');
    } finally {
      setIsSyncing(false);
    }
  };

  const handleExportCsv = () => {
    if (registrations.length === 0) return;

    const headers = [
      'Numero Peito',
      'Nome',
      'Email',
      'Telefone',
      'CPF',
      'Data Nascimento',
      'Genero',
      'Tamanho Camiseta',
      'Kit',
      'Onda/Ritmo',
      'Contato Emergencia',
      'Telefone Emergencia',
      'Observacoes Medicas',
      'Status Supabase',
      'Data Inscricao',
    ];

    const rows = registrations.map((r) => [
      r.numero_peito,
      `"${r.nome.replace(/"/g, '""')}"`,
      r.email,
      `"${r.telefone}"`,
      r.cpf || '',
      r.data_nascimento,
      r.genero,
      r.tamanho_camiseta,
      r.tipo_kit,
      r.ritmo_estimado,
      `"${r.contato_emergencia_nome.replace(/"/g, '""')}"`,
      `"${r.contato_emergencia_telefone}"`,
      `"${(r.observacoes_medicas || '').replace(/"/g, '""')}"`,
      r.sync_status,
      r.created_at,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `maratona_10k_inscritos_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSeedDemoAthletes = async () => {
    const demoAthletes = [
      {
        nome: 'Marcos Vinicius de Souza',
        email: 'marcos.vinicius@exemplo.com',
        telefone: '(11) 98711-2233',
        data_nascimento: '1992-05-14',
        genero: 'masculino' as const,
        tamanho_camiseta: 'Unissex G' as const,
        tipo_kit: 'premium' as const,
        ritmo_estimado: 'sub50' as const,
        contato_emergencia_nome: 'Fernanda Souza',
        contato_emergencia_telefone: '(11) 99888-1122',
        observacoes_medicas: 'Nenhuma alergia',
      },
      {
        nome: 'Camila Rodrigues Lima',
        email: 'camila.lima@exemplo.com',
        telefone: '(11) 97654-3210',
        data_nascimento: '1996-09-21',
        genero: 'feminino' as const,
        tamanho_camiseta: 'Baby Look M' as const,
        tipo_kit: 'vip' as const,
        ritmo_estimado: 'sub40' as const,
        contato_emergencia_nome: 'Roberto Lima',
        contato_emergencia_telefone: '(11) 97777-4433',
        observacoes_medicas: 'Tipo sanguíneo O+',
      },
      {
        nome: 'Lucas Gabriel Martins',
        email: 'lucas.martins@exemplo.com',
        telefone: '(21) 99234-5678',
        data_nascimento: '1988-12-03',
        genero: 'masculino' as const,
        tamanho_camiseta: 'Unissex M' as const,
        tipo_kit: 'essencial' as const,
        ritmo_estimado: 'sub60' as const,
        contato_emergencia_nome: 'Patricia Martins',
        contato_emergencia_telefone: '(21) 98888-2233',
      },
    ];

    for (const d of demoAthletes) {
      await saveRegistration(d);
    }
    onRefresh();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-in fade-in duration-200">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <button
            onClick={onBackToLanding}
            className="text-xs text-orange-400 hover:underline font-bold uppercase tracking-wider mb-1 block"
          >
            ← Voltar para a Página de Inscrição
          </button>
          <h1 className="text-3xl font-black text-white tracking-tight uppercase">
            Painel Geral de Inscritos
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">
            Gerenciamento oficial dos atletas para a Maratona 10 Km e sincronização com Supabase.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={onOpenSupabaseConfig}
            className={`px-4 py-2 rounded-xl text-xs font-bold border flex items-center gap-2 transition-all ${
              isConnected
                ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                : 'bg-amber-950/40 border-amber-500/40 text-amber-300 animate-pulse'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>Supabase: {isConnected ? 'Ativo' : 'Pendente de Configuração'}</span>
          </button>

          <button
            onClick={handleExportCsv}
            disabled={registrations.length === 0}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white flex items-center gap-2 transition-all disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>Exportar CSV</span>
          </button>

          <button
            onClick={onRefresh}
            className="p-2 rounded-xl text-slate-300 hover:text-white bg-slate-900 border border-slate-800 hover:bg-slate-800 transition-colors"
            title="Atualizar dados"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Athletes */}
        <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs uppercase font-bold tracking-wider">Atletas Inscritos</span>
            <Users className="w-4 h-4 text-orange-400" />
          </div>
          <div className="text-3xl font-black text-white font-mono">{totalCount}</div>
          <span className="text-xs text-slate-400 mt-1 block">Vagas preenchidas</span>
        </div>

        {/* Total Estimated Revenue */}
        <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs uppercase font-bold tracking-wider">Receita Prevista</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-black text-emerald-400 font-mono">
            R$ {totalRevenue.toFixed(2).replace('.', ',')}
          </div>
          <span className="text-xs text-slate-400 mt-1 block">Kits Essencial, Premium e VIP</span>
        </div>

        {/* Supabase Status */}
        <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs uppercase font-bold tracking-wider">Status Nuvem (Supabase)</span>
            <Database className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-3xl font-black text-white font-mono">
            {syncedCount} <span className="text-sm font-normal text-slate-500">/ {totalCount}</span>
          </div>
          <div className="flex items-center justify-between mt-1 text-xs">
            <span className={pendingCount > 0 ? 'text-amber-400 font-semibold' : 'text-emerald-400'}>
              {pendingCount > 0 ? `${pendingCount} pendente(s)` : '100% Sincronizado'}
            </span>
            {pendingCount > 0 && isConnected && (
              <button
                onClick={handleSyncAll}
                disabled={isSyncing}
                className="text-[11px] underline text-orange-400 hover:text-orange-300"
              >
                {isSyncing ? 'Enviando...' : 'Sincronizar'}
              </button>
            )}
          </div>
        </div>

        {/* Camisetas mais pedidas */}
        <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs uppercase font-bold tracking-wider">Tamanhos Principais</span>
            <Shirt className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-xs text-slate-300 space-y-1">
            {Object.keys(sizesSummary).length === 0 ? (
              <span className="text-slate-500 italic">Sem registros ainda</span>
            ) : (
              Object.entries(sizesSummary)
                .slice(0, 3)
                .map(([size, qty]) => (
                  <div key={size} className="flex justify-between font-mono">
                    <span className="truncate pr-2">{size}:</span>
                    <strong className="text-white">{qty} un.</strong>
                  </div>
                ))
            )}
          </div>
        </div>

      </div>

      {syncFeedback && (
        <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-xs text-emerald-300">
          {syncFeedback}
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nome, e-mail, telefone ou número..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 pl-9 pr-4 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
          />
        </div>

        {/* Filter by Kit */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <span className="text-xs text-slate-400">Kit:</span>
          <select
            value={selectedKitFilter}
            onChange={(e) => setSelectedKitFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl py-1.5 px-3 text-xs text-white focus:outline-none focus:border-orange-500"
          >
            <option value="todos">Todos os Kits</option>
            <option value="essencial">Kit Essencial</option>
            <option value="premium">Kit Premium</option>
            <option value="vip">Kit VIP</option>
          </select>
        </div>

      </div>

      {/* Table of Runners */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        {filtered.length === 0 ? (
          <div className="p-12 text-center">
            <UserCheck className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-base font-bold text-white">Nenhum atleta encontrado</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              {totalCount === 0
                ? 'Nenhuma inscrição foi realizada ainda. Faça a primeira inscrição na página inicial ou adicione atletas de exemplo.'
                : 'Nenhum resultado para a busca aplicada.'}
            </p>

            {totalCount === 0 && (
              <div className="mt-5 flex items-center justify-center gap-3">
                <button
                  onClick={onBackToLanding}
                  className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs uppercase"
                >
                  Ir para Inscrição
                </button>
                <button
                  onClick={handleSeedDemoAthletes}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs flex items-center gap-1.5"
                >
                  <PlusCircle className="w-3.5 h-3.5" /> Inserir 3 atletas de teste
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 uppercase font-bold tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Peito</th>
                  <th className="py-3.5 px-4">Atleta</th>
                  <th className="py-3.5 px-4">Contato</th>
                  <th className="py-3.5 px-4">Camiseta</th>
                  <th className="py-3.5 px-4">Kit</th>
                  <th className="py-3.5 px-4">Onda / Ritmo</th>
                  <th className="py-3.5 px-4">Emergência</th>
                  <th className="py-3.5 px-4">Supabase</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                    {/* Bib Number */}
                    <td className="py-3 px-4 font-mono font-bold text-orange-400 text-sm whitespace-nowrap">
                      #{item.numero_peito}
                    </td>

                    {/* Athlete Name & Genero */}
                    <td className="py-3 px-4">
                      <span className="font-bold text-white block">{item.nome}</span>
                      <span className="text-[11px] text-slate-500 capitalize">
                        {item.genero} • Nasc: {item.data_nascimento || 'N/A'}
                      </span>
                    </td>

                    {/* Email & Phone */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 text-slate-200">
                        <Mail className="w-3 h-3 text-slate-500" />
                        <span>{item.email}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-400 mt-0.5 font-mono text-[11px]">
                        <Phone className="w-3 h-3 text-slate-500" />
                        <span>{item.telefone}</span>
                      </div>
                    </td>

                    {/* Camiseta */}
                    <td className="py-3 px-4 whitespace-nowrap font-medium text-slate-200">
                      {item.tamanho_camiseta}
                    </td>

                    {/* Kit */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                          item.tipo_kit === 'vip'
                            ? 'bg-purple-900/60 text-purple-300 border border-purple-700/60'
                            : item.tipo_kit === 'premium'
                            ? 'bg-amber-900/60 text-amber-300 border border-amber-700/60'
                            : 'bg-slate-800 text-slate-300 border border-slate-700'
                        }`}
                      >
                        {item.tipo_kit}
                      </span>
                    </td>

                    {/* Ritmo */}
                    <td className="py-3 px-4 whitespace-nowrap text-slate-300 uppercase font-mono text-[11px]">
                      {item.ritmo_estimado}
                    </td>

                    {/* Emergencia */}
                    <td className="py-3 px-4">
                      <span className="text-white block font-medium">
                        {item.contato_emergencia_nome}
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono block">
                        {item.contato_emergencia_telefone}
                      </span>
                    </td>

                    {/* Supabase status badge */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      {item.sync_status === 'synced' ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Nuvem
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-400">
                          <AlertCircle className="w-3.5 h-3.5" /> Local
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};
