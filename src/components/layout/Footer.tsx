import React from 'react';
import { ShieldCheck, RotateCcw, Lock } from 'lucide-react';
import { resetUserData } from '../../utils/storage';

export const Footer: React.FC = () => {
  const handleReset = () => {
    if (window.confirm('Reset semua data yang tersimpan di browser ini? Semua skor dan jawaban akan dihapus.')) {
      resetUserData();
      window.location.reload();
    }
  };

  return (
    <footer className="mt-20 border-t border-border bg-section/60 text-muted pb-24 sm:pb-12 pt-12">
      <div className="max-w-[760px] mx-auto px-4 space-y-8 text-xs leading-relaxed">
        {/* Privacy Promise */}
        <div className="p-4 rounded-card bg-card border border-border flex items-start gap-3 shadow-soft">
          <div className="p-2 rounded-xl bg-teal-brand/10 text-teal-brand mt-0.5 shrink-0">
            <Lock className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-semibold text-foreground text-sm mb-1">Privasi & Keamanan Data</h4>
            <p className="text-muted">
              Jawaban assessment disimpan secara lokal di browser Anda untuk membantu mengisi kalkulator berikutnya tanpa perlu input ulang. Data tidak dikirim ke server pihak ketiga mana pun tanpa persetujuan eksplisit Anda.
            </p>
            <div className="mt-2.5">
              <button
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-terracotta hover:underline"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset Semua Data Saya (Clear LocalStorage)
              </button>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="space-y-2 text-[11px] text-muted/90">
          <p className="font-semibold text-foreground flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-sage" />
            Pernyataan & Edukasi (Disclaimer)
          </p>
          <p>
            Tools pada situs ini ditujukan semata-mata untuk edukasi dan self-assessment sederhana berbasis pemodelan data. Hasil bukan merupakan diagnosis medis klinis, rekomendasi investasi, atau nasihat keuangan individual terikat. Seluruh estimasi menggunakan asumsi umum dan informasi yang Anda masukkan secara mandiri. Untuk keputusan kesehatan kuratif atau alokasi portofolio finansial bernilai besar, selalu pertimbangkan berkonsultasi dengan dokter atau profesional yang berwenang.
          </p>
          <p>
            Website ini adalah inisiatif pribadi Robertus Agung Pradana dan tidak mencerminkan, mewakili, ataupun didukung secara resmi oleh institusi tempat bekerja.
          </p>
        </div>

        {/* Bottom Credits */}
        <div className="pt-4 border-t border-border/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left text-[11px]">
          <div>
            © {new Date().getFullYear()} Robertus Agung Pradana. Personal Wellness & Life Readiness Hub.
          </div>
          <div className="flex items-center gap-4">
            <span>Jakarta, Indonesia</span>
            <span>•</span>
            <span>Evidence-Minded Approach</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
