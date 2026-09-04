import React from 'react';
import { Eye, ShieldAlert, Sparkles } from 'lucide-react';

export const WhyThisExists: React.FC = () => {
  return (
    <section className="py-8 px-4 max-w-[760px] mx-auto">
      <div className="bg-section rounded-card-lg p-6 sm:p-8 border border-border/70">
        <div className="max-w-xl">
          <span className="text-[11px] font-bold text-teal-brand uppercase tracking-wider block mb-2">
            Filosofi Pemikiran
          </span>
          <h3 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight-heading">
            Kenapa Halaman Ini Dibuat?
          </h3>
          <p className="mt-2 text-xs sm:text-sm text-muted leading-relaxed">
            Kita sering mengambil keputusan besar dalam kesehatan dan keuangan hanya berdasarkan intuisi atau rasa cemas. Padahal risiko hidup dapat dimodelkan secara terukur.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          <div className="bg-card p-4 rounded-card border border-border/80 shadow-soft">
            <div className="w-8 h-8 rounded-lg bg-teal-brand/10 text-teal-brand flex items-center justify-center mb-3">
              <Eye className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-foreground mb-1">Melihat Realitas</h4>
            <p className="text-[11px] text-muted leading-relaxed">
              Bukan menakut-nakuti, melainkan memberi data jernih tentang di mana posisi ketahanan hidupmu saat ini.
            </p>
          </div>

          <div className="bg-card p-4 rounded-card border border-border/80 shadow-soft">
            <div className="w-8 h-8 rounded-lg bg-sage/20 text-sage-dark flex items-center justify-center mb-3">
              <Sparkles className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-foreground mb-1">Bebas Menilai Diri</h4>
            <p className="text-[11px] text-muted leading-relaxed">
              Tidak ada intervensi agen atau tekanan penjualan. Kamu memegang kendali penuh atas informasi dan kecepatanmu.
            </p>
          </div>

          <div className="bg-card p-4 rounded-card border border-border/80 shadow-soft">
            <div className="w-8 h-8 rounded-lg bg-terracotta/15 text-terracotta-dark flex items-center justify-center mb-3">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-foreground mb-1">Solusi Seimbang</h4>
            <p className="text-[11px] text-muted leading-relaxed">
              Risiko tidak hanya diatasi oleh satu produk, melainkan kombinasi tabungan likuid, pola hidup sehat, dan proteksi.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
