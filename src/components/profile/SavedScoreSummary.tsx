import React from 'react';
import { StoredResults, ActiveToolId } from '../../types/profile';
import { BarChart3, CheckCircle2, ArrowRight } from 'lucide-react';

interface SavedScoreSummaryProps {
  results: StoredResults;
  onSelectTool: (toolId: ActiveToolId) => void;
}

export const SavedScoreSummary: React.FC<SavedScoreSummaryProps> = ({
  results,
  onSelectTool,
}) => {
  const completedItems = [];

  if (results.lifeReadiness) {
    completedItems.push({
      id: 'life-readiness' as ActiveToolId,
      title: 'Life Readiness',
      value: `${results.lifeReadiness.overallScore}/100`,
      desc: results.lifeReadiness.subtitle,
    });
  }
  if (results.financialHealth) {
    completedItems.push({
      id: 'financial-health' as ActiveToolId,
      title: 'Financial Health',
      value: `${results.financialHealth.overallScore}/100`,
      desc: results.financialHealth.profileLabel,
    });
  }
  if (results.lifestyleAge) {
    completedItems.push({
      id: 'lifestyle-age' as ActiveToolId,
      title: 'Lifestyle Age',
      value: `${results.lifestyleAge.lifestyleAge} thn`,
      desc: `Usia kebiasaan (${results.lifestyleAge.differenceYears > 0 ? `+${results.lifestyleAge.differenceYears}` : results.lifestyleAge.differenceYears} thn)`,
    });
  }
  if (results.emergencyRunway) {
    completedItems.push({
      id: 'emergency-checker' as ActiveToolId,
      title: 'Emergency Runway',
      value: `${results.emergencyRunway.runwayMonths} bln`,
      desc: results.emergencyRunway.statusLabel,
    });
  }
  if (results.familyReadiness) {
    completedItems.push({
      id: 'family-readiness' as ActiveToolId,
      title: 'Family Readiness',
      value: `${results.familyReadiness.overallScore}/100`,
      desc: results.familyReadiness.categoryLabelId,
    });
  }
  if (results.wellness) {
    completedItems.push({
      id: 'wellness-score' as ActiveToolId,
      title: 'Wellness Score',
      value: `${results.wellness.overallScore}/100`,
      desc: results.wellness.categoryLabelId,
    });
  }

  if (completedItems.length === 0) return null;

  return (
    <section className="py-6 px-4 max-w-[760px] mx-auto">
      <div className="bg-white border-2 border-teal-brand/20 rounded-card-lg p-5 sm:p-6 shadow-card">
        <div className="flex items-center justify-between pb-3 border-b border-border/70 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-teal-brand/10 text-teal-brand flex items-center justify-center">
              <BarChart3 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-foreground">
                Ringkasan Skor Evaluasi Tersimpan
              </h3>
              <p className="text-[11px] text-muted">Tersimpan aman di perangkat ini</p>
            </div>
          </div>
          <span className="text-[11px] font-bold text-teal-brand bg-teal-brand/10 px-2 py-0.5 rounded-full">
            {completedItems.length} Selesai
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {completedItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onSelectTool(item.id)}
              className="p-3 rounded-xl bg-section/60 hover:bg-section border border-border/70 text-left flex items-center justify-between group transition-colors"
            >
              <div>
                <span className="text-xs font-bold text-foreground group-hover:text-teal-brand transition-colors block">
                  {item.title}
                </span>
                <span className="text-[11px] text-muted line-clamp-1">
                  {item.desc}
                </span>
              </div>
              <div className="flex items-center gap-1.5 shrink-0 pl-2">
                <span className="text-xs font-extrabold text-teal-brand">
                  {item.value}
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-muted group-hover:translate-x-0.5 transition-transform" />
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
