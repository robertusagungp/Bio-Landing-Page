import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowRight, 
  MessageCircle, 
  RotateCcw, 
  ShieldCheck, 
  CheckCircle2, 
  Sparkles,
  ChevronRight,
  AlertCircle
} from 'lucide-react';
import { analytics } from '../../utils/analytics';
import { formatRupiahInput, parseRupiahInput, getWhatsAppLink } from '../../utils/formatters';
import { ActiveToolId } from '../../types/profile';

interface AmanBerapaBulanPageProps {
  onNavigateToHome: () => void;
  onNavigateToTool: (toolId: ActiveToolId) => void;
}

type RunwayBucket = 'lt_1' | '1_3' | '3_6' | '6_12' | '12_plus';

interface BucketInfo {
  id: RunwayBucket;
  label: string;
  badgeClass: string;
  textColor: string;
  interpretation: string;
  scaleLabel: string;
}

const BUCKET_DEFINITIONS: Record<RunwayBucket, BucketInfo> = {
  'lt_1': {
    id: 'lt_1',
    label: 'Buffer Sangat Terbatas',
    badgeClass: 'bg-rose-50 text-rose-700 border-rose-200',
    textColor: 'text-rose-600',
    scaleLabel: '< 1 bln',
    interpretation: 'Cadangan kas saat ini belum mencapai 1 bulan pengeluaran rutin. Setiap jeda pemasukan berpotensi langsung menekan kebutuhan pokok harian.',
  },
  '1_3': {
    id: '1_3',
    label: 'Buffer Terbatas',
    badgeClass: 'bg-amber-50 text-amber-800 border-amber-200',
    textColor: 'text-amber-700',
    scaleLabel: '1–3 bln',
    interpretation: 'Kamu memiliki bantalan awal untuk 1 hingga 3 bulan. Ini cukup memberi ruang bernapas sementara, namun rentan jika transisi pekerjaan atau bisnis memakan waktu lebih lama.',
  },
  '3_6': {
    id: '3_6',
    label: 'Buffer Cukup',
    badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    textColor: 'text-emerald-700',
    scaleLabel: '3–6 bln',
    interpretation: 'Bantalan kas berada di rentang standar kesehatan finansial ideal bagi individu aktif. Memberi ketenangan untuk merespons dinamika hidup tanpa terburu-buru.',
  },
  '6_12': {
    id: '6_12',
    label: 'Buffer Lebih Kuat',
    badgeClass: 'bg-teal-50 text-teal-800 border-teal-200',
    textColor: 'text-teal-700',
    scaleLabel: '6–12 bln',
    interpretation: 'Ketahanan likuiditas sangat solid, ideal untuk keluarga dengan tanggungan atau profesional independen yang menghadapi fluktuasi pendapatan.',
  },
  '12_plus': {
    id: '12_plus',
    label: 'Buffer Sangat Kuat',
    badgeClass: 'bg-slate-100 text-slate-800 border-slate-300',
    textColor: 'text-slate-800',
    scaleLabel: '12+ bln',
    interpretation: 'Bantalan kas di atas 12 bulan memberikan independensi dan proteksi likuiditas maksimal. Langkah berikutnya adalah memastikan dana tidak tergerus inflasi secara pasif.',
  },
};

export const AmanBerapaBulanPage: React.FC<AmanBerapaBulanPageProps> = ({
  onNavigateToHome,
  onNavigateToTool,
}) => {
  // Input raw strings (formatted on screen with dots, kept locally in state)
  const [fundsInput, setFundsInput] = useState<string>('');
  const [expenseInput, setExpenseInput] = useState<string>('');
  const [validationError, setValidationError] = useState<string | null>(null);

  // Result state
  const [runwayMonths, setRunwayMonths] = useState<number | null>(null);
  const [bucket, setBucket] = useState<RunwayBucket | null>(null);

  // Event deduplication guards
  const hasTrackedLanding = useRef(false);
  const hasTrackedToolStarted = useRef(false);
  const hasTrackedStep1 = useRef(false);
  const hasTrackedStep2 = useRef(false);
  const hasTrackedCompleted = useRef(false);
  const hasTrackedResultViewed = useRef(false);

  // 1. Fire landing_view once on mount
  useEffect(() => {
    if (!hasTrackedLanding.current) {
      hasTrackedLanding.current = true;
      analytics.track('landing_view', {
        page: 'aman-berapa-bulan',
        landing_route: '/aman-berapa-bulan',
      });
    }
  }, []);

  // Helper to determine bucket from numeric months
  const getBucketForMonths = (months: number): RunwayBucket => {
    if (months < 1) return 'lt_1';
    if (months < 3) return '1_3';
    if (months < 6) return '3_6';
    if (months < 12) return '6_12';
    return '12_plus';
  };

  // Step 1 input handler with Rupiah formatting
  const handleFundsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value;
    const num = parseRupiahInput(rawVal);
    const formatted = num > 0 ? formatRupiahInput(num) : '';
    setFundsInput(formatted);
    setValidationError(null);

    // Track tool_started on meaningful first input interaction
    if (!hasTrackedToolStarted.current && num > 0) {
      hasTrackedToolStarted.current = true;
      analytics.track('tool_started', {
        tool_name: 'runway_calculator',
        source_campaign: 'financial_runway',
      });
    }
  };

  // Step 2 input handler with Rupiah formatting
  const handleExpenseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value;
    const num = parseRupiahInput(rawVal);
    const formatted = num > 0 ? formatRupiahInput(num) : '';
    setExpenseInput(formatted);
    setValidationError(null);

    // Track step_1_completed when user moves on to step 2 with funds filled
    if (!hasTrackedStep1.current && parseRupiahInput(fundsInput) > 0) {
      hasTrackedStep1.current = true;
      analytics.track('step_1_completed', {
        tool_name: 'runway_calculator',
      });
    }
  };

  // Quick preset chips for quick mobile entry
  const handlePresetFunds = (amount: number) => {
    setFundsInput(formatRupiahInput(amount));
    setValidationError(null);
    if (!hasTrackedToolStarted.current) {
      hasTrackedToolStarted.current = true;
      analytics.track('tool_started', {
        tool_name: 'runway_calculator',
        source_campaign: 'financial_runway',
      });
    }
  };

  const handlePresetExpense = (amount: number) => {
    setExpenseInput(formatRupiahInput(amount));
    setValidationError(null);
    if (!hasTrackedStep1.current && parseRupiahInput(fundsInput) > 0) {
      hasTrackedStep1.current = true;
      analytics.track('step_1_completed', {
        tool_name: 'runway_calculator',
      });
    }
  };

  // Form submission / Calculate
  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();

    const funds = parseRupiahInput(fundsInput);
    const expense = parseRupiahInput(expenseInput);

    if (funds <= 0) {
      setValidationError('Mohon masukkan perkiraan total dana likuid yang tersedia.');
      return;
    }

    if (expense <= 0) {
      setValidationError('Pengeluaran wajib bulanan harus lebih dari Rp 0 agar masa aman dapat dihitung.');
      return;
    }

    // Mathematical runway calculation
    const calculatedMonths = Math.round((funds / expense) * 10) / 10;
    const resolvedBucket = getBucketForMonths(calculatedMonths);

    setRunwayMonths(calculatedMonths);
    setBucket(resolvedBucket);
    setValidationError(null);

    // Funnel events: track step 2, tool completed, and result viewed
    if (!hasTrackedStep2.current) {
      hasTrackedStep2.current = true;
      analytics.track('step_2_completed', {
        tool_name: 'runway_calculator',
      });
    }

    if (!hasTrackedCompleted.current) {
      hasTrackedCompleted.current = true;
      // STRICT PRIVACY: Do NOT pass raw monetary numbers! Only anonymized bucket
      analytics.track('tool_completed', {
        tool_name: 'runway_calculator',
        runway_bucket: resolvedBucket,
      });
    }

    if (!hasTrackedResultViewed.current) {
      hasTrackedResultViewed.current = true;
      analytics.track('result_viewed', {
        tool_name: 'runway_calculator',
        runway_bucket: resolvedBucket,
      });
    }

    // Scroll smoothly to result card on mobile
    setTimeout(() => {
      const el = document.getElementById('runway-result-card');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const handleReset = () => {
    setFundsInput('');
    setExpenseInput('');
    setRunwayMonths(null);
    setBucket(null);
    setValidationError(null);
    hasTrackedCompleted.current = false;
    hasTrackedResultViewed.current = false;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleWhatsAppClick = () => {
    const bucketInfo = bucket ? BUCKET_DEFINITIONS[bucket] : null;
    analytics.track('whatsapp_clicked', {
      source_tool: 'runway_calculator',
      button_location: 'runway_result_card',
      runway_bucket: bucket || undefined,
    });

    const waUrl = getWhatsAppLink('runway', {
      bucketLabel: bucketInfo?.label,
    });
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  const handleNextAssessment = () => {
    analytics.track('next_assessment_clicked', {
      source_tool: 'runway_calculator',
      runway_bucket: bucket || undefined,
      target_tool: 'life-readiness',
    });
    onNavigateToTool('life-readiness');
  };

  const currentBucketInfo = bucket ? BUCKET_DEFINITIONS[bucket] : null;

  return (
    <div className="min-h-screen bg-background text-foreground antialiased selection:bg-emerald-100 selection:text-emerald-900 pb-20">
      {/* 1. MINIMAL BRANDING BAR (Mobile-first, unobtrusive) */}
      <header className="sticky top-0 z-30 bg-background/90 backdrop-blur-md border-b border-border/60 px-4 py-3">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <button
            onClick={onNavigateToHome}
            className="flex items-center gap-2 group text-left transition-opacity hover:opacity-80"
            title="Kembali ke Beranda"
          >
            <div className="w-7 h-7 rounded-full bg-emerald-50 border border-emerald-200/80 flex items-center justify-center text-teal-brand font-bold text-xs">
              R
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-foreground tracking-tight group-hover:text-teal-brand transition-colors">
                Robertus Agung Pradana
              </span>
              <span className="text-[10px] text-muted -mt-0.5">
                Personal Readiness
              </span>
            </div>
          </button>

          <button
            onClick={onNavigateToHome}
            className="text-[11px] font-semibold text-muted hover:text-foreground px-2.5 py-1 rounded-full hover:bg-section transition-colors"
          >
            Lihat Semua Tools →
          </button>
        </div>
      </header>

      {/* 2. HERO HEADLINE & VALUE PROMISE */}
      <main className="max-w-lg mx-auto px-4 pt-6 sm:pt-8 space-y-6">
        <section className="text-center space-y-2.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-[11px] font-semibold text-teal-brand">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Kalkulator Masa Aman Finansial</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground leading-[1.25]">
            Kalau pemasukanmu berhenti hari ini, kamu bisa bertahan berapa bulan?
          </h1>

          <p className="text-xs sm:text-sm text-muted leading-relaxed max-w-md mx-auto">
            Cari tahu berdasarkan kondisi kamu sendiri. <br className="hidden sm:inline" />
            <span className="font-semibold text-foreground/80">Gratis • ±30 detik • Tanpa login</span>
          </p>
        </section>

        {/* 3. DIRECT 2-STEP INPUT CARD (NO MULAI TOOL GATE) */}
        <section className="bg-card border border-border/90 rounded-card-lg p-5 sm:p-6 shadow-card space-y-6">
          <form onSubmit={handleCalculate} noValidate className="space-y-6">
            {/* STEP 1: DANA LIKUID */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label 
                  htmlFor="funds-input"
                  className="text-xs sm:text-sm font-bold text-foreground block"
                >
                  1. Berapa total dana yang bisa kamu gunakan jika pemasukan berhenti hari ini?
                </label>
              </div>

              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-muted select-none pointer-events-none">
                  Rp
                </span>
                <input
                  id="funds-input"
                  type="text"
                  inputMode="numeric"
                  value={fundsInput}
                  onChange={handleFundsChange}
                  placeholder="Contoh: 15.000.000"
                  className="w-full pl-11 pr-4 py-3 text-base sm:text-lg font-bold rounded-card border border-border focus:border-teal-brand focus:ring-2 focus:ring-teal-brand/20 bg-background text-foreground transition-all outline-none"
                  autoComplete="off"
                />
              </div>

              <p className="text-[11px] text-muted leading-relaxed">
                💡 <em>Tabungan di rekening bank, dompet digital, atau deposito likuid yang memang bisa dicairkan segera untuk kebutuhan hidup.</em>
              </p>

              {/* Quick Preset Chips */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[10px] text-muted font-medium mr-1">Contoh cepat:</span>
                {[5_000_000, 15_000_000, 30_000_000, 50_000_000].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => handlePresetFunds(val)}
                    className="text-[10px] font-semibold text-muted hover:text-foreground bg-section hover:bg-section/80 px-2.5 py-1 rounded-full border border-border/80 transition-colors"
                  >
                    Rp {val / 1_000_000} Jt
                  </button>
                ))}
              </div>
            </div>

            {/* STEP 2: PENGELUARAN WAJIB */}
            <div className="space-y-2 pt-2 border-t border-border/60">
              <div className="flex items-center justify-between">
                <label 
                  htmlFor="expense-input"
                  className="text-xs sm:text-sm font-bold text-foreground block"
                >
                  2. Berapa pengeluaran wajibmu setiap bulan?
                </label>
              </div>

              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-muted select-none pointer-events-none">
                  Rp
                </span>
                <input
                  id="expense-input"
                  type="text"
                  inputMode="numeric"
                  value={expenseInput}
                  onChange={handleExpenseChange}
                  placeholder="Contoh: 5.000.000"
                  className="w-full pl-11 pr-4 py-3 text-base sm:text-lg font-bold rounded-card border border-border focus:border-teal-brand focus:ring-2 focus:ring-teal-brand/20 bg-background text-foreground transition-all outline-none"
                  autoComplete="off"
                />
              </div>

              <p className="text-[11px] text-muted leading-relaxed">
                💡 <em>Makan harian, tempat tinggal/kost/KPR, listrik, cicilan wajib, transportasi, dan kebutuhan pokok keluarga.</em>
              </p>

              {/* Quick Preset Chips */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[10px] text-muted font-medium mr-1">Contoh cepat:</span>
                {[3_000_000, 5_000_000, 10_000_000, 15_000_000].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => handlePresetExpense(val)}
                    className="text-[10px] font-semibold text-muted hover:text-foreground bg-section hover:bg-section/80 px-2.5 py-1 rounded-full border border-border/80 transition-colors"
                  >
                    Rp {val / 1_000_000} Jt
                  </button>
                ))}
              </div>
            </div>

            {/* Validation Error Banner */}
            {validationError && (
              <div className="p-3 rounded-card bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-start gap-2 animate-in fade-in duration-150">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" />
                <span>{validationError}</span>
              </div>
            )}

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              className="w-full bg-teal-brand hover:bg-teal-light active:scale-[0.99] text-white font-bold py-3.5 px-5 rounded-btn text-sm shadow-soft transition-all flex items-center justify-center gap-2 group"
            >
              <span>Lihat Masa Aman Saya</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </form>
        </section>

        {/* 4. RESULT CARD EXPERIENCE */}
        {runwayMonths !== null && bucket && currentBucketInfo && (
          <section
            id="runway-result-card"
            className="bg-card border border-teal-500/30 rounded-card-lg p-5 sm:p-7 shadow-card space-y-5 animate-in fade-in slide-in-from-bottom-3 duration-300 ring-2 ring-teal-brand/10"
          >
            {/* Header Result */}
            <div className="text-center space-y-1.5 border-b border-border/80 pb-5">
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-muted">
                Masa Aman Finansial Kamu
              </span>
              
              <div className="text-3xl sm:text-4xl font-black text-foreground tracking-tight py-1">
                ± {runwayMonths >= 12 ? '12+ BULAN' : `${runwayMonths.toString().replace('.', ',')} BULAN`}
              </div>

              <div>
                <span className={`inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full border ${currentBucketInfo.badgeClass}`}>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{currentBucketInfo.label}</span>
                </span>
              </div>
            </div>

            {/* Subtle Horizontal Scale */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between text-[11px] font-bold text-muted px-1">
                <span>Skala Ketahanan Dana Likuid:</span>
              </div>

              <div className="grid grid-cols-5 gap-1.5 text-center">
                {(['lt_1', '1_3', '3_6', '6_12', '12_plus'] as RunwayBucket[]).map((bKey) => {
                  const bInfo = BUCKET_DEFINITIONS[bKey];
                  const isActive = bucket === bKey;
                  return (
                    <div
                      key={bKey}
                      className={`py-2 px-1 rounded-card text-[11px] font-bold transition-all border ${
                        isActive
                          ? 'bg-teal-brand text-white border-teal-brand shadow-sm scale-105 z-10'
                          : 'bg-section text-muted border-border/60'
                      }`}
                    >
                      <div>{bInfo.scaleLabel}</div>
                      {isActive && (
                        <div className="text-[9px] font-normal text-teal-100 uppercase tracking-wider mt-0.5">
                          Posisi Kamu
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Interpretation Paragraphs */}
            <div className="bg-section/60 p-4 rounded-card border border-border/80 space-y-2.5 text-xs text-foreground/90 leading-relaxed">
              <p>
                Jika pemasukan berhenti hari ini dan pola pengeluaran tetap sama, dana yang tersedia diperkirakan dapat menopang kebutuhan wajibmu sekitar{' '}
                <strong>{runwayMonths >= 12 ? '12 bulan atau lebih' : `${runwayMonths.toString().replace('.', ',')} bulan`}</strong>.
              </p>
              <p className="text-muted text-[11px]">
                {currentBucketInfo.interpretation}
              </p>
              <p className="text-muted text-[11px] border-t border-border/60 pt-2 italic">
                ℹ️ Angka estimasi ini belum memperhitungkan kejadian mendadak di luar rencana—seperti biaya kesehatan darurat, perubahan tanggungan keluarga, atau biaya tak terduga lainnya.
              </p>
            </div>

            {/* CTAS: 1) Deeper Assessment, 2) Soft WhatsApp Consultation */}
            <div className="space-y-3 pt-2">
              {/* Secondary Value CTA */}
              <div className="p-3.5 rounded-card bg-emerald-50/70 border border-emerald-200/80 space-y-2">
                <div className="flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-teal-brand shrink-0 mt-0.5" />
                  <div className="text-xs text-emerald-950">
                    <span className="font-bold block">Dana darurat hanyalah salah satu pilar kesiapan hidup.</span>
                    Ingin tahu apakah perlindungan kesehatan, asuransi, dan ketahanan keluargamu sudah seimbang?
                  </div>
                </div>
                <button
                  onClick={handleNextAssessment}
                  className="w-full bg-white hover:bg-emerald-100 text-teal-brand border border-teal-600/30 text-xs font-bold py-2.5 px-4 rounded-btn shadow-sm transition-all flex items-center justify-center gap-1.5"
                >
                  <span>Cek Kesiapan Hidup Lebih Lengkap (Life Score)</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Soft WhatsApp Consultation CTA */}
              <div className="p-3.5 rounded-card bg-card border border-border text-center space-y-2">
                <div className="text-xs text-foreground">
                  <div className="font-bold">Mau dibantu membaca hasilnya?</div>
                  <div className="text-muted text-[11px] mt-0.5">
                    Bisa kita diskusikan santai dan objektif tanpa biaya melalui WhatsApp.
                  </div>
                </div>
                <button
                  onClick={handleWhatsAppClick}
                  className="w-full bg-[#25D366] hover:bg-[#20ba59] active:scale-[0.99] text-white text-xs font-bold py-3 px-4 rounded-btn shadow-soft transition-all flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4 fill-white/20" />
                  <span>Bahas Hasil Saya via WhatsApp</span>
                </button>
              </div>

              {/* Recalculate button */}
              <button
                type="button"
                onClick={handleReset}
                className="w-full text-center text-xs text-muted hover:text-foreground font-semibold py-1.5 flex items-center justify-center gap-1 transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Hitung Ulang Angka Lain</span>
              </button>
            </div>
          </section>
        )}

        {/* 5. PRIVACY PROMISE FOOTNOTE */}
        <section className="text-center pt-2 text-[11px] text-muted space-y-1">
          <p className="flex items-center justify-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 inline" />
            <span>Kalkulasi murni diproses di perangkatmu. Angka nominal keuanganmu 100% aman dan tidak pernah disimpan.</span>
          </p>
        </section>
      </main>
    </div>
  );
};
