import React, { useState } from 'react';
import { ChevronDown, ChevronUp, CheckCircle2 } from 'lucide-react';
import { TrustChips } from './TrustChips';

export const AboutSection: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <section id="about" className="py-10 sm:py-12 px-4 max-w-[760px] mx-auto">
      <div className="bg-card border border-border rounded-card-lg p-5 sm:p-8 shadow-soft">
        {/* Profile Card Header with Robert's Photo */}
        <div className="flex items-center gap-3.5 sm:gap-4 mb-5 pb-4 border-b border-border/70">
          <div className="relative">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-teal-brand/30 p-0.5 bg-card shadow-soft overflow-hidden shrink-0">
              <img
                src="/foto-robert.png"
                alt="Robertus Agung Pradana"
                className="w-full h-full object-cover object-[center_12%]"
              />
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 bg-sage text-white p-0.5 rounded-full border-2 border-white">
              <CheckCircle2 className="w-3 h-3" />
            </div>
          </div>

          <div>
            <h3 className="text-base sm:text-lg font-bold text-foreground leading-snug">
              Robertus Agung Pradana
            </h3>
            <p className="text-xs text-teal-brand font-semibold">
              Data • Health • Quantitative Risk
            </p>
            <span className="inline-block text-[10px] text-muted bg-section px-2 py-0.5 rounded-full mt-1">
              Inisiator & Pengembang Hub
            </span>
          </div>
        </div>

        {/* Bio Copy */}
        <div className="space-y-3.5 text-xs sm:text-sm text-foreground/90 leading-relaxed font-normal">
          <p>
            Halo, saya <strong>Robertus Agung Pradana</strong>.
          </p>
          <p>
            Latar belakang saya berada di bidang matematika, data science, analytics, dan business strategy. Saat ini saya bekerja sebagai <em>Head of Data Science</em> di industri healthcare.
          </p>
          <p>
            Saya lulusan <strong>Matematika Universitas Indonesia</strong> dan juga telah menyelesaikan modul pembelajaran aktuaria (Persatuan Aktuaris Indonesia: A10, A20, A50).
          </p>
          <p>
            Saya percaya keputusan mengenai kesehatan dan keuangan menjadi jauh lebih mudah ketika risiko dapat dipahami dengan sederhana, objektif, dan berbasis data.
          </p>
          <p>
            Karena itu, saya membuat halaman ini sebagai kumpulan tools sederhana yang membantu kita melihat kondisi hidup dari sudut yang lebih terukur — tanpa kesan rumit, menghakimi, atau intimidatif.
          </p>

          {isExpanded && (
            <div className="pt-3 border-t border-border/60 space-y-3 text-xs text-muted leading-relaxed animate-in fade-in duration-200">
              <p>
                <strong>Prinsip Halaman Ini:</strong> Website ini dibangun dengan etika <em>Value First</em>. Seluruh tools dapat dicoba secara instan tanpa perlu mendaftar, tanpa meminta nomor telepon atau email terlebih dahulu, dan tanpa mengharuskan Anda membeli produk apa pun.
              </p>
              <p>
                Informasi dan kalkulator di situs ini murni merupakan proyek independen pribadi untuk tujuan literasi dan self-awareness masyarakat, serta tidak mewakili atau berafiliasi secara komersial dengan institusi kantor tempat saya bekerja.
              </p>
            </div>
          )}
        </div>

        {/* Trust Chips */}
        <div className="mt-6 pt-5 border-t border-border">
          <TrustChips />
        </div>

        {/* Expand / Collapse Button */}
        <div className="mt-5 text-center">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-brand hover:text-teal-dark transition-colors py-1 px-3 rounded-full hover:bg-section"
          >
            <span>{isExpanded ? 'Tutup detail' : 'Baca prinsip selengkapnya'}</span>
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>
    </section>
  );
};
