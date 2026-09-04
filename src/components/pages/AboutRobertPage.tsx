import React from 'react';
import { ArrowLeft, CheckCircle2, MessageCircle, Shield, Award, BookOpen, BarChart3, HeartHandshake } from 'lucide-react';
import { getWhatsAppLink } from '../../utils/formatters';

interface AboutRobertPageProps {
  onBackToHome: () => void;
}

export const AboutRobertPage: React.FC<AboutRobertPageProps> = ({ onBackToHome }) => {
  const waUrl = getWhatsAppLink('default');

  return (
    <div className="max-w-[680px] mx-auto px-4 py-8 space-y-8 animate-in fade-in duration-200">
      {/* Top Back Navigation */}
      <div>
        <button
          onClick={onBackToHome}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted hover:text-foreground py-1.5 px-3 rounded-full hover:bg-section transition-colors mb-4"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali ke Beranda</span>
        </button>

        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
          Tentang Robertus Agung Pradana
        </h2>
        <p className="text-xs sm:text-sm text-muted mt-1">
          Latar belakang profesional, kredensial kuantitatif, dan prinsip di balik pembuatan hub ini.
        </p>
      </div>

      {/* Profile Card Header */}
      <div className="bg-card border border-border rounded-card p-6 shadow-soft flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
        <div className="w-24 h-24 rounded-full border-2 border-border p-0.5 overflow-hidden shrink-0 shadow-soft bg-card">
          <img
            src="/foto-robert.png"
            alt="Robertus Agung Pradana"
            className="w-full h-full object-cover object-[center_12%]"
          />
        </div>
        <div>
          <h3 className="text-lg font-bold text-foreground">
            Robertus Agung Pradana
          </h3>
          <p className="text-xs sm:text-sm font-semibold text-teal-brand mt-0.5">
            Data • Health • Financial Readiness
          </p>
          <p className="text-xs text-muted mt-2 leading-relaxed">
            Head of Data Science di industri healthcare dengan fokus pada analisis kuantitatif, pemodelan probabilitas risiko, dan strategi data.
          </p>
        </div>
      </div>

      {/* Detailed Background & Story */}
      <div className="bg-card border border-border rounded-card p-6 space-y-4 text-xs sm:text-sm text-foreground/90 leading-relaxed shadow-soft">
        <h4 className="font-bold text-foreground text-sm flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-teal-brand" />
          Latar Belakang &amp; Pendidikan
        </h4>
        <p>
          Saya menyelesaikan pendidikan sarjana di bidang <strong>Matematika, Universitas Indonesia</strong>. Sepanjang perjalanan akademis dan profesional, minat utama saya terpusat pada bagaimana angka, statistika terapan, dan kalkulasi risiko dapat memandu pengambilan keputusan hidup yang lebih bijak.
        </p>
        <p>
          Saya juga mendalami bidang aktuaria dan telah menyelesaikan ujian sertifikasi dari <strong>Persatuan Aktuaris Indonesia (PAI)</strong>:
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 py-1">
          <div className="p-2.5 rounded-xl bg-section border border-border/70 text-xs">
            <span className="font-bold text-teal-brand block">Modul A10</span>
            <span className="text-[11px] text-muted">Matematika Keuangan</span>
          </div>
          <div className="p-2.5 rounded-xl bg-section border border-border/70 text-xs">
            <span className="font-bold text-teal-brand block">Modul A20</span>
            <span className="text-[11px] text-muted">Probabilita &amp; Statistika</span>
          </div>
          <div className="p-2.5 rounded-xl bg-section border border-border/70 text-xs">
            <span className="font-bold text-teal-brand block">Modul A50</span>
            <span className="text-[11px] text-muted">Metode Statistik</span>
          </div>
        </div>

        <p>
          Saat ini saya memimpin divisi data sebagai <strong>Head of Data Science</strong> di industri kesehatan (healthcare), merancang pemodelan prediktif, analitika klinis dan operasional, serta integrasi data preventif.
        </p>
      </div>

      {/* Why This Exists & Principles */}
      <div className="bg-card border border-border rounded-card p-6 space-y-3.5 text-xs sm:text-sm text-foreground/90 leading-relaxed shadow-soft">
        <h4 className="font-bold text-foreground text-sm flex items-center gap-2">
          <HeartHandshake className="w-4 h-4 text-teal-brand" />
          Prinsip &amp; Filosofi Hub Ini
        </h4>
        <p>
          Keputusan mengenai kesehatan dan keuangan sering kali terasa menakutkan karena diselimuti istilah teknis yang rumit, jargon investasi, atau dorongan penjualan produk yang agresif.
        </p>
        <p>
          Saya percaya bahwa ketika seseorang memahami posisinya secara objektif—berapa lama tabungannya bertahan, bagaimana kebiasaan tidurnya memengaruhi tubuh, atau apa dampak jika terjadi rawat inap—mereka dapat mengambil keputusan yang tenang dan proporsional.
        </p>
        <div className="p-3.5 rounded-xl bg-teal-brand/10 border border-teal-brand/20 text-xs text-teal-brand font-medium">
          “Tujuan halaman ini bukan untuk menjual produk, melainkan memberikan cermin data yang jernih agar kamu mengenali kondisi hidupmu sendiri.”
        </div>
      </div>

      {/* Disclaimers & Ethics */}
      <div className="p-4 rounded-card bg-section border border-border text-[11px] text-muted space-y-2 leading-relaxed">
        <div className="font-semibold text-foreground flex items-center gap-1.5">
          <Shield className="w-3.5 h-3.5 text-sage" />
          Pernyataan Independensi &amp; Etika
        </div>
        <p>
          Halaman ini merupakan inisiatif literasi pribadi Robertus Agung Pradana dan tidak mewakili atau berafiliasi secara resmi dengan kebijakan korporasi institusi tempat saya bekerja.
        </p>
        <p>
          Robertus Agung Pradana bukan merupakan dokter praktik klinis, perencana keuangan bersertifikat (CFP), atau penasihat investasi terdaftar. Seluruh materi dan kalkulator dirancang murni untuk tujuan edukasi dan self-awareness mandiri.
        </p>
      </div>

      {/* WhatsApp Chat CTA */}
      <div className="p-6 rounded-card bg-card border border-border text-center shadow-soft space-y-3">
        <h4 className="text-sm font-bold text-foreground">
          Ingin Diskusi atau Berkenalan Lebih Lanjut?
        </h4>
        <p className="text-xs text-muted max-w-sm mx-auto">
          Saya selalu terbuka untuk berdiskusi seputar data, kesiapan risiko hidup, atau konsultasi santai seputar hasil assessment-mu.
        </p>
        <div>
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold py-2.5 px-5 rounded-btn shadow-soft transition-colors"
          >
            <MessageCircle className="w-4 h-4 fill-white/20" />
            <span>💬 Chat via WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  );
};
