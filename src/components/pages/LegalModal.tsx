import React, { useState } from 'react';
import { X, ShieldCheck, Lock, RotateCcw } from 'lucide-react';
import { resetUserData } from '../../utils/storage';

interface LegalModalProps {
  type: 'privacy' | 'disclaimer';
  onClose: () => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({ type, onClose }) => {
  const [activeTab, setActiveTab] = useState<'privacy' | 'disclaimer'>(type);

  const handleReset = () => {
    if (window.confirm('Reset semua data yang tersimpan di browser ini? Seluruh riwayat skor dan jawaban kalkulator akan dibersihkan.')) {
      resetUserData();
      window.location.reload();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-foreground/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-card border border-border max-w-lg w-full max-h-[85vh] rounded-card p-6 shadow-elevated flex flex-col overflow-hidden">
        {/* Header with Tabs & Close */}
        <div className="flex items-center justify-between pb-3 border-b border-border/80 shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('privacy')}
              className={`text-xs font-bold px-3 py-1 rounded-full transition-colors ${
                activeTab === 'privacy' ? 'bg-teal-brand text-white' : 'text-muted hover:text-foreground'
              }`}
            >
              Privasi
            </button>
            <button
              onClick={() => setActiveTab('disclaimer')}
              className={`text-xs font-bold px-3 py-1 rounded-full transition-colors ${
                activeTab === 'disclaimer' ? 'bg-teal-brand text-white' : 'text-muted hover:text-foreground'
              }`}
            >
              Disclaimer
            </button>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-full text-muted hover:text-foreground"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="py-4 overflow-y-auto space-y-4 text-xs text-foreground/90 leading-relaxed flex-1">
          {activeTab === 'privacy' ? (
            <>
              <div className="flex items-center gap-2 font-bold text-foreground text-sm">
                <Lock className="w-4 h-4 text-teal-brand" />
                <span>Kebijakan Privasi &amp; Penyimpanan Data</span>
              </div>
              <p>
                Situs ini dibangun dengan prinsip <strong>Privacy-First</strong>. Kami menghargai privasi dan kerahasiaan informasi pribadi Anda:
              </p>
              <ul className="list-disc pl-4 space-y-1.5 text-muted">
                <li>
                  <strong>Penyimpanan Lokal:</strong> Seluruh jawaban kuesioner dan skor self-assessment Anda disimpan secara eksklusif di dalam memori browser lokal (LocalStorage) pada perangkat yang Anda gunakan.
                </li>
                <li>
                  <strong>Tanpa Pengiriman Otomatis:</strong> Data Anda tidak dikirim ke server pihak ketiga mana pun tanpa tindakan eksplisit Anda (seperti saat Anda secara sadar menekan tombol kirim salinan ke email/WhatsApp).
                </li>
                <li>
                  <strong>Kontrol Penuh:</strong> Anda dapat menghapus seluruh riwayat jawaban kapan saja melalui tombol reset data di bawah.
                </li>
              </ul>
              <div className="pt-2">
                <button
                  onClick={handleReset}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-terracotta hover:underline"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Semua Data Tersimpan Sekarang</span>
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center gap-2 font-bold text-foreground text-sm">
                <ShieldCheck className="w-4 h-4 text-sage" />
                <span>Pernyataan Penyangkalan (Disclaimer)</span>
              </div>
              <p>
                Seluruh kalkulator dan materi informasi pada situs ini ditujukan semata-mata untuk <strong>tujuan edukasi dan evaluasi kesadaran mandiri (self-assessment)</strong> berbasis pemodelan kuantitatif sederhana.
              </p>
              <ul className="list-disc pl-4 space-y-1.5 text-muted">
                <li>
                  <strong>Bukan Diagnosis Medis:</strong> Hasil kalkulator kesehatan bukan merupakan pemeriksaan laboratorium klinis, diagnosis medis, atau pengganti nasihat dokter berwenang.
                </li>
                <li>
                  <strong>Bukan Nasihat Investasi Terikat:</strong> Estimasi keuangan bukan rekomendasi produk investasi tertentu, bukan jaminan imbal hasil, dan bukan rencana keuangan formal dari perencana keuangan bersertifikasi.
                </li>
                <li>
                  <strong>Inisiatif Pribadi:</strong> Situs ini adalah proyek independen Robertus Agung Pradana dan tidak mencerminkan, mewakili, atau berafiliasi secara komersial dengan institusi tempat bekerja.
                </li>
              </ul>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-border/80 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="bg-section hover:bg-border text-foreground font-semibold text-xs py-1.5 px-4 rounded-btn transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
