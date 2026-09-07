import React from 'react';

interface FooterProps {
  onOpenLegal: (type: 'privacy' | 'disclaimer') => void;
  onOpenAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenLegal, onOpenAdmin }) => {
  return (
    <footer className="mt-12 py-8 border-t border-border/80 text-center text-xs text-muted space-y-2">
      <div className="font-semibold text-foreground/90">
        Robertus Agung Pradana
      </div>

      <div className="flex items-center justify-center gap-3 text-[11px]">
        <button
          onClick={() => onOpenLegal('privacy')}
          className="hover:text-foreground hover:underline transition-colors"
        >
          Privacy
        </button>
        <span>•</span>
        <button
          onClick={() => onOpenLegal('disclaimer')}
          className="hover:text-foreground hover:underline transition-colors"
        >
          Disclaimer
        </button>
        {onOpenAdmin && (
          <>
            <span>•</span>
            <button
              onClick={onOpenAdmin}
              className="hover:text-foreground hover:underline transition-colors text-muted/60"
            >
              🔒 Analytics
            </button>
          </>
        )}
      </div>

      <div className="text-[10px] text-muted/70 pt-1">
        Personal Wellness &amp; Life Readiness Hub
      </div>
    </footer>
  );
};
