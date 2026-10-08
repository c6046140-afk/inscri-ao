import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  Activity, 
  AlertTriangle, 
  ShieldAlert, 
  Sparkles, 
  Database,
  CheckCircle2,
  Lock,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { KitSelector } from './KitSelector';
import { Genero, TamanhoCamiseta, TipoKit, RitmoEstimado, MarathonRegistration } from '../types/marathon';
import { saveRegistration, isSupabaseConfigured } from '../lib/supabase';

interface RegistrationFormProps {
  onSuccess: (registration: MarathonRegistration, savedToSupabase: boolean) => void;
  onOpenSupabaseConfig: () => void;
}

export const RegistrationForm: React.FC<RegistrationFormProps> = ({ 
  onSuccess,
  onOpenSupabaseConfig 
}) => {
  // Form state
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [cpf, setCpf] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [genero, setGenero] = useState<Genero>('masculino');
  const [tamanhoCamiseta, setTamanhoCamiseta] = useState<TamanhoCamiseta>('Unissex M');
  const [tipoKit, setTipoKit] = useState<TipoKit>('premium');
  const [ritmoEstimado, setRitmoEstimado] = useState<RitmoEstimado>('sub50');
  const [contatoEmergenciaNome, setContatoEmergenciaNome] = useState('');
  const [contatoEmergenciaTelefone, setContatoEmergenciaTelefone] = useState('');
  const [observacoesMedicas, setObservacoesMedicas] = useState('');
  const [aceitouTermos, setAceitouTermos] = useState(false);

  // Status
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Phone mask helper: (XX) XXXXX-XXXX
  const handlePhoneChange = (val: string, setter: (v: string) => void) => {
    let digits = val.replace(/\D/g, '');
    if (digits.length > 11) digits = digits.slice(0, 11);
    
    if (digits.length <= 2) {
      setter(digits.length ? `(${digits}` : '');
    } else if (digits.length <= 7) {
      setter(`(${digits.slice(0, 2)}) ${digits.slice(2)}`);
    } else {
      setter(`(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`);
    }
  };

  // CPF mask helper: XXX.XXX.XXX-XX
  const handleCpfChange = (val: string) => {
    let digits = val.replace(/\D/g, '');
    if (digits.length > 11) digits = digits.slice(0, 11);
    
    if (digits.length <= 3) {
      setCpf(digits);
    } else if (digits.length <= 6) {
      setCpf(`${digits.slice(0, 3)}.${digits.slice(3)}`);
    } else if (digits.length <= 9) {
      setCpf(`${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`);
    } else {
      setCpf(`${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validações essenciais
    if (!nome.trim() || nome.trim().split(' ').length < 2) {
      setErrorMessage('Por favor, informe seu nome completo (nome e sobrenome).');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email.trim())) {
      setErrorMessage('Por favor, informe um endereço de e-mail válido.');
      return;
    }

    const phoneDigits = telefone.replace(/\D/g, '');
    if (phoneDigits.length < 10) {
      setErrorMessage('Por favor, informe um telefone válido com DDD (mínimo 10 dígitos).');
      return;
    }

    if (!dataNascimento) {
      setErrorMessage('Por favor, selecione sua data de nascimento.');
      return;
    }

    if (!contatoEmergenciaNome.trim() || !contatoEmergenciaTelefone.trim()) {
      setErrorMessage('Para sua segurança na prova, informe o nome e telefone do contato de emergência.');
      return;
    }

    if (!aceitouTermos) {
      setErrorMessage('Você deve aceitar o regulamento e termo de responsabilidade médica para participar.');
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await saveRegistration({
        nome: nome.trim(),
        email: email.trim().toLowerCase(),
        telefone: telefone.trim(),
        cpf: cpf.trim() || undefined,
        data_nascimento: dataNascimento,
        genero,
        tamanho_camiseta: tamanhoCamiseta,
        tipo_kit: tipoKit,
        ritmo_estimado: ritmoEstimado,
        contato_emergencia_nome: contatoEmergenciaNome.trim(),
        contato_emergencia_telefone: contatoEmergenciaTelefone.trim(),
        observacoes_medicas: observacoesMedicas.trim() || undefined,
      });

      // Disparar confetes
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#f97316', '#eab308', '#38bdf8', '#22c55e'],
      });

      onSuccess(result.registration, result.savedToSupabase);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setErrorMessage(`Ocorreu um erro ao processar a inscrição: ${msg}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const supabaseReady = isSupabaseConfigured();

  return (
    <div id="inscricao" className="scroll-mt-24 max-w-4xl mx-auto">
      
      {/* Form Container */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden backdrop-blur-xl">
        
        {/* Glow decoration */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Section Header */}
        <div className="border-b border-slate-800 pb-6 mb-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-xs uppercase font-extrabold tracking-widest text-orange-400">
                Inscrição Oficial • 10 Km
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight mt-1">
                Ficha de Cadastro do Atleta
              </h2>
              <p className="text-sm text-slate-400 mt-1">
                Preencha seus dados abaixo para garantir seu número de peito e chip de cronometragem.
              </p>
            </div>

            {/* Supabase status indicator */}
            <div 
              onClick={onOpenSupabaseConfig}
              className={`cursor-pointer px-3.5 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-all ${
                supabaseReady
                  ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300 hover:border-emerald-500'
                  : 'bg-amber-950/40 border-amber-500/40 text-amber-300 hover:border-amber-500'
              }`}
              title="Clique para ver/configurar credenciais do Supabase"
            >
              <Database className="w-3.5 h-3.5" />
              <span>
                {supabaseReady ? 'Supabase Conectado' : 'Supabase: Pronto para conectar'}
              </span>
            </div>
          </div>
        </div>

        {errorMessage && (
          <div className="mb-6 p-4 rounded-xl bg-red-950/60 border border-red-500/50 text-red-200 text-sm flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Atenção no formulário:</span>
              <p className="mt-0.5 text-xs text-red-300">{errorMessage}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* GRUPO 1: DADOS OBRIGATÓRIOS (Nome, E-mail, Telefone, CPF) */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-orange-400 flex items-center gap-2">
              <User className="w-4 h-4" />
              1. Identificação do Corredor
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Nome */}
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wide mb-1.5">
                  Nome Completo <span className="text-orange-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    placeholder="Ex: Carlos Eduardo de Oliveira"
                    className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wide mb-1.5">
                  E-mail de Confirmação <span className="text-orange-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu.email@exemplo.com"
                    className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors"
                  />
                </div>
              </div>

              {/* Telefone */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wide mb-1.5">
                  Telefone / WhatsApp <span className="text-orange-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    value={telefone}
                    onChange={(e) => handlePhoneChange(e.target.value, setTelefone)}
                    placeholder="(11) 98765-4321"
                    className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors font-mono"
                  />
                </div>
              </div>

              {/* Data de Nascimento */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wide mb-1.5">
                  Data de Nascimento <span className="text-orange-500">*</span>
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="date"
                    required
                    value={dataNascimento}
                    onChange={(e) => setDataNascimento(e.target.value)}
                    className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors"
                  />
                </div>
              </div>

              {/* CPF / Documento */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wide mb-1.5">
                  CPF (para seguro da prova)
                </label>
                <input
                  type="text"
                  value={cpf}
                  onChange={(e) => handleCpfChange(e.target.value)}
                  placeholder="000.000.000-00"
                  className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl py-3 px-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors font-mono"
                />
              </div>

              {/* Gênero */}
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wide mb-1.5">
                  Categoria de Premiação / Gênero
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'masculino', label: 'Masculino' },
                    { id: 'feminino', label: 'Feminino' },
                    { id: 'outro', label: 'Outro' },
                    { id: 'prefiro_nao_dizer', label: 'Prefiro não dizer' },
                  ].map((item) => (
                    <button
                      type="button"
                      key={item.id}
                      onClick={() => setGenero(item.id as Genero)}
                      className={`py-2 px-3 rounded-xl text-xs font-medium border text-center transition-all ${
                        genero === item.id
                          ? 'bg-orange-500/20 border-orange-500 text-orange-300 font-bold'
                          : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* GRUPO 2: ESCOLHA DO KIT */}
          <div className="pt-4 border-t border-slate-800">
            <KitSelector selectedKit={tipoKit} onSelectKit={setTipoKit} />
          </div>

          {/* GRUPO 3: TAMANHO DA CAMISETA & RITMO DE CORRIDA */}
          <div className="pt-4 border-t border-slate-800 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-orange-400 flex items-center gap-2">
              <Activity className="w-4 h-4" />
              2. Camiseta & Onda de Largada
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Tamanho Camiseta */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wide mb-1.5">
                  Tamanho da Camiseta Dry-Fit <span className="text-orange-500">*</span>
                </label>
                <select
                  value={tamanhoCamiseta}
                  onChange={(e) => setTamanhoCamiseta(e.target.value as TamanhoCamiseta)}
                  className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors"
                >
                  <optgroup label="Modelagem Baby Look (Feminina)">
                    <option value="Baby Look P">Baby Look P (Busto 42cm / Comp 58cm)</option>
                    <option value="Baby Look M">Baby Look M (Busto 45cm / Comp 60cm)</option>
                    <option value="Baby Look G">Baby Look G (Busto 48cm / Comp 62cm)</option>
                    <option value="Baby Look GG">Baby Look GG (Busto 52cm / Comp 64cm)</option>
                  </optgroup>
                  <optgroup label="Modelagem Unissex / Tradicional">
                    <option value="Unissex P">Unissex P (Tórax 50cm / Comp 68cm)</option>
                    <option value="Unissex M">Unissex M (Tórax 53cm / Comp 70cm)</option>
                    <option value="Unissex G">Unissex G (Tórax 56cm / Comp 72cm)</option>
                    <option value="Unissex GG">Unissex GG (Tórax 60cm / Comp 75cm)</option>
                    <option value="Unissex XGG">Unissex XGG (Tórax 64cm / Comp 78cm)</option>
                  </optgroup>
                </select>
                <p className="text-[11px] text-slate-400 mt-1">
                  Tecido 100% poliamida com proteção UV25+, secagem ultra-rápida.
                </p>
              </div>

              {/* Ritmo Estimado / Onda de largada */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wide mb-1.5">
                  Seu Ritmo Estimado nos 10 Km <span className="text-orange-500">*</span>
                </label>
                <select
                  value={ritmoEstimado}
                  onChange={(e) => setRitmoEstimado(e.target.value as RitmoEstimado)}
                  className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors"
                >
                  <option value="sub40">Onda A: Elite / Ritmo forte (Abaixo de 40 min - pace &lt; 4:00/km)</option>
                  <option value="sub50">Onda B: Avançado (Entre 40 e 50 min - pace 4:00 a 5:00/km)</option>
                  <option value="sub60">Onda C: Intermediário (Entre 50 e 60 min - pace 5:00 a 6:00/km)</option>
                  <option value="acima60">Onda D: Conclusão / Iniciante (Acima de 60 min - pace &gt; 6:00/km)</option>
                  <option value="caminhada">Onda E: Caminhada / Trote descontraído</option>
                </select>
                <p className="text-[11px] text-slate-400 mt-1">
                  Organizamos os atletas por ondas de largada para evitar congestionamentos.
                </p>
              </div>
            </div>
          </div>

          {/* GRUPO 4: CONTATO DE EMERGÊNCIA & SAÚDE */}
          <div className="pt-4 border-t border-slate-800 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-orange-400 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4" />
              3. Segurança Médica & Contato de Emergência
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wide mb-1.5">
                  Nome do Contato de Emergência <span className="text-orange-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={contatoEmergenciaNome}
                  onChange={(e) => setContatoEmergenciaNome(e.target.value)}
                  placeholder="Nome de um familiar ou amigo"
                  className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl py-3 px-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wide mb-1.5">
                  Telefone de Emergência <span className="text-orange-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={contatoEmergenciaTelefone}
                  onChange={(e) => handlePhoneChange(e.target.value, setContatoEmergenciaTelefone)}
                  placeholder="(11) 99999-9999"
                  className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl py-3 px-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors font-mono"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wide mb-1.5">
                  Alergias, medicamentos de uso contínuo ou condições médicas (opcional)
                </label>
                <input
                  type="text"
                  value={observacoesMedicas}
                  onChange={(e) => setObservacoesMedicas(e.target.value)}
                  placeholder="Ex: Hipertenso, alérgico a dipirona, tipo sanguíneo O+, etc."
                  className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl py-2.5 px-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors"
                />
              </div>
            </div>
          </div>

          {/* TERMOS E RESPONSABILIDADE */}
          <div className="pt-4 border-t border-slate-800">
            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                required
                checked={aceitouTermos}
                onChange={(e) => setAceitouTermos(e.target.checked)}
                className="mt-1 w-4 h-4 rounded text-orange-500 bg-slate-950 border-slate-700 focus:ring-orange-500 cursor-pointer"
              />
              <span className="text-xs text-slate-400 group-hover:text-slate-300 leading-relaxed">
                Declaro que estou em plenas condições físicas e psicológicas para participar da 
                <strong className="text-white"> Maratona 10 Km</strong>, assumo total responsabilidade por 
                minha saúde e concordo com o regulamento oficial e política de privacidade da prova.
              </span>
            </label>
          </div>

          {/* SUBMIT BUTTON */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-4 px-6 rounded-2xl font-extrabold text-base tracking-wide uppercase transition-all flex items-center justify-center gap-3 shadow-xl ${
                isSubmitting
                  ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-orange-500/25 active:scale-[0.99]'
              }`}
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  <span>Gravando Inscrição...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>Confirmar Inscrição na Maratona 10K</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>

            {/* Note about Supabase status */}
            <div className="mt-3 text-center">
              {supabaseReady ? (
                <p className="text-xs text-emerald-400 flex items-center justify-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Conexão ativa com o Supabase: esta inscrição será salva na nuvem instantaneamente.
                </p>
              ) : (
                <p className="text-xs text-amber-300/90 flex items-center justify-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-amber-400" />
                  Salvo com segurança localmente. Conecte sua URL e Chave do Supabase no topo da página a qualquer momento para sincronizar.
                </p>
              )}
            </div>
          </div>

        </form>

      </div>
    </div>
  );
};
