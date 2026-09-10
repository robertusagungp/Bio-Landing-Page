import React from 'react';

interface FooterProps {
  onOpenLegal: (type: 'privacy' | 'disclaimer') => void;
  onOpenAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenLegal, onOpenAdmin }) => {
  return (
    <footer className="mt-16 py-10 border-t border-slate-200/80 bg-white/40 text-center text-xs text-muted space-y-3">
      <div className="flex items-center justify-center gap-2 font-semibold text-foreground">
        <span>Robertus Agung Pradana</span>
        <span className="text-muted/40">•</span>
        <span className="text-[11px] font-normal text-muted">Data &amp; Life Readiness Hub</span>
      </div>

      <div className="flex items-center justify-center gap-3 text-[11px] text-muted">
        <button
          onClick={() => onOpenLegal('privacy')}
          className="hover:text-teal-brand transition-colors"
        >
          Kebijakan Privasi
        </button>
        <span className="text-muted/40">•</span>
        <button
          onClick={() => onOpenLegal('disclaimer')}
          className="hover:text-teal-brand transition-colors"
        >
          Disclaimer Etika
        </button>
        {onOpenAdmin && (
          <>
            <span className="text-muted/40">•</span>
            <button
              onClick={onOpenAdmin}
              className="hover:text-teal-brand transition-colors text-muted/50"
            >
              Analytics
            </button>
          </>
        )}
      </div>

      <div className="text-[11px] text-muted/60 pt-1">
        Dibuat untuk tujuan edukasi &amp; peningkatan self-awareness mandiri berbasis data.
      </div>
    </footer>
  );
};
