import React, { useState } from 'react';
import { 
  Share2, 
  Bookmark, 
  MessageCircle, 
  ArrowRight, 
  RotateCcw,
  Sparkles, 
  HelpCircle, 
  TrendingUp, 
  CheckCircle2,
  Share
} from 'lucide-react';
import { getWhatsAppLink } from '../../utils/formatters';
import { ShareCardModal } from './ShareCardModal';
import { LeadCaptureModal } from './LeadCaptureModal';
import { ActiveToolId } from '../../types/profile';
import { RiskEducationBridge } from './RiskEducationBridge';
import { analytics } from '../../utils/analytics';

interface PillarScore {
  name: string;
  score: number;
}

interface ResultWrapperProps {
  toolTitle: string;
  scoreNumber?: number | string;
  scoreSublabel?: string;
  scoreElement?: React.ReactNode;
  meaning: string;
  whyExplanation: string;
  children?: React.ReactNode;
  actionTitle?: string;
  actionItems: string[];
  pillarsForShare?: PillarScore[];
  recommendedTool?: {
    id: ActiveToolId;
    title: string;
    description: string;
    buttonLabel: string;
  };
  onSelectRecommendedTool?: (toolId: ActiveToolId) => void;
  onRetake: () => void;
  contextWaKey?: 'life-readiness' | 'financial-health' | 'emergency' | 'lifestyle' | 'medical' | 'family';
  onNavigateToEducation?: () => void;
  onNavigateToProtectionGap?: () => void;
  hideRiskBridge?: boolean;
}

export const ResultWrapper: React.FC<ResultWrapperProps> = ({
  toolTitle,
  scoreNumber,
  scoreSublabel,
  scoreElement,
  meaning,
  whyExplanation,
  children,
  actionTitle = '3 Langkah Prioritas Berikutnya',
  actionItems,
  pillarsForShare = [],
  recommendedTool,
  onSelectRecommendedTool,
  onRetake,
  contextWaKey = 'life-readiness',
  onNavigateToEducation,
  onNavigateToProtectionGap,
  hideRiskBridge = false,
}) => {
  const [showShareModal, setShowShareModal] = useState(false);
  const [showLeadModal, setShowLeadModal] = useState(false);

  const waLink = getWhatsAppLink(contextWaKey);

  const handleWaClick = () => {
    analytics.track('whatsapp_clicked', {
      source_tool: toolTitle,
      context_key: contextWaKey,
      button_location: 'result_card_footer',
    });
  };

  const handleOpenShare = () => {
    analytics.track('share_modal_opened', { tool_title: toolTitle });
    setShowShareModal(true);
  };

  const handleOpenSave = () => {
    analytics.track('lead_capture_saved', { tool_title: toolTitle, action: 'open_modal' });
    setShowLeadModal(true);
  };

  return (
    <div className="max-w-[680px] mx-auto px-4 py-6 sm:py-8 animate-in fade-in duration-300">
      {/* Top Header Actions */}
      <div className="flex items-center justify-between gap-4 mb-5">
        <button
          onClick={onRetake}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted hover:text-foreground py-1.5 px-3.5 rounded-full bg-white border border-slate-200 shadow-soft hover:bg-slate-50 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Hitung Ulang</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleOpenSave}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-brand hover:bg-emerald-50 py-1.5 px-3.5 rounded-full border border-teal-brand/30 bg-white shadow-soft transition-colors"
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>Simpan</span>
          </button>
          
          <button
            onClick={handleOpenShare}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-foreground bg-white hover:bg-slate-50 py-1.5 px-3.5 rounded-full border border-slate-200 shadow-soft transition-colors"
          >
            <Share2 className="w-3.5 h-3.5 text-muted" />
            <span>Bagikan</span>
          </button>
        </div>
      </div>

      {/* Main Result Card */}
      <div className="bg-white border border-slate-200/90 rounded-card-lg p-6 sm:p-8 shadow-card space-y-7">
        {/* Eyebrow */}
        <div className="text-center">
          <span className="text-[11px] font-bold text-teal-brand uppercase tracking-wider block mb-1">
            Ringkasan Evaluasi Mandiri
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight">
            {toolTitle}
          </h2>
        </div>

        {/* LAYER 1: SCORE / KEY NUMBER */}
        <div className="py-2">
          {scoreElement ? (
            scoreElement
          ) : (
            <div className="text-center">
              <div className="text-5xl font-extrabold text-teal-brand tracking-tight">
                {scoreNumber}
              </div>
              {scoreSublabel && (
                <div className="text-xs text-muted font-medium mt-1.5">
                  {scoreSublabel}
                </div>
              )}
            </div>
          )}
        </div>

        {/* LAYER 2: MEANING */}
        <div className="p-4 rounded-card bg-emerald-50/80 border border-emerald-200/70">
          <div className="text-[11px] font-bold text-teal-brand uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            Makna Hasil Ini
          </div>
          <p className="text-sm font-semibold text-foreground leading-relaxed">
            "{meaning}"
          </p>
        </div>

        {/* LAYER 3: WHY EXPLANATION */}
        <div className="space-y-1.5">
          <div className="text-xs font-bold text-foreground flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5 text-muted" />
            Kenapa Hasilnya Demikian?
          </div>
          <p className="text-xs sm:text-sm text-muted leading-relaxed">
            {whyExplanation}
          </p>
        </div>

        {/* Dynamic Tool Specific Children (e.g. Pillar bars, Scenarios, Breakdowns) */}
        {children && <div className="space-y-6 pt-2">{children}</div>}

        {/* LAYER 4: ACTION PLAN */}
        {actionItems && actionItems.length > 0 && (
          <div className="pt-4 border-t border-slate-100 space-y-3">
            <div className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-teal-brand" />
              {actionTitle}
            </div>
            <div className="space-y-2">
              {actionItems.map((item, index) => (
                <div
                  key={index}
                  className="flex items-start gap-2.5 p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 text-xs text-foreground/90 leading-relaxed"
                >
                  <span className="w-5 h-5 rounded-full bg-teal-brand/10 text-teal-brand font-bold flex items-center justify-center shrink-0 text-[11px]">
                    {index + 1}
                  </span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* LAYER 5: NEUTRAL RISK EDUCATION BRIDGE */}
        {!hideRiskBridge && (
          <RiskEducationBridge
            toolContext={toolTitle}
            onNavigateToEducation={onNavigateToEducation}
            onNavigateToProtectionGap={onNavigateToProtectionGap}
          />
        )}
      </div>

      {/* SMART CROSS-TOOL NEXT STEP */}
      {recommendedTool && onSelectRecommendedTool && (
        <div className="mt-6 p-6 rounded-card-lg bg-gradient-to-br from-teal-brand to-[#093e37] text-white shadow-card">
          <span className="text-[10px] font-bold tracking-widest uppercase text-emerald-300 block mb-1">
            Rekomendasi Langkah Berikutnya
          </span>
          <h4 className="font-bold text-base sm:text-lg mb-1">
            {recommendedTool.title}
          </h4>
          <p className="text-xs text-white/80 leading-relaxed mb-4">
            {recommendedTool.description}
          </p>
          <button
            onClick={() => onSelectRecommendedTool(recommendedTool.id)}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-teal-brand font-bold text-xs py-2.5 px-5 rounded-btn shadow-soft transition-all group"
          >
            <span>{recommendedTool.buttonLabel}</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      )}

      {/* WHATSAPP CONSULTATION INVITATION */}
      <div className="mt-6 p-6 rounded-card-lg bg-white border border-slate-200/90 text-center shadow-card space-y-3">
        <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-1">
          <MessageCircle className="w-5 h-5 fill-emerald-500/20" />
        </div>
        <h4 className="text-sm font-bold text-foreground">
          Punya pertanyaan tentang hasilmu?
        </h4>
        <p className="text-xs text-muted leading-relaxed max-w-sm mx-auto">
          Jika kamu ingin memahami bagaimana hasil ini berkaitan dengan situasi riil keluargamu, kita bisa berdiskusi santai.
        </p>
        <div className="pt-2">
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleWaClick}
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white text-xs font-bold py-2.5 px-6 rounded-btn shadow-soft transition-all"
          >
            <MessageCircle className="w-4 h-4 fill-white/20" />
            <span>Tanya Robert via WhatsApp</span>
          </a>
        </div>
      </div>

      {/* Modals */}
      {showShareModal && (
        <ShareCardModal
          toolTitle={toolTitle}
          score={typeof scoreNumber === 'number' ? scoreNumber : 70}
          pillars={pillarsForShare}
          onClose={() => setShowShareModal(false)}
        />
      )}

      {showLeadModal && (
        <LeadCaptureModal
          toolTitle={toolTitle}
          onClose={() => setShowLeadModal(false)}
        />
      )}
    </div>
  );
};
