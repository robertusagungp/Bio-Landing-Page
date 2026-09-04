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
    <section className="pt-4 sm:pt-10 pb-8 text-center px-4 max-w-[760px] mx-auto">
      {/* Eyebrow */}
      <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-teal-brand/10 text-teal-brand text-[10px] sm:text-[11px] font-bold tracking-wider uppercase mb-4 sm:mb-5">
        <span>Free Personal Wellness Tools</span>
      </div>

      {/* Profile Portrait */}
      <div className="flex flex-col items-center mb-4">
        <div className="relative group">
          <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full border-4 border-white p-0.5 bg-card shadow-card ring-4 ring-teal-brand/15 flex items-center justify-center overflow-hidden transition-transform duration-300 hover:scale-105">
            <img
              src="/foto-robert.png"
              alt="Robertus Agung Pradana"
              className="w-full h-full object-cover object-[center_12%]"
              loading="eager"
            />
          </div>
          <div 
            className="absolute bottom-1 right-1 sm:right-2 bg-sage text-white p-1 rounded-full border-2 border-white shadow-soft" 
            title="Tersedia untuk edukasi & diskusi"
          >
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>

        <h1 className="mt-3.5 text-2xl sm:text-3xl font-bold tracking-tight-heading text-foreground">
          Robertus Agung Pradana
        </h1>
        <p className="text-xs sm:text-sm font-semibold text-teal-brand mt-0.5">
          Data • Health • Financial Readiness
        </p>
      </div>

      {/* Main Headline & Supporting Copy */}
      <div className="max-w-xl mx-auto mb-4 sm:mb-6">
        <h2 className="text-2xl sm:text-[32px] sm:leading-[1.25] font-extrabold text-foreground tracking-tight-heading">
          Kenali Kondisi Hidupmu Lebih Baik.
        </h2>
        <p className="mt-2.5 text-xs sm:text-base text-muted leading-relaxed">
          Kesehatan, keuangan, dan kesiapan menghadapi hal tak terduga sering terasa abstrak. Tools sederhana di sini membantu mengubahnya menjadi insight yang lebih mudah dipahami berbasis data.
        </p>
      </div>

      {/* Short Personal Bio Quote */}
      <div className="my-4 sm:my-5 p-4 sm:p-5 rounded-card bg-card border border-border/80 shadow-soft text-left max-w-lg mx-auto">
        <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed italic font-normal">
          “Saya Robert. Latar belakang saya berada di bidang matematika, data science, analytics, dan risk. Saya membuat tools sederhana di sini untuk membantu kita memahami kondisi kesehatan, keuangan, dan kesiapan menghadapi hal tak terduga dengan lebih jelas.”
        </p>
        <div className="mt-2 text-[11px] font-semibold text-teal-brand text-right">
          — Robertus Agung Pradana
        </div>
      </div>

      {/* Trust Chips */}
      <div className="mb-6 sm:mb-8">
        <TrustChips />
      </div>

      {/* Hero CTAs */}
      <div className="max-w-md mx-auto flex flex-col items-center gap-2.5 w-full">
        <button
          onClick={onStartLifeReadiness}
          className="w-full sm:w-auto min-w-[280px] bg-teal-brand hover:bg-teal-light active:scale-[0.98] text-white font-bold py-3.5 px-6 rounded-btn shadow-card hover:shadow-elevated transition-all flex items-center justify-center gap-2 group text-sm sm:text-base"
        >
          <span>🎯 Cek Life Readiness Score</span>
          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
        <span className="text-[11px] sm:text-xs text-muted font-medium">
          8 pertanyaan • ±2 menit • Tanpa login
        </span>

        <button
          onClick={onExploreTools}
          className="mt-1 text-xs font-semibold text-muted hover:text-foreground flex items-center gap-1.5 py-1.5 px-3.5 rounded-full hover:bg-section transition-colors active:scale-95"
        >
          <Compass className="w-3.5 h-3.5" />
          Lihat semua 8 free tools
        </button>
      </div>

      {/* Mobile-Optimized 3 Trust Indicators */}
      <div className="mt-8 pt-5 border-t border-border/70 grid grid-cols-3 gap-2 max-w-lg mx-auto">
        <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-1 sm:gap-2 p-2 sm:p-2.5 rounded-xl bg-section/70">
          <UserCheck className="w-4 h-4 text-teal-brand shrink-0" />
          <div>
            <div className="text-[11px] font-bold text-foreground">Tanpa Login</div>
            <div className="text-[10px] text-muted hidden sm:block">Langsung coba instan</div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-1 sm:gap-2 p-2 sm:p-2.5 rounded-xl bg-section/70">
          <ShieldCheck className="w-4 h-4 text-sage shrink-0" />
          <div>
            <div className="text-[11px] font-bold text-foreground">Privacy-First</div>
            <div className="text-[10px] text-muted hidden sm:block">Tersimpan di browser</div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-1 sm:gap-2 p-2 sm:p-2.5 rounded-xl bg-section/70">
          <Zap className="w-4 h-4 text-mustard-dark shrink-0" />
          <div>
            <div className="text-[11px] font-bold text-foreground">Insight Cepat</div>
            <div className="text-[10px] text-muted hidden sm:block">Visual 4 pilar hidup</div>
          </div>
        </div>
      </div>
    </section>
  );
};
