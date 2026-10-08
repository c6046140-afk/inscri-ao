import React from 'react';
import { TipoKit, KitOption } from '../types/marathon';
import { Check, Star, Shield, Sparkles } from 'lucide-react';

interface KitSelectorProps {
  selectedKit: TipoKit;
  onSelectKit: (kit: TipoKit) => void;
}

export const KITS: KitOption[] = [
  {
    id: 'essencial',
    nome: 'Kit Essencial',
    preco: 89.9,
    descricao: 'Tudo o que você precisa para correr com conforto e segurança.',
    itens: [
      'Camiseta Tecnológica Dry-Fit 100% Poliamida',
      'Número de Peito oficial com alfinetes',
      'Chip Eletrônico descartável de cronometragem',
      'Medalha Finisher de metal (entregue após a prova)',
      'Hidratação na pista e pós-prova com frutas',
      'Seguro atleta individual oficial da prova',
    ],
  },
  {
    id: 'premium',
    nome: 'Kit Premium',
    preco: 139.9,
    popular: true,
    descricao: 'A experiência favorita dos corredores com acessórios de alta performance.',
    itens: [
      'Todos os itens do Kit Essencial',
      'Viseira Esportiva com proteção UV50+',
      'Mochila Sacochila Impermeável oficial 10K',
      'Squeeze Térmico 750ml com bico ergonômico',
      'Pulseira de identificação e brindes de patrocinadores',
      'Álbum de fotos digital com 2 fotos gratuitas',
    ],
  },
  {
    id: 'vip',
    nome: 'Kit VIP Experience',
    preco: 199.9,
    descricao: 'Conforto máximo, corta-vento oficial e acesso à Área VIP no Ibirapuera.',
    itens: [
      'Todos os itens do Kit Premium',
      'Casaco Corta-Vento oficial da Maratona 10K',
      'Acesso à Tenda VIP com café da manhã pré-prova',
      'Massoterapia e recuperação muscular pós-prova',
      'Guarda-Volumes VIP exclusivo e sem filas',
      'Largada no Pelotão Especial (Onda A)',
    ],
  },
];

export const KitSelector: React.FC<KitSelectorProps> = ({ selectedKit, onSelectKit }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <label className="block text-sm font-bold text-white uppercase tracking-wider">
            Escolha o seu Kit da Prova <span className="text-orange-500">*</span>
          </label>
          <p className="text-xs text-slate-400 mt-0.5">
            Todos os kits dão direito ao número de peito, chip de cronometragem e medalha finisher.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {KITS.map((kit) => {
          const isSelected = selectedKit === kit.id;
          return (
            <div
              key={kit.id}
              onClick={() => onSelectKit(kit.id)}
              className={`relative cursor-pointer rounded-2xl p-5 border transition-all text-left flex flex-col justify-between ${
                isSelected
                  ? 'bg-slate-900/90 border-orange-500 ring-2 ring-orange-500/30 shadow-xl shadow-orange-500/10'
                  : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/40'
              }`}
            >
              {kit.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-white text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-md">
                  <Star className="w-3 h-3 fill-white" /> Mais Escolhido
                </div>
              )}

              {kit.id === 'vip' && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-purple-600 text-white text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-md">
                  <Sparkles className="w-3 h-3" /> Exclusivo
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mt-1">
                  <h4 className="font-extrabold text-base text-white">{kit.nome}</h4>
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                      isSelected
                        ? 'bg-orange-500 border-orange-500 text-white'
                        : 'border-slate-700'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                </div>

                <div className="mt-3">
                  <span className="text-2xl font-black text-white">
                    R$ {kit.preco.toFixed(2).replace('.', ',')}
                  </span>
                  <span className="text-xs text-slate-400 ml-1">à vista ou pix</span>
                </div>

                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  {kit.descricao}
                </p>

                <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-2">
                  {kit.itens.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                      <Check className="w-3.5 h-3.5 text-orange-400 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-5 pt-3">
                <button
                  type="button"
                  className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all ${
                    isSelected
                      ? 'bg-orange-500 text-white'
                      : 'bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700'
                  }`}
                >
                  {isSelected ? '✓ Kit Selecionado' : 'Selecionar este Kit'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
