import React, { useState } from 'react';
import { X, Send, CheckCircle2 } from 'lucide-react';

interface LeadCaptureModalProps {
  toolTitle: string;
  onClose: () => void;
}

export const LeadCaptureModal: React.FC<LeadCaptureModalProps> = ({
  toolTitle,
  onClose,
}) => {
  const [firstName, setFirstName] = useState('');
  const [contact, setContact] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contact || !agreed) return;
    
    // Save locally or dispatch
    setSubmitted(true);
    setTimeout(() => {
      onClose();
    }, 2200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-foreground/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-card border border-border max-w-md w-full rounded-card-lg shadow-elevated p-6">
        <div className="flex items-center justify-between pb-3 border-b border-border/80">
          <h4 className="text-sm font-bold text-foreground">Kirim Ringkasan Hasil ke Saya</h4>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-muted hover:text-foreground"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {submitted ? (
          <div className="py-8 text-center space-y-3 animate-in fade-in">
            <div className="w-12 h-12 rounded-full bg-sage/20 text-sage-dark mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-foreground">Terima kasih, {firstName || 'Sahabat'}!</h4>
            <p className="text-xs text-muted leading-relaxed max-w-xs mx-auto">
              Ringkasan hasil evaluasi <strong>{toolTitle}</strong> telah dicatat dan akan kami kirimkan ke kontak Anda.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <p className="text-xs text-muted leading-relaxed">
              Dapatkan salinan terstruktur poin penting hasil <strong>{toolTitle}</strong> beserta panduan aksi prioritas untuk dibaca kembali kapan saja.
            </p>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Nama Panggilan
              </label>
              <input
                type="text"
                placeholder="Contoh: Robert"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-btn bg-background border border-border text-sm text-foreground focus:border-teal-brand focus:ring-1 focus:ring-teal-brand outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Email atau No. WhatsApp <span className="text-terracotta">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="contoh@email.com atau 0812xxxx"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-btn bg-background border border-border text-sm text-foreground focus:border-teal-brand focus:ring-1 focus:ring-teal-brand outline-none transition-all"
              />
              <span className="text-[10px] text-muted block mt-1">
                Pilih salah satu kontak aktif yang paling nyaman bagi Anda.
              </span>
            </div>

            <div className="flex items-start gap-2 pt-1">
              <input
                type="checkbox"
                id="agreement"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-0.5 rounded text-teal-brand focus:ring-teal-brand cursor-pointer"
                required
              />
              <label htmlFor="agreement" className="text-[11px] text-muted leading-tight cursor-pointer">
                Saya setuju menerima ringkasan hasil dan informasi edukasi yang relevan secara berkala.
              </label>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-muted hover:text-foreground rounded-btn"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={!contact || !agreed}
                className="inline-flex items-center gap-2 bg-teal-brand hover:bg-teal-light disabled:opacity-50 text-white font-semibold text-xs py-2.5 px-5 rounded-btn shadow-soft transition-all"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Kirim Ringkasan</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
