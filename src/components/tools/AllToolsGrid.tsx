import React from 'react';
import { Clock, CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';
import { ActiveToolId, StoredResults } from '../../types/profile';

interface AllToolsGridProps {
  onSelectTool: (toolId: ActiveToolId) => void;
  results: StoredResults;
}

export const AllToolsGrid: React.FC<AllToolsGridProps> = ({
  onSelectTool,
  results,
}) => {
  const tools = [
    {
      id: 'life-readiness' as ActiveToolId,
      icon: '🎯',
      title: 'Life Readiness Score',
      category: 'Flagship Assessment',
      time: '±2 menit',
      description: 'Pemetaan komprehensif 4 pilar: kesehatan, stabilitas keuangan, dana darurat, dan kesiapan keluarga.',
      completed: !!results.lifeReadiness,
      scorePreview: results.lifeReadiness ? `${results.lifeReadiness.overallScore}/100` : null,
      highlight: true,
    },
    {
      id: 'lifestyle-age' as ActiveToolId,
      icon: '🧬',
      title: 'Lifestyle Age',
      category: 'Health Habits',
      time: '±1 menit',
      description: 'Estimasi usia biologis gaya hidup berdasarkan pola tidur, olahraga, nutrisi harian, dan stres.',
      completed: !!results.lifestyleAge,
      scorePreview: results.lifestyleAge ? `${results.lifestyleAge.lifestyleAge} thn` : null,
      highlight: false,
    },
    {
      id: 'wellness-score' as ActiveToolId,
      icon: '🌿',
      title: 'Wellness Score',
      category: 'Daily Vitality',
      time: '±1 menit',
      description: 'Analisa 5 dimensi kebugaran: movement, sleep, nutrition, recovery, dan pola ritme harian.',
      completed: !!results.wellness,
      scorePreview: results.wellness ? `${results.wellness.overallScore}/100` : null,
      highlight: false,
    },
    {
      id: 'financial-health' as ActiveToolId,
      icon: '💸',
      title: 'Financial Health Score',
      category: 'Cash Flow & Resilience',
      time: '±90 detik',
      description: 'Stress-test ketahanan keuangan menghadapi jeda pemasukan 1, 3, hingga 6 bulan ke depan.',
      completed: !!results.financialHealth,
      scorePreview: results.financialHealth ? `${results.financialHealth.overallScore}/100` : null,
      highlight: false,
    },
    {
      id: 'emergency-checker' as ActiveToolId,
      icon: '🛡️',
      title: 'Emergency Fund Checker',
      category: 'Liquidity Buffer',
      time: '±60 detik',
      description: 'Hitung runway durasi bertahan kas likuidmu dan simulasi jika terjadi benturan pengeluaran mendadak.',
      completed: !!results.emergencyRunway,
      scorePreview: results.emergencyRunway ? `${results.emergencyRunway.runwayMonths} bln` : null,
      highlight: false,
    },
    {
      id: 'medical-simulator' as ActiveToolId,
      icon: '🏥',
      title: 'Medical Cost Scenario Simulator',
      category: 'Risk Scenario',
      time: '±60 detik',
      description: 'Simulasi rentang biaya rawat inap rumah sakit swasta di berbagai kota dan dampaknya pada dana darurat.',
      completed: !!results.medicalScenario,
      scorePreview: results.medicalScenario ? 'Tersimulasi' : null,
      highlight: false,
    },
    {
      id: 'family-readiness' as ActiveToolId,
      icon: '👨‍👩‍👧',
      title: 'Family Readiness Score',
      category: 'Household Continuity',
      time: '±90 detik',
      description: 'Ukur ketahanan finansial keluarga jika pencari nafkah utama mengalami interupsi produktivitas.',
      completed: !!results.familyReadiness,
      scorePreview: results.familyReadiness ? `${results.familyReadiness.overallScore}/100` : null,
      highlight: false,
    },
    {
      id: 'health-checklist' as ActiveToolId,
      icon: '📋',
      title: 'Personal Health Checklist',
      category: 'Preventive Awareness',
      time: '±90 detik',
      description: 'Checklist kebiasaan preventif dan riwayat keluarga yang layak didiskusikan bersama dokter/nakes.',
      completed: !!results.healthChecklist,
      scorePreview: results.healthChecklist ? 'Selesai' : null,
      highlight: false,
    },
  ];

  return (
    <section id="tools" className="py-10 px-4 max-w-[760px] mx-auto">
      <div className="mb-6 text-center sm:text-left">
        <span className="text-[11px] font-bold text-teal-brand uppercase tracking-wider block mb-1">
          Interactive Toolkit
        </span>
        <h3 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight-heading">
          8 Free Personal Assessment Tools
        </h3>
        <p className="text-xs sm:text-sm text-muted mt-1 leading-relaxed">
          Semua alat dapat digunakan gratis tanpa pendaftaran. Jawabanmu otomatis disimpan di browser untuk memudahkan pengisian berikutnya.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {tools.map((t) => (
          <button
            key={t.id}
            onClick={() => onSelectTool(t.id)}
            className={`text-left p-5 rounded-card border transition-all flex flex-col justify-between group relative overflow-hidden ${
              t.highlight 
                ? 'bg-card border-teal-brand/30 shadow-card hover:shadow-elevated hover:border-teal-brand sm:col-span-2' 
                : 'bg-card hover:bg-white border-border/80 shadow-soft hover:shadow-card hover:border-teal-brand/30'
            }`}
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2.5">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl p-1.5 rounded-xl bg-section">{t.icon}</span>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted block">
                      {t.category}
                    </span>
                    <h4 className="font-bold text-sm sm:text-base text-foreground group-hover:text-teal-brand transition-colors">
                      {t.title}
                    </h4>
                  </div>
                </div>

                {t.completed ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-sage-dark bg-sage/15 px-2 py-0.5 rounded-full shrink-0">
                    <CheckCircle2 className="w-3 h-3" />
                    {t.scorePreview}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-muted bg-section px-2 py-0.5 rounded-full shrink-0">
                    <Clock className="w-2.5 h-2.5 text-teal-brand" />
                    {t.time}
                  </span>
                )}
              </div>

              <p className="text-xs text-muted leading-relaxed mt-2">
                {t.description}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-border/50 flex items-center justify-between text-xs font-semibold text-teal-brand">
              <span>{t.completed ? 'Lihat / Ulangi Hasil' : 'Mulai Assessment'}</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>
        ))}
      </div>
    </section>
  );
};
