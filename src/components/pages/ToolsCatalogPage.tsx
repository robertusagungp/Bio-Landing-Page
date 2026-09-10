import React from 'react';
import { ArrowLeft, Clock, CheckCircle2, ArrowRight, BookOpen } from 'lucide-react';
import { ActiveToolId, StoredResults } from '../../types/profile';
import { analytics } from '../../utils/analytics';

interface ToolsCatalogPageProps {
  onSelectTool: (toolId: ActiveToolId) => void;
  onBackToHome: () => void;
  onNavigateToEducation?: () => void;
  results: StoredResults;
}

export const ToolsCatalogPage: React.FC<ToolsCatalogPageProps> = ({
  onSelectTool,
  onBackToHome,
  onNavigateToEducation,
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
          icon: '💰',
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
          title: 'Life Readiness Score (Flagship)',
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
        {
          id: 'protection-gap' as ActiveToolId,
          icon: '🛡️',
          title: 'Protection Gap Checker',
          desc: 'Evaluasi objektif apakah kamu sudah cukup terlindungi atau memiliki celah risiko finansial raksasa.',
          time: '±90 detik',
          completed: !!results.protectionGap,
          scorePreview: results.protectionGap ? `${results.protectionGap.overallScore}/100` : null,
        },
      ],
    },
  ];

  return (
    <div className="max-w-[720px] mx-auto px-4 py-6 sm:py-8 space-y-8 animate-in fade-in duration-200">
      {/* Top Header */}
      <div>
        <button
          onClick={onBackToHome}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted hover:text-foreground py-1.5 px-3.5 rounded-full bg-white border border-slate-200 shadow-soft hover:bg-slate-50 transition-colors mb-4"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali ke Beranda</span>
        </button>

        <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground">
          Katalog Lengkap Tools Gratis
        </h2>
        <p className="text-xs sm:text-sm text-muted mt-1 leading-relaxed">
          Pilih salah satu kalkulator mandiri di bawah ini untuk mengecek kondisi kesehatan, ketahanan keuangan, dan proteksi hidupmu.
        </p>
      </div>

      {/* Categorized Lists */}
      <div className="space-y-8">
        {toolCategories.map((group) => (
          <div key={group.category} className="space-y-3">
            <div className="flex items-center justify-between pb-1.5 border-b border-slate-200/80">
              <span className="text-[11px] font-bold uppercase tracking-wider text-teal-brand">
                {group.categoryLabel}
              </span>
            </div>

            <div className="space-y-2.5">
              {group.tools.map((t) => (
                <button
                  key={t.id}
                  onClick={() => {
                    analytics.track('catalog_tool_clicked', { tool_id: t.id, tool_title: t.title });
                    onSelectTool(t.id);
                  }}
                  className="w-full text-left p-4 sm:p-4.5 rounded-card bg-white hover:bg-slate-50 border border-slate-200/90 shadow-soft hover:shadow-card hover:border-teal-brand/40 active:scale-[0.99] transition-all flex items-center justify-between group"
                >
                  <div className="flex items-start gap-3.5 pr-2">
                    <span className="text-2xl p-2 rounded-xl bg-slate-50 border border-slate-100 shrink-0 mt-0.5">
                      {t.icon}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-foreground group-hover:text-teal-brand transition-colors">
                          {t.title}
                        </h4>
                        {t.completed ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-teal-brand bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full shrink-0">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            {t.scorePreview}
                          </span>
                        ) : (
                          <span className="text-[10px] text-muted bg-slate-100 px-2 py-0.5 rounded-full shrink-0">
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

      {/* EDUCATIONAL BRIDGE AT CATALOG FOOTER */}
      {onNavigateToEducation && (
        <div className="pt-4 border-t border-slate-200/80">
          <button
            onClick={() => {
              analytics.track('financial_protection_viewed', { source: 'tools_catalog_footer' });
              onNavigateToEducation();
            }}
            className="w-full text-left p-5 rounded-card-lg bg-emerald-50/70 hover:bg-emerald-50 border border-emerald-200/80 transition-all flex items-center justify-between group"
          >
            <div className="flex items-start gap-3.5 pr-2">
              <div className="w-10 h-10 rounded-full bg-teal-brand/10 text-teal-brand flex items-center justify-center shrink-0 mt-0.5">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-foreground group-hover:text-teal-brand transition-colors">
                  Kapan Seseorang Sebenarnya Membutuhkan Asuransi?
                </h4>
                <p className="text-xs text-muted mt-0.5 leading-relaxed">
                  Pelajari panduan objektif tentang skala risiko kecil, menengah, dan katastropik tanpa jargon rumit.
                </p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-teal-brand group-hover:translate-x-1 transition-transform shrink-0" />
          </button>
        </div>
      )}
    </div>
  );
};
