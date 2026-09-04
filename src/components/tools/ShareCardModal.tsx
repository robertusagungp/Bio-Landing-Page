import React, { useState } from 'react';
import { X, Share2, Copy, Check, Download } from 'lucide-react';
import { getScoreCategory } from '../../utils/formatters';

interface PillarScore {
  name: string;
  score: number;
}

interface ShareCardModalProps {
  toolTitle: string;
  score: number;
  maxScore?: number;
  pillars?: PillarScore[];
  subtitle?: string;
  onClose: () => void;
}

export const ShareCardModal: React.FC<ShareCardModalProps> = ({
  toolTitle,
  score,
  maxScore = 100,
  pillars = [],
  subtitle,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);
  const meta = getScoreCategory(score);

  const shareText = `Saya baru saja mengecek ${toolTitle} di hub kesehatan & kesiapan hidup Robertus Agung Pradana.\n\nSkor saya: ${score}/${maxScore} (${meta.labelId})\n\nCek skor kesiapan hidupmu tanpa login di: ${window.location.origin}`;

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${toolTitle} - Robertus Agung Pradana`,
          text: shareText,
          url: window.location.origin,
        });
      } catch (e) {
        console.error(e);
      }
    } else {
      handleCopyText();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-foreground/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-card border border-border max-w-sm w-full rounded-card-lg shadow-elevated overflow-hidden p-6">
        <div className="flex items-center justify-between pb-3 border-b border-border/80">
          <span className="text-xs font-bold text-foreground">Bagikan Hasil (Story Ready)</span>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-muted hover:text-foreground"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Story Card Preview (Instagram Story aesthetic: 9:16 vertical style) */}
        <div className="my-5 p-6 rounded-card bg-[#F7F4EE] border-2 border-teal-brand/20 text-center shadow-card text-[#172321]">
          <div className="text-[10px] font-extrabold tracking-widest uppercase text-teal-brand mb-1">
            PERSONAL LIFE HUB
          </div>
          <div className="text-xs font-bold uppercase tracking-tight text-foreground/80 mb-4">
            {toolTitle}
          </div>

          <div className="my-3 py-4 bg-white rounded-2xl border border-border/80 shadow-soft">
            <div className="text-4xl font-extrabold tracking-tight text-teal-brand">
              {score}
              <span className="text-sm font-semibold text-muted"> / {maxScore}</span>
            </div>
            <div className="mt-1">
              <span
                className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold text-white"
                style={{ backgroundColor: meta.pillColor }}
              >
                {meta.labelId}
              </span>
            </div>
          </div>

          {pillars.length > 0 && (
            <div className="space-y-1.5 my-4 text-left text-xs bg-white/70 p-3 rounded-xl border border-border/50">
              {pillars.map((p, i) => (
                <div key={i} className="flex justify-between items-center text-[11px]">
                  <span className="text-muted font-medium">{p.name}</span>
                  <span className="font-bold text-foreground">{p.score}</span>
                </div>
              ))}
            </div>
          )}

          <div className="mt-4 pt-3 border-t border-border/60">
            <div className="text-xs font-serif italic text-muted mb-0.5">
              "What's yours?"
            </div>
            <div className="text-[11px] font-bold text-teal-brand">
              robertusagung.com
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <button
            onClick={handleNativeShare}
            className="w-full flex items-center justify-center gap-2 bg-teal-brand hover:bg-teal-light text-white font-semibold py-2.5 px-4 rounded-btn text-xs transition-colors shadow-soft"
          >
            <Share2 className="w-4 h-4" />
            <span>Bagikan ke Media Sosial / Story</span>
          </button>

          <button
            onClick={handleCopyText}
            className="w-full flex items-center justify-center gap-2 bg-section hover:bg-section/80 text-foreground font-semibold py-2 px-4 rounded-btn text-xs transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-sage" /> : <Copy className="w-4 h-4 text-muted" />}
            <span>{copied ? 'Teks Berhasil Disalin!' : 'Salin Teks Ringkasan'}</span>
          </button>
        </div>

        <div className="mt-3 text-center text-[10px] text-muted">
          *Gambar preview tidak memuat informasi sensitif personal.
        </div>
      </div>
    </div>
  );
};
