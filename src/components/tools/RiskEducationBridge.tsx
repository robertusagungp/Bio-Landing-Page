import React, { useState } from 'react';
import { ShieldAlert, ChevronDown, ArrowRight, ShieldCheck, DollarSign, Building2, TrendingUp } from 'lucide-react';
import { analytics } from '../../utils/analytics';

interface RiskEducationBridgeProps {
  toolContext: string;
  onNavigateToEducation?: () => void;
  onNavigateToProtectionGap?: () => void;
}

export const RiskEducationBridge: React.FC<RiskEducationBridgeProps> = ({
  toolContext,
  onNavigateToEducation,
  onNavigateToProtectionGap,
}) => {
  const [activeTab, setActiveTab] = useState<number | null>(null);

  const handleToggleTab = (index: number, name: string) => {
    const next = activeTab === index ? null : index;
    setActiveTab(next);
    if (next !== null) {
      analytics.track('risk_management_option_clicked', {
        tool_context: toolContext,
        option_name: name,
      });
    }
  };

  const options = [
    {
      id: 'emergency',
      icon: '💰',
      title: '1. Tabungan Darurat Likuid',
      tag: 'Risiko Kecil–Sedang (Rp 2–10 Jt)',
      desc: 'Fondasi lapis pertama paling penting. Efisien untuk pengeluaran dadakan seperti perbaikan rumah, pergantian gadget, atau masa jeda cari kerja 1–2 bulan tanpa harus berutang.',
    },
    {
      id: 'income',
      icon: '📈',
      title: '2. Diversifikasi Nafkah',
      tag: 'Ketahanan Jangka Menengah',
      desc: 'Membangun keahlian lepas (freelance) atau aset produktif sampingan agar arus kas keluarga tidak bergantung 100% pada satu pemberi kerja.',
    },
    {
      id: 'bpjs',
      icon: '🏢',
      title: '3. Fasilitas Kantor & BPJS',
      tag: 'Jaring Pengaman Dasar',
      desc: 'Maksimalkan fasilitas medis tempat kerja dan pastikan BPJS Kesehatan aktif untuk menutup risiko sakit umum harian tanpa membebani kas pribadi.',
    },
    {
      id: 'protection',
      icon: '🛡️',
      title: '4. Proteksi Keuangan / Asuransi',
      tag: 'Risiko Katastropik (Rp 100 Jt+)',
      desc: 'Digunakan secara spesifik untuk risiko yang terlalu raksasa jika ditanggung sendiri—misalnya tagihan operasi besar atau pencari nafkah tutup usia mendadak. Tujuannya bukan investasi, melainkan mentransfer beban fatal agar tabungan keluarga tidak terkuras.',
    },
  ];

  return (
    <div className="pt-6 border-t border-border/80 space-y-3.5">
      <div>
        <span className="text-[10px] font-bold tracking-wider uppercase text-teal-brand block mb-1">
          Edukasi Manajemen Risiko
        </span>
        <h4 className="text-xs sm:text-sm font-bold text-foreground flex items-center gap-1.5">
          <ShieldAlert className="w-4 h-4 text-teal-brand" />
          Bagaimana Risiko Seperti Ini Biasanya Dikelola?
        </h4>
        <p className="text-xs text-muted mt-1 leading-relaxed">
          Setiap risiko punya alat penanganan yang tepat. Klik opsi untuk melihat kapan instrumen tersebut digunakan secara sehat:
        </p>
      </div>

      <div className="space-y-2">
        {options.map((opt, idx) => {
          const isOpen = activeTab === idx;
          return (
            <div
              key={opt.id}
              className="border border-border/70 rounded-card bg-background overflow-hidden transition-all"
            >
              <button
                type="button"
                onClick={() => handleToggleTab(idx, opt.id)}
                className="w-full p-3 text-left flex items-center justify-between gap-2 hover:bg-section/50 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-base">{opt.icon}</span>
                  <div>
                    <span className="text-xs font-bold text-foreground block">
                      {opt.title}
                    </span>
                    <span className="text-[10px] font-semibold text-muted">
                      {opt.tag}
                    </span>
                  </div>
                </div>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-muted transition-transform duration-200 shrink-0 ${
                    isOpen ? 'rotate-180 text-teal-brand' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-3 pb-3 pt-1 text-xs text-muted leading-relaxed border-t border-border/40 bg-section/30">
                  <p>{opt.desc}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Action bridges */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-1">
        <button
          type="button"
          onClick={() => {
            analytics.track('financial_protection_viewed', { source: `bridge_${toolContext}` });
            if (onNavigateToEducation) {
              onNavigateToEducation();
            } else {
              window.dispatchEvent(new CustomEvent('agy_navigate_view', { detail: 'education' }));
            }
          }}
          className="flex-1 inline-flex items-center justify-center gap-1.5 p-2.5 rounded-btn bg-section hover:bg-section/80 border border-border text-foreground text-xs font-semibold transition-colors"
        >
          <span>Pelajari Kapan Asuransi Relevan</span>
          <ArrowRight className="w-3.5 h-3.5 text-teal-brand" />
        </button>

        <button
          type="button"
          onClick={() => {
            analytics.track('protection_gap_opened', { source: `bridge_${toolContext}` });
            if (onNavigateToProtectionGap) {
              onNavigateToProtectionGap();
            } else {
              window.dispatchEvent(new CustomEvent('agy_navigate_tool', { detail: 'protection-gap' }));
            }
          }}
          className="flex-1 inline-flex items-center justify-center gap-1.5 p-2.5 rounded-btn bg-teal-brand/10 hover:bg-teal-brand/15 border border-teal-brand/30 text-teal-dark text-xs font-bold transition-colors"
        >
          <span>🛡️ Cek Protection Gap Saya</span>
          <ArrowRight className="w-3.5 h-3.5 text-teal-brand" />
        </button>
      </div>
    </div>
  );
};
