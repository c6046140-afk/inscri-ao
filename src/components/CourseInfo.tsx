import React from 'react';
import { MapPin, Droplets, HeartPulse, Flag, Award, Clock, ArrowUpRight } from 'lucide-react';

export const CourseInfo: React.FC = () => {
  return (
    <section id="percurso" className="py-16 border-b border-slate-800/80 bg-slate-950/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs uppercase font-extrabold tracking-widest text-orange-400">
            Percurso Oficial 10.000m
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight mt-1">
            Altimetria Rápida & Estrutura de Apoio
          </h2>
          <p className="text-slate-400 text-sm mt-2">
            Desenhado para você bater o seu recorde pessoal: asfalto impecável, vias amplas e 
            estrutura de hidratação a cada 2,5 km com fiscais de prova homologados.
          </p>
        </div>

        {/* Visual Course Diagram & Elevation */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          
          {/* Main Course Details Card */}
          <div className="lg:col-span-2 bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Perfil de Altimetria & Traçado
                </span>
                <span className="px-2.5 py-1 rounded-full text-[11px] font-black bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Desnível Máximo: 28m (Plano)
                </span>
              </div>

              {/* Graphic elevation track */}
              <div className="bg-slate-950 border border-slate-800/90 rounded-2xl p-4 sm:p-6 my-4 relative overflow-hidden">
                <div className="flex items-end justify-between h-32 gap-1 px-2 pt-6">
                  {[
                    { km: 'Km 0', alt: 35, label: 'Largada' },
                    { km: 'Km 1', alt: 38 },
                    { km: 'Km 2', alt: 42 },
                    { km: 'Km 3', alt: 36, label: 'Hidratação 1' },
                    { km: 'Km 4', alt: 33 },
                    { km: 'Km 5', alt: 39, label: 'Retorno 5K' },
                    { km: 'Km 6', alt: 41 },
                    { km: 'Km 7', alt: 37, label: 'Isotônico' },
                    { km: 'Km 8', alt: 44 },
                    { km: 'Km 9', alt: 40 },
                    { km: 'Km 10', alt: 35, label: 'Chegada!' },
                  ].map((bar, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1.5 group">
                      <div className="text-[10px] text-slate-500 font-mono opacity-0 group-hover:opacity-100 transition-opacity">
                        {bar.alt}m
                      </div>
                      <div 
                        style={{ height: `${bar.alt}%` }}
                        className={`w-full rounded-t-md transition-all ${
                          i === 0 || i === 10
                            ? 'bg-gradient-to-t from-orange-600 to-amber-400'
                            : i === 5
                            ? 'bg-blue-500/80'
                            : 'bg-slate-700 hover:bg-slate-500'
                        }`}
                      />
                      <span className="text-[10px] text-slate-400 font-mono mt-1 font-semibold">
                        {bar.km}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
                    <span>Largada / Chegada na Arena Principal</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                    <span>Posto de Cronometragem Intermediária (5K)</span>
                  </div>
                </div>
              </div>

              {/* Waypoints */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
                <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/60">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-orange-400 block">
                    Ponto de Largada
                  </span>
                  <span className="text-xs font-bold text-white block mt-0.5">
                    Portão 10 - Ibirapuera
                  </span>
                  <span className="text-[11px] text-slate-400 block mt-0.5">
                    Vias largas e isoladas pela CET
                  </span>
                </div>

                <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/60">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 block">
                    Retorno Oficial (5 Km)
                  </span>
                  <span className="text-xs font-bold text-white block mt-0.5">
                    Monumento às Bandeiras
                  </span>
                  <span className="text-[11px] text-slate-400 block mt-0.5">
                    Tapete de cronometragem parcial
                  </span>
                </div>

                <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/60">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block">
                    Pórtico de Chegada
                  </span>
                  <span className="text-xs font-bold text-white block mt-0.5">
                    Arena de Celebração
                  </span>
                  <span className="text-[11px] text-slate-400 block mt-0.5">
                    Medalha de metal + Kit pós-prova
                  </span>
                </div>
              </div>
            </div>

            {/* Hydration details */}
            <div className="mt-6 pt-4 border-t border-slate-800 flex items-center gap-3 text-xs text-slate-300">
              <Droplets className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>
                <strong>4 Postos de Hidratação:</strong> Copos selados de água mineral a cada 2,5 km e repositor eletrolítico no km 7,5.
              </span>
            </div>
          </div>

          {/* Schedule / Cronograma Card */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <Clock className="w-5 h-5 text-orange-400" />
                <h3 className="text-base font-extrabold uppercase text-white tracking-wide">
                  Cronograma do Dia
                </h3>
              </div>

              <div className="space-y-4 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
                {[
                  { hora: '05h30', titulo: 'Abertura da Arena', desc: 'Guarda-volumes e área de ativações liberados' },
                  { hora: '06h15', titulo: 'Aquecimento Guiado', desc: 'Preparadores físicos no palco principal' },
                  { hora: '06h30', titulo: 'Largada Pelotão A & B', desc: 'Elite e atletas ritmo sub 50min' },
                  { hora: '06h35', titulo: 'Largada Pelotão C, D & E', desc: 'Intermediários, iniciantes e caminhada' },
                  { hora: '08h30', titulo: 'Cerimônia de Premiação', desc: 'Troféus para categorias geral e faixas etárias' },
                  { hora: '10h00', titulo: 'Encerramento oficial', desc: 'Atrações musicais e recovery' },
                ].map((item, idx) => (
                  <div key={idx} className="relative pl-8">
                    <span className="absolute left-1.5 top-1.5 w-3 h-3 rounded-full bg-orange-500 ring-4 ring-slate-900" />
                    <span className="text-xs font-mono font-bold text-orange-400 block">
                      {item.hora}
                    </span>
                    <span className="text-xs font-bold text-white block">
                      {item.titulo}
                    </span>
                    <span className="text-[11px] text-slate-400 block">
                      {item.desc}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 text-xs text-slate-400 flex items-center gap-2">
              <HeartPulse className="w-4 h-4 text-red-400 shrink-0" />
              <span>UTI Móvel e médicos de prontidão em todo o percurso.</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
