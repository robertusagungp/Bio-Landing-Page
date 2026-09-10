import React, { useState, useEffect } from 'react';
import { ArrowLeft, Check, ShieldCheck } from 'lucide-react';
import { analytics } from '../../utils/analytics';

export interface QuestionOption {
  label: string;
  value: string;
  description?: string;
  icon?: string;
}

export interface QuestionStep {
  id: string;
  title: string;
  subtitle?: string;
  options: QuestionOption[];
}

interface QuestionRunnerProps {
  toolTitle: string;
  toolCategory: string;
  questions: QuestionStep[];
  currentStepIndex: number;
  selectedValues: { [key: string]: string };
  onSelectOption: (questionId: string, value: string) => void;
  onBack: () => void;
  onCancel: () => void;
}

export const QuestionRunner: React.FC<QuestionRunnerProps> = ({
  toolTitle,
  toolCategory,
  questions,
  currentStepIndex,
  selectedValues,
  onSelectOption,
  onBack,
  onCancel,
}) => {
  const [animatingValue, setAnimatingValue] = useState<string | null>(null);

  const currentQ = questions[currentStepIndex];

  useEffect(() => {
    if (currentQ) {
      analytics.track('tool_question_viewed', {
        tool_name: toolTitle,
        step_index: currentStepIndex + 1,
        total_steps: questions.length,
        question_id: currentQ.id,
      });
    }
  }, [currentStepIndex, currentQ?.id, toolTitle, questions.length]);

  if (!currentQ) return null;

  const totalQuestions = questions.length;
  const progressPct = ((currentStepIndex + 1) / totalQuestions) * 100;
  const selectedValue = selectedValues[currentQ.id];

  const handleChoose = (val: string) => {
    setAnimatingValue(val);
    analytics.track('tool_question_answered', {
      tool_name: toolTitle,
      step_index: currentStepIndex + 1,
      total_steps: totalQuestions,
      question_id: currentQ.id,
    });
    setTimeout(() => {
      onSelectOption(currentQ.id, val);
      setAnimatingValue(null);
    }, 180);
  };

  const handleCancelClick = () => {
    analytics.track('tool_abandoned', {
      tool_name: toolTitle,
      drop_off_step: currentStepIndex + 1,
      total_steps: totalQuestions,
    });
    onCancel();
  };

  const handleBackClick = () => {
    analytics.track('tool_question_back', {
      tool_name: toolTitle,
      step_index: currentStepIndex + 1,
    });
    onBack();
  };

  return (
    <div className="max-w-[640px] mx-auto px-4 py-6 sm:py-8 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex items-center justify-between gap-4 mb-5">
        <button
          onClick={currentStepIndex === 0 ? handleCancelClick : handleBackClick}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted hover:text-foreground py-1.5 px-3.5 rounded-full bg-white border border-slate-200 shadow-soft hover:bg-slate-50 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{currentStepIndex === 0 ? 'Batal' : 'Kembali'}</span>
        </button>

        <div className="text-right">
          <span className="text-[11px] font-bold uppercase tracking-wider text-teal-brand block">
            {toolTitle}
          </span>
          <span className="text-xs font-medium text-muted">
            Pertanyaan {currentStepIndex + 1} dari {totalQuestions}
          </span>
        </div>
      </div>

      {/* Modern Progress Bar */}
      <div className="mb-6 sm:mb-8">
        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200/60">
          <div
            className="h-full bg-gradient-to-r from-teal-brand to-emerald-500 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white border border-slate-200/90 rounded-card-lg p-6 sm:p-8 shadow-card mb-6">
        <h3 className="text-lg sm:text-xl font-bold text-foreground tracking-tight leading-snug">
          {currentQ.title}
        </h3>
        {currentQ.subtitle && (
          <p className="text-xs sm:text-sm text-muted mt-2 leading-relaxed">
            {currentQ.subtitle}
          </p>
        )}

        {/* Options List */}
        <div className="mt-6 space-y-2.5">
          {currentQ.options.map((opt) => {
            const isSelected = selectedValue === opt.value;
            const isJustClicked = animatingValue === opt.value;

            return (
              <button
                key={opt.value}
                onClick={() => handleChoose(opt.value)}
                className={`w-full text-left p-4 rounded-card border transition-all flex items-center justify-between group active:scale-[0.99] ${
                  isSelected || isJustClicked
                    ? 'border-teal-brand bg-teal-brand/5 shadow-soft ring-2 ring-teal-brand/20'
                    : 'border-slate-200 bg-white hover:border-teal-brand/40 hover:bg-slate-50/60 shadow-soft'
                }`}
              >
                <div className="flex items-center gap-3.5 pr-2">
                  {opt.icon && (
                    <span className="text-2xl p-2 rounded-xl bg-slate-50 border border-slate-100 shrink-0">
                      {opt.icon}
                    </span>
                  )}
                  <div>
                    <div className="text-xs sm:text-sm font-semibold text-foreground group-hover:text-teal-brand transition-colors">
                      {opt.label}
                    </div>
                    {opt.description && (
                      <div className="text-[11px] text-muted mt-0.5 leading-relaxed">
                        {opt.description}
                      </div>
                    )}
                  </div>
                </div>

                <div
                  className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                    isSelected || isJustClicked
                      ? 'border-teal-brand bg-teal-brand text-white'
                      : 'border-slate-300 group-hover:border-teal-brand/50'
                  }`}
                >
                  {(isSelected || isJustClicked) && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex items-center justify-center gap-1.5 text-[11px] text-muted">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
        <span>Data digunakan hanya untuk kalkulasi mandiri di browser perangkatmu.</span>
      </div>
    </div>
  );
};
