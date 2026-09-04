import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Info } from 'lucide-react';

interface CalculationAccordionProps {
  title?: string;
  methodologyDescription: string;
  factors: { name: string; weight?: string; description: string }[];
  categories?: { range: string; label: string; note: string }[];
}

export const CalculationAccordion: React.FC<CalculationAccordionProps> = ({
  title = 'Transparansi: Cara Skor Ini Dihitung',
  methodologyDescription,
  factors,
  categories = [
    { range: '0–39', label: 'Perlu Perhatian Khusus', note: 'Titik kerapuhan tinggi yang memerlukan tindakan segera.' },
    { range: '40–59', label: 'Membangun Fondasi', note: 'Fondasi awal sudah terbentuk, namun masih rentan terhadap kejutan.' },
    { range: '60–74', label: 'Fondasi Cukup Baik', note: 'Stabilitas harian terjaga dengan beberapa ruang penguatan.' },
    { range: '75–89', label: 'Kuat & Terstruktur', note: 'Ketahanan tergolong tinggi dalam menghadapi ketidakpastian.' },
    { range: '90–100', label: 'Sangat Kuat & Resilien', note: 'Tingkat resiliensi optimal di berbagai skenario risiko.' },
  ],
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-border rounded-card bg-card overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-section/50 transition-colors"
      >
        <div className="flex items-center gap-2 text-xs font-bold text-foreground">
          <Info className="w-4 h-4 text-teal-brand shrink-0" />
          <span>{title}</span>
        </div>
        {isOpen ? (
          <ChevronUp className="w-4 h-4 text-muted" />
        ) : (
          <ChevronDown className="w-4 h-4 text-muted" />
        )}
      </button>

      {isOpen && (
        <div className="p-4 pt-0 border-t border-border/60 text-xs text-muted leading-relaxed space-y-4 animate-in fade-in duration-150">
          <p className="mt-3">
            {methodologyDescription}
          </p>

          <div>
            <div className="font-bold text-foreground mb-2">Faktor & Komponen Pembobotan:</div>
            <div className="space-y-2">
              {factors.map((f, i) => (
                <div key={i} className="p-2.5 rounded-xl bg-section/70 border border-border/50 text-[11px]">
                  <div className="flex items-center justify-between font-semibold text-foreground">
                    <span>{f.name}</span>
                    {f.weight && <span className="text-teal-brand">{f.weight}</span>}
                  </div>
                  <p className="mt-0.5 text-muted">{f.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="font-bold text-foreground mb-2">Rentang Kategori Self-Assessment:</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px]">
              {categories.map((c, i) => (
                <div key={i} className="p-2 rounded-lg bg-section/40 flex items-start gap-2">
                  <span className="font-bold text-foreground shrink-0">{c.range}:</span>
                  <div>
                    <span className="font-semibold text-foreground/90">{c.label}</span>
                    <p className="text-[10px] text-muted">{c.note}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-[10px] text-muted/80 italic pt-1">
            *Skor ini merupakan estimasi edukatif terstruktur untuk membantu kesadaran diri (self-awareness), bukan sertifikasi atau audit medis/finansial formal.
          </div>
        </div>
      )}
    </div>
  );
};
