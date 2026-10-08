import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Award, Activity, Heart, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

interface RaceHeroProps {
  onRegisterClick: () => void;
  inscritosCount: number;
}

export const RaceHero: React.FC<RaceHeroProps> = ({ onRegisterClick, inscritosCount }) => {
  // Contagem regressiva para a prova (15 de Novembro de 2026)
  const targetDate = new Date('2026-11-15T06:30:00');
  
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTime = () => {
      const now = new Date().getTime();
      const difference = targetDate.getTime() - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        setTimeLeft({ days: 38, hours: 14, minutes: 22, seconds: 50 });
      }
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative overflow-hidden pt-8 pb-16 lg:pt-16 lg:pb-24 border-b border-slate-800/60 bg-gradient-to-b from-slate-950 via-slate-900/40 to-slate-950">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-orange-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[350px] h-[350px] bg-amber-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Announcement Pill */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-slate-900/90 border border-orange-500/30 text-slate-200 text-xs sm:text-sm font-medium shadow-inner shadow-orange-500/10">
            <span className="flex h-2 w-2 rounded-full bg-orange-400 animate-ping" />
            <span className="text-orange-400 font-bold uppercase tracking-wider text-[11px]">Inscrições Abertas</span>
            <span className="text-slate-400">•</span>
            <span>Lote Promocional Disponível</span>
          </div>
        </div>

        {/* Main Headline */}
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white uppercase leading-[1.08]">
            SUPERE CADA METRO. <br />
            <span className="bg-gradient-to-r from-orange-400 via-amber-300 to-yellow-400 bg-clip-text text-transparent">
              MARATONA 10 KM
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-lg lg:text-xl text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
            Percurso 100% plano e aferido, hidratação a cada 2,5 km, cronometragem eletrônica de alta precisão e medalha finisher premium.
          </p>

          {/* Quick Info Badges */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs sm:text-sm text-slate-300">
            <div className="flex items-center gap-2 bg-slate-900/80 px-3.5 py-2 rounded-xl border border-slate-800">
              <Calendar className="w-4 h-4 text-orange-400" />
              <span className="font-semibold text-white">15 de Novembro de 2026</span>
            </div>
            <div className="flex items-center gap-2 bg-slate-900/80 px-3.5 py-2 rounded-xl border border-slate-800">
              <Clock className="w-4 h-4 text-orange-400" />
              <span>Largada: <strong className="text-white">06h30</strong></span>
            </div>
            <div className="flex items-center gap-2 bg-slate-900/80 px-3.5 py-2 rounded-xl border border-slate-800">
              <MapPin className="w-4 h-4 text-orange-400" />
              <span>Parque Ibirapuera • São Paulo, SP</span>
            </div>
          </div>

          {/* CTAs */}
          <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onRegisterClick}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold text-base tracking-wide uppercase shadow-xl shadow-orange-500/25 flex items-center justify-center gap-3 group active:scale-95 transition-all"
            >
              <span>Inscrever-se Agora</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>

            <a
              href="#percurso"
              className="w-full sm:w-auto px-6 py-4 rounded-xl bg-slate-900/80 hover:bg-slate-850 border border-slate-800 text-slate-300 hover:text-white font-bold text-sm tracking-wide uppercase transition-all flex items-center justify-center gap-2"
            >
              <Activity className="w-4 h-4 text-slate-400" />
              <span>Ver Percurso & Altimetria</span>
            </a>
          </div>

          {/* Live counter of registered runners */}
          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Mais de <strong className="text-white font-semibold">{inscritosCount > 10 ? inscritosCount : 1240} atletas</strong> inscritos para a edição deste ano.</span>
          </div>
        </div>

        {/* Countdown Box */}
        <div className="mt-14 max-w-2xl mx-auto bg-slate-900/70 border border-slate-800/90 rounded-2xl p-4 sm:p-6 backdrop-blur-md shadow-2xl">
          <div className="text-center mb-3">
            <span className="text-xs uppercase tracking-widest text-orange-400 font-bold">
              Contagem Regressiva para a Largada
            </span>
          </div>

          <div className="grid grid-cols-4 gap-2 sm:gap-4 text-center">
            <div className="bg-slate-950/70 p-3 sm:p-4 rounded-xl border border-slate-800">
              <span className="block text-2xl sm:text-4xl font-black text-white font-mono">
                {String(timeLeft.days).padStart(2, '0')}
              </span>
              <span className="text-[10px] sm:text-xs text-slate-400 uppercase font-semibold">Dias</span>
            </div>
            <div className="bg-slate-950/70 p-3 sm:p-4 rounded-xl border border-slate-800">
              <span className="block text-2xl sm:text-4xl font-black text-white font-mono">
                {String(timeLeft.hours).padStart(2, '0')}
              </span>
              <span className="text-[10px] sm:text-xs text-slate-400 uppercase font-semibold">Horas</span>
            </div>
            <div className="bg-slate-950/70 p-3 sm:p-4 rounded-xl border border-slate-800">
              <span className="block text-2xl sm:text-4xl font-black text-white font-mono">
                {String(timeLeft.minutes).padStart(2, '0')}
              </span>
              <span className="text-[10px] sm:text-xs text-slate-400 uppercase font-semibold">Minutos</span>
            </div>
            <div className="bg-slate-950/70 p-3 sm:p-4 rounded-xl border border-slate-800">
              <span className="block text-2xl sm:text-4xl font-black text-orange-400 font-mono">
                {String(timeLeft.seconds).padStart(2, '0')}
              </span>
              <span className="text-[10px] sm:text-xs text-slate-400 uppercase font-semibold">Segundos</span>
            </div>
          </div>
        </div>

        {/* Feature Highlights Grid */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-900/50 border border-slate-800 p-5 rounded-2xl flex items-start gap-4">
            <div className="p-3 rounded-xl bg-orange-500/10 text-orange-400 border border-orange-500/20">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Circuito Rápido 10K</h4>
              <p className="text-xs text-slate-400 mt-1">Percurso plano, ideal para quem busca quebrar seu recorde pessoal (PR).</p>
            </div>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 p-5 rounded-2xl flex items-start gap-4">
            <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Medalha Finisher de Metal</h4>
              <p className="text-xs text-slate-400 mt-1">Design exclusivo, banho fosco com fita acetinada comemorativa.</p>
            </div>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 p-5 rounded-2xl flex items-start gap-4">
            <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Chip RFID de Precisão</h4>
              <p className="text-xs text-slate-400 mt-1">Resultados e tempo líquido em tempo real no app e por SMS.</p>
            </div>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 p-5 rounded-2xl flex items-start gap-4">
            <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Heart className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Suporte Médico Completo</h4>
              <p className="text-xs text-slate-400 mt-1">Ambulâncias UTI móvel, postos médicos e isotônicos no percurso.</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
