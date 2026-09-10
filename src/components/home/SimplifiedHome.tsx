import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, 
  ChevronRight, 
  MessageCircle, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  GraduationCap, 
  LineChart, 
  HeartHandshake,
  UserCheck
} from 'lucide-react';
import { ActiveToolId, LifeReadinessResult, StoredResults } from '../../types/profile';
import { getWhatsAppLink } from '../../utils/formatters';
import { analytics } from '../../utils/analytics';

interface SimplifiedHomeProps {
  onStartLifeScore: () => void;
  onSelectTool: (toolId: ActiveToolId) => void;
  onNavigateToTools: () => void;
  onNavigateToAbout: () => void;
  savedLifeScore?: LifeReadinessResult;
  onRetakeLifeScore: () => void;
  results?: StoredResults;
}

interface ToolDefinition {
  id: ActiveToolId;
  category: 'health' | 'finance' | 'protection';
  categoryLabel: string;
  icon: string;
  title: string;
  desc: string;
  time: string;
  badge?: string;
}

export const SimplifiedHome: React.FC<SimplifiedHomeProps> = ({
  onStartLifeScore,
  onSelectTool,
  onNavigateToTools,
  onNavigateToAbout,
  savedLifeScore,
  onRetakeLifeScore,
  results,
}) => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'health' | 'finance' | 'protection'>('all');
  const waUrl = getWhatsAppLink('default');

  useEffect(() => {
    analytics.page('home');
  }, []);

  const allTools: ToolDefinition[] = [
    {
      id: 'lifestyle-age',
      category: 'health',
      categoryLabel: 'Kesehatan',
      icon: '🧬',
      title: 'Berapa Usia Biologismu?',
      desc: 'Cek apakah tubuhmu menua lebih cepat atau lebih lambat dari usia KTP berdasarkan pola tidur, olahraga, & nutrisi.',
      time: '±1 menit',
      badge: 'Populer',
    },
    {
      id: 'wellness-score',
      category: 'health',
      categoryLabel: 'Kesehatan',
      icon: '🌿',
      title: 'Wellness & Stamina Score',
      desc: 'Evaluasi 5 dimensi kebugaran: rutinitas gerak, pemulihan fisik, kualitas tidur, dan manajemen stres harian.',
      time: '±1 menit',
    },
    {
      id: 'health-checklist',
      category: 'health',
      categoryLabel: 'Kesehatan',
      icon: '📋',
      title: 'Personal Health Checklist',
      desc: 'Panduan skrining kesehatan preventif mandiri dan pemetaan riwayat keluarga yang perlu diwaspadai.',
      time: '±90 detik',
    },
    {
      id: 'emergency-checker',
      category: 'finance',
      categoryLabel: 'Keuangan',
      icon: '💰',
      title: 'Kalkulator Dana Darurat',
      desc: 'Hitung durasi berapa bulan kamu bisa bertahan jika terjadi jeda pemasukan atau kebutuhan mendadak.',
      time: '±1 menit',
      badge: 'Paling Dicari',
    },
    {
      id: 'financial-health',
      category: 'finance',
      categoryLabel: 'Keuangan',
      icon: '💸',
      title: 'Financial Health Score',
      desc: 'Stress-test rasio tabungan, ketahanan utang, dan arus kas harianmu dari sudut pandang probabilitas risiko.',
      time: '±90 detik',
    },
    {
      id: 'protection-gap',
      category: 'protection',
      categoryLabel: 'Proteksi',
      icon: '🛡️',
      title: 'Protection Gap Checker',
      desc: 'Cek apakah proteksi finansialmu saat ini sudah mencukupi atau masih menyisakan celah risiko besar.',
      time: '±90 detik',
      badge: 'Rekomendasi',
    },
    {
      id: 'medical-simulator',
      category: 'protection',
      categoryLabel: 'Proteksi',
      icon: '🏥',
      title: 'Simulasi Biaya Rawat RS',
      desc: 'Simulasi rentang tagihan rawat inap rumah sakit swasta dan dampaknya terhadap saldo tabungan pribadimu.',
      time: '±1 menit',
    },
    {
      id: 'family-readiness',
      category: 'protection',
      categoryLabel: 'Proteksi',
      icon: '👨‍👩‍👧',
      title: 'Family Readiness Score',
      desc: 'Ukur ketahanan kesinambungan nafkah keluarga jika terjadi hal tak terduga pada pencari nafkah utama.',
      time: '±90 detik',
    },
  ];

  const filteredTools = activeCategory === 'all' 
    ? allTools 
    : allTools.filter(t => t.category === activeCategory);

  const getToolScoreBadge = (toolId: ActiveToolId) => {
    if (!results) return null;
    switch (toolId) {
      case 'lifestyle-age':
        return results.lifestyleAge ? `${results.lifestyleAge.lifestyleAge} thn` : null;
      case 'wellness-score':
        return results.wellness ? `${results.wellness.overallScore}/100` : null;
      case 'health-checklist':
        return results.healthChecklist ? 'Selesai' : null;
      case 'financial-health':
        return results.financialHealth ? `${results.financialHealth.overallScore}/100` : null;
      case 'emergency-checker':
        return results.emergencyRunway ? `${results.emergencyRunway.runwayMonths} bln` : null;
      case 'protection-gap':
        return results.protectionGap ? `${results.protectionGap.overallScore}/100` : null;
      case 'medical-simulator':
        return results.medicalScenario ? 'Tersimulasi' : null;
      case 'family-readiness':
        return results.familyReadiness ? `${results.familyReadiness.overallScore}/100` : null;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-[720px] mx-auto px-4 pt-4 sm:pt-8 pb-20 space-y-10 sm:space-y-14">
      {/* 1. ELEGANT PROFILE HEADER */}
      <section className="text-center pt-2">
        <div className="flex justify-center mb-4">
          <div className="relative">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full ring-4 ring-teal-brand/10 p-1 bg-white shadow-card overflow-hidden">
              <img
                src="/foto-robert.png"
                alt="Robertus Agung Pradana"
                className="w-full h-full object-cover object-[center_16%]"
                loading="eager"
              />
            </div>
            <div className="absolute bottom-1 right-1 bg-emerald-500 text-white p-1 rounded-full border-2 border-white shadow-sm" title="Aktif">
              <UserCheck className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>

        <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground">
          Robertus Agung Pradana
        </h1>

        <div className="inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-[11px] sm:text-xs font-semibold text-teal-brand">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>Head of Data Science • Actuarial Science (PAI)</span>
        </div>

        <p className="text-xs sm:text-sm text-muted mt-3 max-w-md mx-auto leading-relaxed">
          Kumpulan kalkulator mandiri berbasis data untuk memahami kesehatan, ketahanan keuangan, dan proteksi hidupmu tanpa ribet.
        </p>

        {/* Fast Action Pills */}
        <div className="flex items-center justify-center gap-2 mt-4">
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => {
              analytics.track('whatsapp_clicked', { source_tool: 'homepage', button_location: 'profile_header' });
            }}
            className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold py-2 px-4 rounded-full shadow-soft transition-all active:scale-[0.98]"
          >
            <MessageCircle className="w-3.5 h-3.5 fill-white/20" />
            <span>Chat WhatsApp</span>
          </a>

          <button
            onClick={onNavigateToAbout}
            className="inline-flex items-center gap-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-foreground text-xs font-semibold py-2 px-4 rounded-full shadow-soft transition-all"
          >
            <span>Tentang Saya</span>
            <ChevronRight className="w-3.5 h-3.5 text-muted" />
          </button>
        </div>
      </section>

      {/* 2. PRIMARY HERO CARD: LIFE READINESS FLAGSHIP */}
      <section>
        <div className="relative overflow-hidden rounded-card-lg bg-gradient-to-br from-teal-brand via-[#0F655A] to-[#0A433B] text-white p-6 sm:p-8 shadow-card border border-teal-light/30">
          {/* Subtle Ambient Glow */}
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="space-y-2 max-w-md">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 text-[11px] font-bold tracking-wide uppercase text-amber-300">
                <span>⭐ Paling Populer • ±2 Menit</span>
              </div>

              <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white leading-snug">
                Cek Life Readiness Score Kamu
              </h2>

              <p className="text-xs sm:text-sm text-white/85 leading-relaxed">
                8 pertanyaan sederhana untuk mengevaluasi kebugaran fisik, kestabilan arus kas, dana darurat, dan kesiapan keluargamu dalam 1 skor terpadu.
              </p>

              {savedLifeScore && (
                <div className="pt-1 flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-white/20 text-xs font-semibold text-white">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                    Skor Terakhir: {savedLifeScore.overallScore}/100
                  </span>
                </div>
              )}
            </div>

            <div className="shrink-0 w-full sm:w-auto">
              <button
                onClick={() => {
                  analytics.track('life_score_cta_clicked', { has_saved_score: !!savedLifeScore });
                  if (savedLifeScore) {
                    onRetakeLifeScore();
                  } else {
                    onStartLifeScore();
                  }
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-teal-brand active:scale-[0.98] font-bold py-3 px-6 rounded-btn shadow-elevated text-sm transition-all group"
              >
                <span>{savedLifeScore ? 'Hitung Ulang' : 'Mulai Sekarang'}</span>
                <ArrowRight className="w-4 h-4 text-teal-brand group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3. INTERACTIVE TOOLS HUB WITH INSTANT FILTER TABS */}
      <section className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1 border-b border-slate-200/80">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-foreground tracking-tight">
              Eksplorasi Tools Spesifik
            </h3>
            <p className="text-xs text-muted">
              Pilih kalkulator sesuai fokus yang ingin kamu ketahui saat ini.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            <button
              onClick={() => setActiveCategory('all')}
              className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-all shrink-0 ${
                activeCategory === 'all'
                  ? 'bg-teal-brand text-white shadow-soft'
                  : 'bg-white text-muted hover:text-foreground border border-slate-200'
              }`}
            >
              Semua ({allTools.length})
            </button>
            <button
              onClick={() => setActiveCategory('health')}
              className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-all shrink-0 ${
                activeCategory === 'health'
                  ? 'bg-teal-brand text-white shadow-soft'
                  : 'bg-white text-muted hover:text-foreground border border-slate-200'
              }`}
            >
              🌱 Kesehatan
            </button>
            <button
              onClick={() => setActiveCategory('finance')}
              className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-all shrink-0 ${
                activeCategory === 'finance'
                  ? 'bg-teal-brand text-white shadow-soft'
                  : 'bg-white text-muted hover:text-foreground border border-slate-200'
              }`}
            >
              💰 Keuangan
            </button>
            <button
              onClick={() => setActiveCategory('protection')}
              className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-all shrink-0 ${
                activeCategory === 'protection'
                  ? 'bg-teal-brand text-white shadow-soft'
                  : 'bg-white text-muted hover:text-foreground border border-slate-200'
              }`}
            >
              🛡️ Proteksi
            </button>
          </div>
        </div>

        {/* Tools Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {filteredTools.map((tool) => {
            const savedScore = getToolScoreBadge(tool.id);

            return (
              <button
                key={tool.id}
                onClick={() => {
                  analytics.track('tool_started', { tool_name: tool.id, entry_point: 'home_grid' });
                  onSelectTool(tool.id);
                }}
                className="w-full text-left p-4 sm:p-5 rounded-card bg-white hover:bg-slate-50/70 border border-slate-200/90 shadow-soft hover:shadow-card hover:border-teal-brand/40 active:scale-[0.99] transition-all flex flex-col justify-between group relative"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl p-2 rounded-xl bg-slate-50 border border-slate-100 shrink-0">
                        {tool.icon}
                      </span>
                      {tool.badge && (
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800">
                          {tool.badge}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5">
                      {savedScore ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-[11px] font-bold text-teal-brand">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>{savedScore}</span>
                        </span>
                      ) : (
                        <span className="text-[11px] font-medium text-muted flex items-center gap-1">
                          <Clock className="w-3 h-3 text-muted/60" />
                          <span>{tool.time}</span>
                        </span>
                      )}
                    </div>
                  </div>

                  <h4 className="text-sm sm:text-base font-bold text-foreground group-hover:text-teal-brand transition-colors leading-snug">
                    {tool.title}
                  </h4>
                  <p className="text-xs text-muted mt-1 leading-relaxed line-clamp-2">
                    {tool.desc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-teal-brand group-hover:text-teal-dark">
                  <span>{savedScore ? 'Lihat Hasil / Ulangi' : 'Coba Sekarang'}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* 4. CREDIBILITY & ABOUT BENTO */}
      <section className="space-y-4">
        <div className="text-center sm:text-left">
          <h3 className="text-base sm:text-lg font-bold text-foreground tracking-tight">
            Di Balik Pembuatan Hub Ini
          </h3>
          <p className="text-xs text-muted">
            Transparansi data, kredensial, dan prinsip independensi.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-4 rounded-card bg-white border border-slate-200/80 shadow-soft space-y-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-teal-brand flex items-center justify-center">
              <GraduationCap className="w-4 h-4" />
            </div>
            <h4 className="text-xs sm:text-sm font-bold text-foreground">
              Matematika UI
            </h4>
            <p className="text-xs text-muted leading-relaxed">
              Latar belakang sarjana Matematika Universitas Indonesia dengan minat pada statistika terapan dan analisis probabilitas.
            </p>
          </div>

          <div className="p-4 rounded-card bg-white border border-slate-200/80 shadow-soft space-y-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-teal-brand flex items-center justify-center">
              <LineChart className="w-4 h-4" />
            </div>
            <h4 className="text-xs sm:text-sm font-bold text-foreground">
              Aktuaria (PAI)
            </h4>
            <p className="text-xs text-muted leading-relaxed">
              Lulus modul Persatuan Aktuaris Indonesia (PAI): Matematika Keuangan (A10), Probabilitas (A20), &amp; Metode Statistik (A50).
            </p>
          </div>

          <div className="p-4 rounded-card bg-white border border-slate-200/80 shadow-soft space-y-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-teal-brand flex items-center justify-center">
              <HeartHandshake className="w-4 h-4" />
            </div>
            <h4 className="text-xs sm:text-sm font-bold text-foreground">
              Data Tanpa Tekanan
            </h4>
            <p className="text-xs text-muted leading-relaxed">
              Dibuat untuk memberikan cermin data yang objektif dan jernih, bukan sebagai sarana penjualan produk yang memaksa.
            </p>
          </div>
        </div>

        <div className="text-center pt-1">
          <button
            onClick={onNavigateToAbout}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-brand hover:underline py-1"
          >
            <span>Baca Profil &amp; Pernyataan Etika Lengkap</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </section>

      {/* 5. WHATSAPP DISCUSSION CARD */}
      <section className="p-6 sm:p-7 rounded-card-lg bg-white border border-slate-200/90 shadow-card text-center space-y-3">
        <div className="w-11 h-11 mx-auto rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
          <MessageCircle className="w-5 h-5 fill-emerald-500/20" />
        </div>
        <h4 className="text-sm sm:text-base font-bold text-foreground">
          Punya pertanyaan seputar hasilmu?
        </h4>
        <p className="text-xs text-muted max-w-sm mx-auto leading-relaxed">
          Jangan ragu untuk mengobrol santai jika ada hal dari hasil perhitungan yang ingin kamu diskusikan lebih jauh.
        </p>
        <div className="pt-2">
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => {
              analytics.track('whatsapp_clicked', { source_tool: 'homepage', button_location: 'home_bottom' });
            }}
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white text-xs font-bold py-2.5 px-6 rounded-btn shadow-soft transition-all"
          >
            <MessageCircle className="w-4 h-4 fill-white/20" />
            <span>Chat Langsung dengan Robert</span>
          </a>
        </div>
      </section>
    </div>
  );
};
