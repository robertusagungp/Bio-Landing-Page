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
  CheckCircle2
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
    <div className="max-w-[680px] mx-auto px-4 py-8 animate-in fade-in duration-300">
      {/* Top Header Actions */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <button
          onClick={onRetake}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted hover:text-foreground py-1.5 px-3 rounded-full hover:bg-section transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Hitung Ulang</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleOpenSave}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-brand hover:bg-teal-brand/10 py-1.5 px-3 rounded-full border border-teal-brand/30 transition-colors"
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>Simpan Hasil</span>
          </button>
          
          <button
            onClick={handleOpenShare}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-foreground bg-white hover:bg-section py-1.5 px-3 rounded-full border border-border shadow-soft transition-colors"
          >
            <Share2 className="w-3.5 h-3.5 text-muted" />
            <span>Share</span>
          </button>
        </div>
      </div>

      {/* Main Result Card */}
      <div className="bg-card border border-border rounded-card-lg p-6 sm:p-8 shadow-card space-y-7">
        {/* Eyebrow */}
        <div className="text-center">
          <span className="text-[11px] font-bold text-teal-brand uppercase tracking-wider block mb-1">
            Ringkasan Evaluasi Mandiri
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight-heading">
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
                <div className="text-xs text-muted font-medium mt-1">
                  {scoreSublabel}
                </div>
              )}
            </div>
          )}
        </div>

        {/* LAYER 2: MEANING */}
        <div className="p-4 rounded-card bg-section/70 border border-border/80">
          <div className="text-[11px] font-bold text-teal-brand uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
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
          <div className="pt-4 border-t border-border/80 space-y-3">
            <div className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-sage-dark" />
              {actionTitle}
            </div>
            <div className="space-y-2">
              {actionItems.map((item, index) => (
                <div
                  key={index}
                  className="flex items-start gap-2.5 p-3 rounded-xl bg-background border border-border/70 text-xs text-foreground/90 leading-relaxed"
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
        <div className="mt-6 p-5 rounded-card-lg bg-teal-brand text-white shadow-card">
          <span className="text-[10px] font-bold tracking-widest uppercase text-sage-light block mb-1">
            Langkah Eksplorasi Berikutnya
          </span>
          <h4 className="font-bold text-base sm:text-lg mb-1">
            {recommendedTool.title}
          </h4>
          <p className="text-xs text-white/80 leading-relaxed mb-4">
            {recommendedTool.description}
          </p>
          <button
            onClick={() => onSelectRecommendedTool(recommendedTool.id)}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-white/95 text-teal-dark font-bold text-xs py-2.5 px-5 rounded-btn shadow-soft transition-all group"
          >
            <span>{recommendedTool.buttonLabel}</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      )}

      {/* WHATSAPP CONSULTATION INVITATION */}
      <div className="mt-6 p-6 rounded-card-lg bg-card border border-border text-center shadow-soft">
        <div className="w-10 h-10 rounded-full bg-[#25D366]/15 text-[#25D366] flex items-center justify-center mx-auto mb-3">
          <MessageCircle className="w-5 h-5 fill-current" />
        </div>
        <h4 className="text-sm font-bold text-foreground mb-1">
          Punya pertanyaan tentang hasilmu?
        </h4>
        <p className="text-xs text-muted leading-relaxed max-w-sm mx-auto mb-4">
          Kalau kamu ingin memahami bagaimana hasil ini berkaitan dengan situasi riil keluargamu, kita bisa ngobrol santai.
        </p>
        <a
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleWaClick}
          className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold py-2.5 px-5 rounded-btn shadow-soft transition-colors"
        >
          <span>💬 Tanya Robert via WhatsApp</span>
        </a>
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
