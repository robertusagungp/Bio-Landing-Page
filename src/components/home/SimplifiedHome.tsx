import React from 'react';
import { ArrowRight, ChevronRight, MessageCircle } from 'lucide-react';
import { ActiveToolId, LifeReadinessResult } from '../../types/profile';
import { getWhatsAppLink } from '../../utils/formatters';

interface SimplifiedHomeProps {
  onStartLifeScore: () => void;
  onSelectTool: (toolId: ActiveToolId) => void;
  onNavigateToTools: () => void;
  onNavigateToAbout: () => void;
  savedLifeScore?: LifeReadinessResult;
  onRetakeLifeScore: () => void;
}

export const SimplifiedHome: React.FC<SimplifiedHomeProps> = ({
  onStartLifeScore,
  onSelectTool,
  onNavigateToTools,
  onNavigateToAbout,
  savedLifeScore,
  onRetakeLifeScore,
}) => {
  const waUrl = getWhatsAppLink('default');

  return (
    <div className="max-w-[680px] mx-auto px-4 pt-4 sm:pt-10 pb-16 space-y-12 sm:space-y-16">
      {/* 1. PROFILE SECTION */}
      <section className="text-center pt-2">
        <div className="flex justify-center mb-4">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-2 border-border p-0.5 bg-card shadow-soft overflow-hidden">
            <img
              src="/foto-robert.png"
              alt="Robertus Agung Pradana"
              className="w-full h-full object-cover object-[center_12%]"
              loading="eager"
            />
          </div>
        </div>

        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
          Robertus Agung Pradana
        </h1>
        <p className="text-xs sm:text-sm font-medium text-teal-brand mt-1 tracking-tight">
          Data • Health • Financial Readiness
        </p>

        <div className="text-xs text-muted mt-2 space-y-0.5">
          <div>Head of Data Science</div>
          <div>Mathematics — Universitas Indonesia</div>
        </div>
      </section>

      {/* 2. VALUE PROPOSITION */}
      <section className="text-center max-w-lg mx-auto">
        <h2 className="text-2xl sm:text-4xl font-extrabold text-foreground tracking-tight-heading leading-[1.2]">
          Kenali Kondisi Hidupmu Lebih Baik.
        </h2>
        <p className="text-sm sm:text-base text-muted mt-3 leading-relaxed">
          Tools sederhana untuk memahami kesehatan dan kesiapan finansialmu.
        </p>
        <div className="text-xs text-muted/80 font-medium mt-3">
          Gratis • Tanpa login • ±2 menit
        </div>
      </section>

      {/* 3. PRIMARY HERO CTA (LIFE SCORE) */}
      <section>
        <div className="bg-card border border-border rounded-card p-6 sm:p-8 shadow-soft hover:border-teal-brand/30 transition-all text-center">
          <div className="text-2xl mb-2">🎯</div>
          
          <h3 className="text-lg sm:text-xl font-bold text-foreground tracking-tight">
            {savedLifeScore ? 'Lihat Life Score Saya' : 'Cek Life Score Saya'}
          </h3>

          <p className="text-xs sm:text-sm text-muted mt-1.5 max-w-md mx-auto leading-relaxed">
            8 pertanyaan sederhana tentang kesehatan, keuangan &amp; kesiapan hidup.
          </p>

          {savedLifeScore && (
            <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-brand/10 text-teal-brand text-xs font-semibold">
              <span>Terakhir: {savedLifeScore.overallScore} / 100</span>
              <span>•</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRetakeLifeScore();
                }}
                className="underline hover:text-teal-dark"
              >
                Hitung ulang
              </button>
            </div>
          )}

          <div className="mt-6">
            <button
              onClick={onStartLifeScore}
              className="w-full sm:w-auto min-w-[240px] bg-teal-brand hover:bg-teal-light active:scale-[0.98] text-white font-bold py-3.5 px-8 rounded-btn shadow-soft text-sm transition-all inline-flex items-center justify-center gap-2 group"
            >
              <span>{savedLifeScore ? 'Buka Hasil Saya' : 'Mulai Sekarang'}</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* 4. OTHER THINGS TO TRY ("Coba yang lain") */}
      <section className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-muted text-center sm:text-left pl-1">
          Coba yang lain
        </h3>

        <div className="space-y-2.5">
          {/* Card 1: Lifestyle Age */}
          <button
            onClick={() => onSelectTool('lifestyle-age')}
            className="w-full text-left p-4 sm:p-5 rounded-card bg-card hover:bg-white border border-border shadow-soft hover:border-teal-brand/40 active:scale-[0.99] transition-all flex items-center justify-between group"
          >
            <div className="flex items-center gap-3.5 pr-2">
              <span className="text-2xl shrink-0">🧬</span>
              <div>
                <h4 className="text-sm sm:text-base font-bold text-foreground group-hover:text-teal-brand transition-colors leading-snug">
                  Berapa Lifestyle Age Kamu?
                </h4>
                <p className="text-xs text-muted mt-0.5">
                  Cek dari kebiasaan sehari-hari.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span className="text-[11px] text-muted font-medium hidden sm:inline">
                ±1 menit
              </span>
              <ArrowRight className="w-4 h-4 text-muted group-hover:text-teal-brand group-hover:translate-x-0.5 transition-transform" />
            </div>
          </button>

          {/* Card 2: Emergency Fund Checker */}
          <button
            onClick={() => onSelectTool('emergency-checker')}
            className="w-full text-left p-4 sm:p-5 rounded-card bg-card hover:bg-white border border-border shadow-soft hover:border-teal-brand/40 active:scale-[0.99] transition-all flex items-center justify-between group"
          >
            <div className="flex items-center gap-3.5 pr-2">
              <span className="text-2xl shrink-0">💸</span>
              <div>
                <h4 className="text-sm sm:text-base font-bold text-foreground group-hover:text-teal-brand transition-colors leading-snug">
                  Dana Daruratmu Cukup?
                </h4>
                <p className="text-xs text-muted mt-0.5">
                  Lihat kira-kira berapa lama kamu bisa bertahan.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span className="text-[11px] text-muted font-medium hidden sm:inline">
                ±1 menit
              </span>
              <ArrowRight className="w-4 h-4 text-muted group-hover:text-teal-brand group-hover:translate-x-0.5 transition-transform" />
            </div>
          </button>

          {/* Card 3: Medical Cost Scenario */}
          <button
            onClick={() => onSelectTool('medical-simulator')}
            className="w-full text-left p-4 sm:p-5 rounded-card bg-card hover:bg-white border border-border shadow-soft hover:border-teal-brand/40 active:scale-[0.99] transition-all flex items-center justify-between group"
          >
            <div className="flex items-center gap-3.5 pr-2">
              <span className="text-2xl shrink-0">🏥</span>
              <div>
                <h4 className="text-sm sm:text-base font-bold text-foreground group-hover:text-teal-brand transition-colors leading-snug">
                  Kalau Harus Dirawat?
                </h4>
                <p className="text-xs text-muted mt-0.5">
                  Simulasikan dampak biaya medis ke kondisi keuanganmu.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span className="text-[11px] text-muted font-medium hidden sm:inline">
                ±1 menit
              </span>
              <ArrowRight className="w-4 h-4 text-muted group-hover:text-teal-brand group-hover:translate-x-0.5 transition-transform" />
            </div>
          </button>
        </div>

        {/* 5. VIEW ALL TOOLS LINK */}
        <div className="pt-2 text-center sm:text-left">
          <button
            onClick={onNavigateToTools}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-brand hover:text-teal-dark transition-colors py-1"
          >
            <span>Lihat semua tools</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </section>

      {/* 6. VERY SHORT ABOUT ROBERT */}
      <section className="pt-2 border-t border-border/70">
        <h3 className="text-xs font-bold uppercase tracking-wider text-muted mb-2">
          👋 Tentang Saya
        </h3>
        <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed">
          Saya Robert. Latar belakang saya di matematika, data science, analytics, dan industri healthcare. Saya membuat tools ini untuk membantu hal-hal yang biasanya terasa rumit menjadi lebih mudah dipahami.
        </p>
        <div className="mt-3">
          <button
            onClick={onNavigateToAbout}
            className="inline-flex items-center gap-1 text-xs font-bold text-teal-brand hover:underline"
          >
            <span>Tentang Robert</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </section>

      {/* 7. ONE WHATSAPP CTA */}
      <section className="p-6 rounded-card bg-card border border-border text-center shadow-soft">
        <h4 className="text-sm sm:text-base font-bold text-foreground mb-1">
          Punya pertanyaan tentang hasilmu?
        </h4>
        <p className="text-xs text-muted max-w-sm mx-auto leading-relaxed mb-4">
          Kalau ada sesuatu dari hasil assessment yang ingin kamu pahami lebih jauh, kita bisa ngobrol.
        </p>
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold py-2.5 px-5 rounded-btn shadow-soft transition-colors"
        >
          <MessageCircle className="w-4 h-4 fill-white/20" />
          <span>💬 Chat dengan Robert</span>
        </a>
      </section>
    </div>
  );
};
