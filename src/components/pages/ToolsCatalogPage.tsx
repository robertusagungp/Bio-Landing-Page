import React from 'react';
import { ArrowLeft, Clock, CheckCircle2, ArrowRight } from 'lucide-react';
import { ActiveToolId, StoredResults } from '../../types/profile';

interface ToolsCatalogPageProps {
  onSelectTool: (toolId: ActiveToolId) => void;
  onBackToHome: () => void;
  results: StoredResults;
}

export const ToolsCatalogPage: React.FC<ToolsCatalogPageProps> = ({
  onSelectTool,
  onBackToHome,
  results,
}) => {
  const toolCategories = [
    {
      category: 'HEALTH',
      categoryLabel: 'Kesehatan & Gaya Hidup',
      tools: [
        {
          id: 'lifestyle-age' as ActiveToolId,
          icon: '🧬',
          title: 'Lifestyle Age',
          desc: 'Cek estimasi usia biologis tubuh dari kebiasaan tidur, olahraga, dan nutrisi.',
          time: '±1 menit',
          completed: !!results.lifestyleAge,
          scorePreview: results.lifestyleAge ? `${results.lifestyleAge.lifestyleAge} thn` : null,
        },
        {
          id: 'wellness-score' as ActiveToolId,
          icon: '🌿',
          title: 'Wellness Score',
          desc: 'Analisa 5 dimensi kebugaran harian: gerak, tidur, nutrisi, pemulihan, dan ritme hidup.',
          time: '±1 menit',
          completed: !!results.wellness,
          scorePreview: results.wellness ? `${results.wellness.overallScore}/100` : null,
        },
        {
          id: 'health-checklist' as ActiveToolId,
          icon: '📋',
          title: 'Personal Health Checklist',
          desc: 'Panduan preventif mandiri dan pemetaan riwayat keluarga yang layak didiskusikan dengan dokter.',
          time: '±90 detik',
          completed: !!results.healthChecklist,
          scorePreview: results.healthChecklist ? 'Selesai' : null,
        },
      ],
    },
    {
      category: 'MONEY',
      categoryLabel: 'Keuangan & Ketahanan Arus Kas',
      tools: [
        {
          id: 'financial-health' as ActiveToolId,
          icon: '💸',
          title: 'Financial Health Score',
          desc: 'Stress-test ketahanan keuangan jika terjadi jeda pemasukan 1, 3, hingga 6 bulan.',
          time: '±90 detik',
          completed: !!results.financialHealth,
          scorePreview: results.financialHealth ? `${results.financialHealth.overallScore}/100` : null,
        },
        {
          id: 'emergency-checker' as ActiveToolId,
          icon: '🛡️',
          title: 'Emergency Fund Checker',
          desc: 'Hitung durasi bertahan kas likuid dan simulasi dampak benturan pengeluaran mendadak.',
          time: '±1 menit',
          completed: !!results.emergencyRunway,
          scorePreview: results.emergencyRunway ? `${results.emergencyRunway.runwayMonths} bln` : null,
        },
      ],
    },
    {
      category: 'LIFE',
      categoryLabel: 'Kesiapan Hidup & Keluarga',
      tools: [
        {
          id: 'life-readiness' as ActiveToolId,
          icon: '🎯',
          title: 'Life Score (Flagship)',
          desc: 'Evaluasi integratif 4 pilar hidup: kesehatan fisik, arus kas, kas darurat, dan keluarga.',
          time: '±2 menit',
          completed: !!results.lifeReadiness,
          scorePreview: results.lifeReadiness ? `${results.lifeReadiness.overallScore}/100` : null,
        },
        {
          id: 'medical-simulator' as ActiveToolId,
          icon: '🏥',
          title: 'Medical Cost Scenario Simulator',
          desc: 'Simulasi rentang biaya rawat inap rumah sakit swasta dan dampaknya pada cadangan kas.',
          time: '±1 menit',
          completed: !!results.medicalScenario,
          scorePreview: results.medicalScenario ? 'Tersimulasi' : null,
        },
        {
          id: 'family-readiness' as ActiveToolId,
          icon: '👨‍👩‍👧',
          title: 'Family Readiness Score',
          desc: 'Ukur ketahanan kesinambungan nafkah keluarga jika pencari nafkah utama terhenti.',
          time: '±90 detik',
          completed: !!results.familyReadiness,
          scorePreview: results.familyReadiness ? `${results.familyReadiness.overallScore}/100` : null,
        },
      ],
    },
  ];

  return (
    <div className="max-w-[680px] mx-auto px-4 py-8 space-y-8 animate-in fade-in duration-200">
      {/* Top Header */}
      <div>
        <button
          onClick={onBackToHome}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted hover:text-foreground py-1.5 px-3 rounded-full hover:bg-section transition-colors mb-4"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali ke Beranda</span>
        </button>

        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
          Semua Tools Gratis
        </h2>
        <p className="text-xs sm:text-sm text-muted mt-1 leading-relaxed">
          Kumpulan kalkulator sederhana untuk mengecek kondisi kesehatan, ketahanan keuangan, dan risiko hidupmu secara mandiri.
        </p>
      </div>

      {/* Categorized Lists */}
      <div className="space-y-8">
        {toolCategories.map((group) => (
          <div key={group.category} className="space-y-3">
            <div className="flex items-center justify-between pb-1.5 border-b border-border/80">
              <span className="text-[11px] font-bold uppercase tracking-wider text-teal-brand">
                {group.category} — {group.categoryLabel}
              </span>
            </div>

            <div className="space-y-2.5">
              {group.tools.map((t) => (
                <button
                  key={t.id}
                  onClick={() => onSelectTool(t.id)}
                  className="w-full text-left p-4 sm:p-4.5 rounded-card bg-card hover:bg-white border border-border shadow-soft hover:border-teal-brand/40 active:scale-[0.99] transition-all flex items-center justify-between group"
                >
                  <div className="flex items-start gap-3.5 pr-2">
                    <span className="text-2xl p-1.5 rounded-xl bg-section shrink-0 mt-0.5">
                      {t.icon}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-foreground group-hover:text-teal-brand transition-colors">
                          {t.title}
                        </h4>
                        {t.completed ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-sage-dark bg-sage/15 px-2 py-0.5 rounded-full shrink-0">
                            <CheckCircle2 className="w-2.5 h-2.5" />
                            {t.scorePreview}
                          </span>
                        ) : (
                          <span className="text-[10px] text-muted bg-section px-1.5 py-0.5 rounded shrink-0">
                            {t.time}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted mt-1 leading-relaxed">
                        {t.desc}
                      </p>
                    </div>
                  </div>

                  <ArrowRight className="w-4 h-4 text-muted group-hover:text-teal-brand group-hover:translate-x-0.5 transition-transform shrink-0" />
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
