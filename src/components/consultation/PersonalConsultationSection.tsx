import React from 'react';
import { MessageCircle, HelpCircle, Shield, HeartHandshake, FileCheck } from 'lucide-react';
import { getWhatsAppLink } from '../../utils/formatters';

export const PersonalConsultationSection: React.FC = () => {
  const options = [
    {
      title: 'Diskusi Hasil Assessment',
      description: 'Membahas arti skor kesiapan hidupmu dan bagaimana menyusun prioritas tindakan awal.',
      context: 'life-readiness' as const,
      icon: HelpCircle,
    },
    {
      title: 'Financial Readiness Review',
      description: 'Evaluasi struktur cash flow, rasio utang aman, dan strategi membangun buffer likuiditas.',
      context: 'financial-health' as const,
      icon: FileCheck,
    },
    {
      title: 'Family Risk Planning',
      description: 'Memetakan kesinambungan nafkah keluarga dan proteksi tanggungan dari risiko tak terduga.',
      context: 'family' as const,
      icon: UsersIcon,
    },
    {
      title: 'Health-Related Financial Readiness',
      description: 'Menakar kecukupan proteksi kesehatan terhadap skenario biaya perawatan medis rumah sakit.',
      context: 'medical' as const,
      icon: Shield,
    },
  ];

  return (
    <section className="py-12 px-4 max-w-[760px] mx-auto">
      <div className="bg-card border border-border rounded-card-lg p-6 sm:p-8 shadow-card">
        <div className="text-center max-w-md mx-auto mb-6">
          <span className="text-[11px] font-bold text-teal-brand uppercase tracking-wider block mb-1">
            Konsultasi Pribadi & Objektif
          </span>
          <h3 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight-heading">
            Butuh Bantuan Lebih Personal?
          </h3>
          <p className="text-xs sm:text-sm text-muted mt-2 leading-relaxed">
            Jika kamu ingin membedah hasil assessment atau mendiskusikan situasi keuangan dan risiko keluargamu dari sudut pandang data, kamu bisa memilih topik ngobrol di bawah ini:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          {options.map((opt, i) => {
            const Icon = opt.icon;
            const waUrl = getWhatsAppLink(opt.context);
            return (
              <a
                key={i}
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-card bg-section/60 hover:bg-white border border-border/80 hover:border-teal-brand/40 shadow-soft hover:shadow-card transition-all text-left group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-2 font-bold text-xs text-foreground group-hover:text-teal-brand transition-colors mb-1">
                    <Icon className="w-4 h-4 text-teal-brand" />
                    <span>{opt.title}</span>
                  </div>
                  <p className="text-[11px] text-muted leading-relaxed">
                    {opt.description}
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-border/40 text-[11px] font-semibold text-teal-brand flex items-center gap-1">
                  <span>Mulai Diskusi via WA</span>
                  <span>→</span>
                </div>
              </a>
            );
          })}
        </div>

        <div className="p-4 rounded-card bg-teal-brand text-white text-center flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-left">
            <h4 className="text-xs sm:text-sm font-bold">Obrolan Santai & Berbasis Kebutuhan Riil</h4>
            <p className="text-[11px] text-white/80 mt-0.5">
              Tanpa tekanan produk, tanpa spam, mengutamakan pemahaman objektif.
            </p>
          </div>
          <a
            href={getWhatsAppLink('default')}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold py-2.5 px-4 rounded-btn shadow-soft transition-colors shrink-0"
          >
            <MessageCircle className="w-4 h-4 fill-white/20" />
            <span>💬 Chat Robert via WhatsApp</span>
          </a>
        </div>
      </div>
    </section>
  );
};

function UsersIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}
