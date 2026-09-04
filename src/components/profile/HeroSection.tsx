import React from 'react';
import { Compass, CheckCircle2, ChevronRight, ShieldCheck, Zap, UserCheck } from 'lucide-react';
import { TrustChips } from './TrustChips';

interface HeroSectionProps {
  onStartLifeReadiness: () => void;
  onExploreTools: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onStartLifeReadiness,
  onExploreTools,
}) => {
  return (
    <section className="pt-6 sm:pt-10 pb-8 text-center px-4 max-w-[760px] mx-auto">
      {/* Eyebrow */}
      <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-teal-brand/10 text-teal-brand text-[11px] font-bold tracking-wider uppercase mb-5">
        <span>Free Personal Wellness Tools</span>
      </div>

      {/* Profile Avatar / Portrait */}
      <div className="flex flex-col items-center mb-5">
        <div className="relative group">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-2 border-teal-brand/20 p-1 bg-card shadow-card flex items-center justify-center overflow-hidden">
            {/* Elegant avatar representation with initials and subtle gradient */}
            <div className="w-full h-full rounded-full bg-gradient-to-tr from-teal-brand to-teal-light text-white flex flex-col items-center justify-center font-display font-bold text-2xl tracking-tight">
              <span>RP</span>
              <span className="text-[10px] font-sans font-medium text-white/80 -mt-0.5">Data & Risk</span>
            </div>
          </div>
          <div className="absolute -bottom-1 right-2 bg-sage text-white p-1 rounded-full border-2 border-background" title="Tersedia untuk edukasi & diskusi">
            <CheckCircle2 className="w-3.5 h-3.5" />
          </div>
        </div>

        <h1 className="mt-4 text-2xl sm:text-3xl font-bold tracking-tight-heading text-foreground">
          Robertus Agung Pradana
        </h1>
        <p className="text-sm font-semibold text-teal-brand mt-1">
          Data • Health • Financial Readiness
        </p>
      </div>

      {/* Main Headline & Supporting Copy */}
      <div className="max-w-xl mx-auto mb-6">
        <h2 className="text-2xl sm:text-[32px] sm:leading-[1.25] font-extrabold text-foreground tracking-tight-heading">
          Kenali Kondisi Hidupmu Lebih Baik.
        </h2>
        <p className="mt-3 text-sm sm:text-base text-muted leading-relaxed">
          Kesehatan, keuangan, dan kesiapan menghadapi hal tak terduga sering terasa abstrak. Tools sederhana di sini membantu mengubahnya menjadi insight yang lebih mudah dipahami berbasis data.
        </p>
      </div>

      {/* Trust Chips */}
      <div className="mb-8">
        <TrustChips />
      </div>

      {/* Hero CTAs */}
      <div className="max-w-md mx-auto flex flex-col items-center gap-3">
        <button
          onClick={onStartLifeReadiness}
          className="w-full sm:w-auto min-w-[280px] bg-teal-brand hover:bg-teal-light active:scale-[0.98] text-white font-bold py-3.5 px-6 rounded-btn shadow-card hover:shadow-elevated transition-all flex items-center justify-center gap-2 group text-base"
        >
          <span>🎯 Cek Life Readiness Score</span>
          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
        <span className="text-xs text-muted font-medium">
          8 pertanyaan • ±2 menit • Tanpa login
        </span>

        <button
          onClick={onExploreTools}
          className="mt-1 text-xs font-semibold text-muted hover:text-foreground flex items-center gap-1.5 py-1 px-3 rounded-full hover:bg-section transition-colors"
        >
          <Compass className="w-3.5 h-3.5" />
          Lihat semua 8 free tools
        </button>
      </div>

      {/* Small 3 Trust Indicators */}
      <div className="mt-10 pt-6 border-t border-border/70 grid grid-cols-3 gap-2 max-w-lg mx-auto text-left">
        <div className="flex items-center gap-2 p-2 rounded-xl bg-section/70">
          <UserCheck className="w-4 h-4 text-teal-brand shrink-0" />
          <div>
            <div className="text-[11px] font-bold text-foreground">Tanpa Login</div>
            <div className="text-[10px] text-muted hidden sm:block">Langsung coba instan</div>
          </div>
        </div>

        <div className="flex items-center gap-2 p-2 rounded-xl bg-section/70">
          <ShieldCheck className="w-4 h-4 text-sage shrink-0" />
          <div>
            <div className="text-[11px] font-bold text-foreground">Privacy-Friendly</div>
            <div className="text-[10px] text-muted hidden sm:block">Tersimpan di browser</div>
          </div>
        </div>

        <div className="flex items-center gap-2 p-2 rounded-xl bg-section/70">
          <Zap className="w-4 h-4 text-mustard-dark shrink-0" />
          <div>
            <div className="text-[11px] font-bold text-foreground">Insight Langsung</div>
            <div className="text-[10px] text-muted hidden sm:block">Visual 4 pilar hidup</div>
          </div>
        </div>
      </div>
    </section>
  );
};
