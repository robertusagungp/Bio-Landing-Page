import React, { useEffect } from 'react';
import { ArrowLeft, ShieldCheck, AlertTriangle, Layers, HeartHandshake, CheckCircle2, ArrowRight, MessageCircle } from 'lucide-react';
import { getWhatsAppLink } from '../../utils/formatters';
import { analytics } from '../../utils/analytics';

interface FinancialProtectionPageProps {
  onBack: () => void;
  onStartProtectionGap: () => void;
}

export const FinancialProtectionPage: React.FC<FinancialProtectionPageProps> = ({
  onBack,
  onStartProtectionGap,
}) => {
  const waUrl = getWhatsAppLink('protection');

  useEffect(() => {
    analytics.page('financial_protection_education');
    analytics.track('financial_protection_viewed', {
      source: 'navigation_or_bridge',
    });
  }, []);

  const handleStartGap = () => {
    analytics.track('protection_gap_opened', { source: 'education_page' });
    onStartProtectionGap();
  };

  const handleWaClick = () => {
    analytics.track('whatsapp_clicked', {
      source_tool: 'financial_protection_education',
      button_location: 'education_footer',
    });
  };

  return (
    <div className="max-w-[680px] mx-auto px-4 py-8 space-y-8 animate-in fade-in duration-200">
      {/* Top Navigation */}
      <div>
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted hover:text-foreground py-1.5 px-3 rounded-full hover:bg-section transition-colors mb-4"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali</span>
        </button>

        <span className="text-[11px] font-bold uppercase tracking-wider text-teal-brand block mb-1">
          Edukasi Objektif
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight-heading">
          Kapan Seseorang Sebenarnya Membutuhkan Asuransi?
        </h1>
        <p className="text-xs sm:text-sm text-muted mt-2 leading-relaxed">
          Bukan untuk semua risiko, bukan untuk investasi spekulatif. Mari kita lihat secara rasional dan matematis kapan instrumen proteksi keuangan benar-benar masuk akal.
        </p>
      </div>

      {/* CORE PRINCIPLE: RISK SIZING */}
      <div className="bg-card border border-border rounded-card-lg p-6 sm:p-7 shadow-soft space-y-6">
        <h2 className="text-base sm:text-lg font-bold text-foreground flex items-center gap-2">
          <Layers className="w-5 h-5 text-teal-brand" />
          3 Skala Risiko Finansial dalam Hidup
        </h2>

        {/* Level 1 */}
        <div className="p-4 rounded-card bg-section/70 border border-border/80 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-teal-brand uppercase tracking-wider">
              Level 1 • Risiko Kecil (Rp 1 – 5 Juta)
            </span>
            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
              Cukup Kas Mandiri
            </span>
          </div>
          <p className="text-xs sm:text-sm font-medium text-foreground">
            Contoh: Servis motor/mobil, ganti handphone rusak, rawat jalan flu biasa.
          </p>
          <p className="text-xs text-muted leading-relaxed">
            <strong className="text-foreground">Strategi terbaik:</strong> Tabungan darurat likuid biasa. Tidak perlu membeli asuransi untuk risiko kecil ini karena biaya administrasi dan premi justru tidak efisien.
          </p>
        </div>

        {/* Level 2 */}
        <div className="p-4 rounded-card bg-section/70 border border-border/80 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-teal-brand uppercase tracking-wider">
              Level 2 • Risiko Menengah (Rp 10 – 50 Juta)
            </span>
            <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full">
              Kombinasi Kas &amp; BPJS
            </span>
          </div>
          <p className="text-xs sm:text-sm font-medium text-foreground">
            Contoh: Rawat inap tipus 3 hari, jeda karir 1–2 bulan, perbaikan rumah mendadak.
          </p>
          <p className="text-xs text-muted leading-relaxed">
            <strong className="text-foreground">Strategi terbaik:</strong> Tabungan darurat 3–6 bulan pengeluaran ditambah BPJS Kesehatan atau fasilitas asuransi kantor yang aktif.
          </p>
        </div>

        {/* Level 3 */}
        <div className="p-4 rounded-card bg-teal-50/50 border border-teal-brand/30 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-teal-brand uppercase tracking-wider">
              Level 3 • Risiko Katastropik (&gt; Rp 100 Juta – Ratusan Juta)
            </span>
            <span className="text-[11px] font-semibold text-teal-brand bg-teal-brand/10 px-2 py-0.5 rounded-full">
              Perlu Financial Protection
            </span>
          </div>
          <p className="text-xs sm:text-sm font-medium text-foreground">
            Contoh: Tindakan bedah jantung/kanker (Rp 150jt–500jt), stroke yang membuat berhenti bekerja, atau pencari nafkah tutup usia mendadak.
          </p>
          <p className="text-xs text-muted leading-relaxed">
            <strong className="text-foreground">Strategi terbaik:</strong> Di sinilah proteksi keuangan (asuransi murni) relevan. Tujuannya adalah memindahkan risiko yang terlalu raksasa agar tidak menghancurkan tabungan masa depan dan kelangsungan hidup anak/keluarga.
          </p>
        </div>
      </div>

      {/* 4 CARA MENGELOLA RISIKO */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-muted">
          4 Cara Risiko Dikelola Secara Bertanggung Jawab
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div className="p-4 rounded-card bg-card border border-border space-y-1.5 shadow-soft">
            <div className="text-xl">💰</div>
            <h4 className="text-sm font-bold text-foreground">1. Tabungan Darurat</h4>
            <p className="text-xs text-muted leading-relaxed">
              Fondasi paling awal. Menyerap goncangan kecil tanpa harus berutang ke orang lain.
            </p>
          </div>

          <div className="p-4 rounded-card bg-card border border-border space-y-1.5 shadow-soft">
            <div className="text-xl">📈</div>
            <h4 className="text-sm font-bold text-foreground">2. Diversifikasi Income</h4>
            <p className="text-xs text-muted leading-relaxed">
              Memiliki lebih dari 1 keran pemasukan atau keahlian cadangan agar tidak bergantung 100% pada satu kantor.
            </p>
          </div>

          <div className="p-4 rounded-card bg-card border border-border space-y-1.5 shadow-soft">
            <div className="text-xl">🏢</div>
            <h4 className="text-sm font-bold text-foreground">3. Fasilitas Kantor &amp; BPJS</h4>
            <p className="text-xs text-muted leading-relaxed">
              Hak dasar yang wajib dimaksimalkan selama aktif bekerja dan taat membayar iuran.
            </p>
          </div>

          <div className="p-4 rounded-card bg-card border border-border space-y-1.5 shadow-soft">
            <div className="text-xl">🛡️</div>
            <h4 className="text-sm font-bold text-foreground">4. Proteksi Terukur</h4>
            <p className="text-xs text-muted leading-relaxed">
              Jaring pengaman mandiri yang tetap menjaga keluarga saat skenario terburuk terjadi di luar kontrol kita.
            </p>
          </div>
        </div>
      </div>

      {/* CALL TO ACTION: CHECK YOUR PROTECTION GAP */}
      <div className="p-6 rounded-card-lg bg-teal-brand text-white shadow-card space-y-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-sage-light block mb-1">
            Evaluasi Mandiri 6 Pertanyaan
          </span>
          <h3 className="text-lg sm:text-xl font-bold">
            Cek Apakah Kamu Memiliki "Protection Gap"?
          </h3>
          <p className="text-xs text-white/85 mt-1 leading-relaxed">
            Ketahui apakah kondisi proteksimu saat ini sudah cukup aman, atau ada celah risiko yang membahayakan kelangsungan keluarga. Transparan: jika sudah aman, kami akan sampaikan apa adanya.
          </p>
        </div>

        <button
          onClick={handleStartGap}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-white/95 text-teal-dark font-bold text-xs py-3 px-6 rounded-btn shadow-soft transition-all group"
        >
          <span>Mulai Cek Protection Gap</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* WHATSAPP DISCUSSION */}
      <div className="p-6 rounded-card bg-card border border-border text-center shadow-soft">
        <h4 className="text-sm sm:text-base font-bold text-foreground mb-1">
          Ingin Diskusi Netral tentang Polis / Portofoliomu?
        </h4>
        <p className="text-xs text-muted max-w-md mx-auto leading-relaxed mb-4">
          Banyak orang memiliki polis yang tidak dipahami isinya atau preminya membebani. Kita bisa bedah bersama secara objektif tanpa paksaan membeli produk apa pun.
        </p>
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleWaClick}
          className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold py-2.5 px-5 rounded-btn shadow-soft transition-colors"
        >
          <MessageCircle className="w-4 h-4 fill-white/20" />
          <span>💬 Ngobrol dengan Robert via WhatsApp</span>
        </a>
      </div>
    </div>
  );
};
