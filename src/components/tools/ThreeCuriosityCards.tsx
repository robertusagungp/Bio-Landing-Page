import React from 'react';
import { Clock, ArrowRight, Dna, Wallet, Compass } from 'lucide-react';
import { ActiveToolId } from '../../types/profile';

interface ThreeCuriosityCardsProps {
  onSelectTool: (toolId: ActiveToolId) => void;
  onExploreAll: () => void;
}

export const ThreeCuriosityCards: React.FC<ThreeCuriosityCardsProps> = ({
  onSelectTool,
  onExploreAll,
}) => {
  return (
    <section className="py-6 px-4 max-w-[760px] mx-auto">
      <div className="mb-4 text-center sm:text-left">
        <h3 className="text-lg font-bold text-foreground tracking-tight">
          Mulai dari yang paling bikin kamu penasaran.
        </h3>
        <p className="text-xs text-muted">
          Pilih salah satu self-assessment cepat di bawah ini:
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        {/* Card 1: Lifestyle Age */}
        <button
          onClick={() => onSelectTool('lifestyle-age')}
          className="bg-card hover:bg-white text-left p-5 rounded-card border border-border/90 shadow-card hover:shadow-elevated hover:border-teal-brand/40 transition-all group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl p-2 rounded-xl bg-section">🧬</span>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-muted bg-section px-2 py-0.5 rounded-full">
                <Clock className="w-3 h-3 text-teal-brand" />
                ±1 menit
              </span>
            </div>
            <h4 className="font-bold text-sm sm:text-base text-foreground group-hover:text-teal-brand transition-colors leading-snug">
              Berapa Lifestyle Age Kamu?
            </h4>
            <p className="text-xs text-muted mt-1.5 leading-relaxed">
              Umur di KTP belum tentu menggambarkan kebiasaan hidupmu sehari-hari.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-border/50 flex items-center justify-between text-xs font-semibold text-teal-brand">
            <span>Cek Umur Kebiasaan</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </button>

        {/* Card 2: Financial Health */}
        <button
          onClick={() => onSelectTool('financial-health')}
          className="bg-card hover:bg-white text-left p-5 rounded-card border border-border/90 shadow-card hover:shadow-elevated hover:border-teal-brand/40 transition-all group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl p-2 rounded-xl bg-section">💸</span>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-muted bg-section px-2 py-0.5 rounded-full">
                <Clock className="w-3 h-3 text-teal-brand" />
                ±90 detik
              </span>
            </div>
            <h4 className="font-bold text-sm sm:text-base text-foreground group-hover:text-teal-brand transition-colors leading-snug">
              Seberapa Sehat Keuanganmu?
            </h4>
            <p className="text-xs text-muted mt-1.5 leading-relaxed">
              Cek cash flow, emergency fund, dan tingkat financial resilience pribadimu.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-border/50 flex items-center justify-between text-xs font-semibold text-teal-brand">
            <span>Ukur Financial Health</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </button>

        {/* Card 3: Life Readiness */}
        <button
          onClick={() => onSelectTool('life-readiness')}
          className="bg-card hover:bg-white text-left p-5 rounded-card border-2 border-teal-brand/30 hover:border-teal-brand shadow-card hover:shadow-elevated transition-all group flex flex-col justify-between relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 bg-teal-brand text-[10px] font-bold text-white px-2.5 py-0.5 rounded-bl-xl">
            Flagship
          </div>
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl p-2 rounded-xl bg-teal-brand/10">🎯</span>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-teal-brand bg-teal-brand/10 px-2 py-0.5 rounded-full">
                <Clock className="w-3 h-3 text-teal-brand" />
                ±2 menit
              </span>
            </div>
            <h4 className="font-bold text-sm sm:text-base text-foreground group-hover:text-teal-brand transition-colors leading-snug">
              Seberapa Siap Menghadapi Hal Tak Terduga?
            </h4>
            <p className="text-xs text-muted mt-1.5 leading-relaxed">
              Gabungkan analisa health, finance, emergency, dan family readiness.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-border/50 flex items-center justify-between text-xs font-bold text-teal-brand">
            <span>Hitung 4 Pilar Hidup</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </button>
      </div>

      <div className="mt-4 text-center">
        <button
          onClick={onExploreAll}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-brand hover:text-teal-dark transition-colors py-1 px-3 rounded-full hover:bg-section"
        >
          <span>Lihat semua free tools</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </section>
  );
};
