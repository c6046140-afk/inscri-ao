import React, { useState, useEffect, useRef } from 'react';
import { MarathonHeader } from './components/MarathonHeader';
import { RaceHero } from './components/RaceHero';
import { RegistrationForm } from './components/RegistrationForm';
import { VoucherCard } from './components/VoucherCard';
import { CourseInfo } from './components/CourseInfo';
import { AdminRegistrationsView } from './components/AdminRegistrationsView';
import { SupabaseConfigModal } from './components/SupabaseConfigModal';
import { MarathonRegistration } from './types/marathon';
import { fetchAllRegistrations, isSupabaseConfigured } from './lib/supabase';
import { 
  Trophy, 
  HelpCircle, 
  ShieldCheck, 
  Clock, 
  Mail, 
  Phone, 
  MapPin, 
  ChevronDown, 
  Sparkles,
  Database
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'landing' | 'admin'>('landing');
  const [confirmedRegistration, setConfirmedRegistration] = useState<MarathonRegistration | null>(null);
  const [savedToSupabase, setSavedToSupabase] = useState(false);
  const [supabaseModalOpen, setSupabaseModalOpen] = useState(false);
  const [registrations, setRegistrations] = useState<MarathonRegistration[]>([]);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const formSectionRef = useRef<HTMLDivElement>(null);

  const loadData = async () => {
    const res = await fetchAllRegistrations();
    setRegistrations(res.registrations);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleScrollToForm = () => {
    setActiveTab('landing');
    setConfirmedRegistration(null);
    setTimeout(() => {
      const el = document.getElementById('inscricao');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const handleRegistrationSuccess = (reg: MarathonRegistration, toSupabase: boolean) => {
    setConfirmedRegistration(reg);
    setSavedToSupabase(toSupabase);
    loadData();
    window.scrollTo({ top: 400, behavior: 'smooth' });
  };

  const faqs = [
    {
      q: 'Onde e quando será feita a entrega dos kits?',
      a: 'A entrega dos kits acontecerá nos dias 13 e 14 de Novembro de 2026, das 10h às 20h, na Expo Maratona localizada no Pavilhão da Bienal (Parque Ibirapuera). É obrigatório apresentar documento com foto e o QR Code gerado no comprovante.',
    },
    {
      q: 'Qual é o tempo limite para completar os 10 km?',
      a: 'O tempo limite oficial da prova é de 2 horas e 15 minutos (pace de até 13:30 min/km), permitindo que tanto atletas de corrida quanto praticantes de caminhada concluam a prova com segurança e recebam sua medalha.',
    },
    {
      q: 'Haverá guarda-volumes na arena?',
      a: 'Sim! O serviço de guarda-volumes estará disponível a partir das 05h30 para todos os inscritos. Para participantes do Kit VIP, haverá uma tenda exclusiva de guarda-volumes privativa com acesso rápido.',
    },
    {
      q: 'Como o sistema salva as informações no Supabase?',
      a: 'O sistema utiliza o SDK oficial do Supabase (@supabase/supabase-js). Se você já inseriu a Project URL e Anon Key no modal do Supabase ou no arquivo .env, as inscrições são salvas imediatamente na tabela "maratona_inscricoes". Caso configure depois, os dados ficam protegidos no navegador e podem ser sincronizados com 1 clique!',
    },
  ];

  const isConfigured = isSupabaseConfigured();

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-orange-500 selection:text-white">
      
      {/* Top Header */}
      <MarathonHeader
        onOpenSupabaseConfig={() => setSupabaseModalOpen(true)}
        onOpenAdmin={() => setActiveTab('admin')}
        onScrollToForm={handleScrollToForm}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        totalInscritosCount={registrations.length}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'admin' ? (
          <AdminRegistrationsView
            registrations={registrations}
            onRefresh={loadData}
            onOpenSupabaseConfig={() => setSupabaseModalOpen(true)}
            onBackToLanding={() => setActiveTab('landing')}
          />
        ) : (
          <>
            {/* Hero Section */}
            <RaceHero
              onRegisterClick={handleScrollToForm}
              inscritosCount={registrations.length}
            />

            {/* Registration Area */}
            <section ref={formSectionRef} className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
              {confirmedRegistration ? (
                <VoucherCard
                  registration={confirmedRegistration}
                  savedToSupabase={savedToSupabase}
                  onNewRegistration={() => setConfirmedRegistration(null)}
                  onViewAll={() => setActiveTab('admin')}
                />
              ) : (
                <RegistrationForm
                  onSuccess={handleRegistrationSuccess}
                  onOpenSupabaseConfig={() => setSupabaseModalOpen(true)}
                />
              )}
            </section>

            {/* Course & Elevation Profile */}
            <CourseInfo />

            {/* FAQ Section */}
            <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto border-b border-slate-800/80">
              <div className="text-center mb-10">
                <span className="text-xs uppercase font-extrabold tracking-widest text-orange-400">
                  Tire Suas Dúvidas
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight mt-1">
                  Perguntas Frequentes
                </h3>
              </div>

              <div className="space-y-3">
                {faqs.map((faq, idx) => (
                  <div
                    key={idx}
                    className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden transition-all"
                  >
                    <button
                      onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                      className="w-full p-5 text-left font-bold text-sm sm:text-base text-white flex items-center justify-between gap-4"
                    >
                      <span className="flex items-center gap-3">
                        <HelpCircle className="w-4 h-4 text-orange-400 shrink-0" />
                        {faq.q}
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${
                          openFaq === idx ? 'rotate-180 text-orange-400' : ''
                        }`}
                      />
                    </button>
                    {openFaq === idx && (
                      <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-300 border-t border-slate-800/60 leading-relaxed">
                        {faq.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-800/80 text-slate-400 text-xs py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-white text-sm">
                MARATONA 10 KM • EDIÇÃO OFICIAL
              </span>
              <p className="text-[11px] text-slate-500">
                Homologação técnica e aferição oficial de percurso.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-slate-400">
            <button
              onClick={() => setSupabaseModalOpen(true)}
              className="hover:text-orange-400 flex items-center gap-1.5 transition-colors"
            >
              <Database className="w-3.5 h-3.5" />
              <span>Supabase {isConfigured ? '(Ativo)' : '(Configurar)'}</span>
            </button>
            <a href="#percurso" className="hover:text-white transition-colors">
              Altimetria 10K
            </a>
            <button
              onClick={() => setActiveTab('admin')}
              className="hover:text-white transition-colors"
            >
              Painel do Organizador
            </button>
          </div>

          <div className="text-center md:text-right text-[11px] text-slate-500">
            <span>© 2026 Maratona 10 Km Oficial. Todos os direitos reservados.</span>
          </div>
        </div>
      </footer>

      {/* Supabase Configuration Modal */}
      <SupabaseConfigModal
        isOpen={supabaseModalOpen}
        onClose={() => setSupabaseModalOpen(false)}
        onConfigSaved={loadData}
      />

    </div>
  );
}
