import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { getWhatsAppLink } from '../../utils/formatters';
import { ActiveToolId } from '../../types/profile';

interface WhatsAppFloatingProps {
  lastCompletedTool?: ActiveToolId;
}

export const WhatsAppFloating: React.FC<WhatsAppFloatingProps> = ({ lastCompletedTool }) => {
  const [isOpen, setIsOpen] = useState(false);

  const getContextKey = () => {
    switch (lastCompletedTool) {
      case 'life-readiness': return 'life-readiness';
      case 'financial-health': return 'financial-health';
      case 'emergency-checker': return 'emergency';
      case 'lifestyle-age':
      case 'wellness-score': return 'lifestyle';
      case 'medical-simulator': return 'medical';
      case 'family-readiness': return 'family';
      default: return 'default';
    }
  };

  const link = getWhatsAppLink(getContextKey());

  return (
    <aside aria-label="Konsultasi WhatsApp" className="fixed bottom-16 sm:bottom-6 right-4 sm:right-6 z-40">
      {isOpen && (
        <div className="mb-3 p-4 bg-card border border-border rounded-card shadow-elevated max-w-[280px] animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="text-xs font-bold text-foreground">
              Tanya Robert via WhatsApp
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-muted hover:text-foreground p-0.5 rounded-full"
              aria-label="Tutup dialog chat"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="text-[11px] text-muted leading-relaxed mb-3">
            Punya pertanyaan mengenai interpretasi hasil skor atau simulasi risikomu? Kita bisa ngobrol santai.
          </p>
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-semibold py-2 px-3 rounded-btn transition-colors shadow-soft"
          >
            <MessageCircle className="w-4 h-4 fill-white/20" />
            Buka Percakapan
          </a>
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-card hover:bg-white text-foreground border border-border/80 px-3.5 py-2.5 rounded-full shadow-card hover:shadow-elevated transition-all active:scale-95 group"
        aria-label="Buka bantuan konsultasi via WhatsApp"
      >
        <div className="w-7 h-7 rounded-full bg-[#25D366]/15 text-[#25D366] flex items-center justify-center group-hover:scale-110 transition-transform">
          <MessageCircle className="w-4 h-4 fill-current" />
        </div>
        <span className="text-xs font-semibold text-foreground hidden sm:inline">
          Tanya Robert
        </span>
      </button>
    </aside>
  );
};
