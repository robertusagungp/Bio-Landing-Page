import React from 'react';
import { Award, BookOpen, Activity, BarChart3 } from 'lucide-react';

export const TrustChips: React.FC = () => {
  const chips = [
    { label: 'Head of Data Science', icon: BarChart3 },
    { label: 'Mathematics – Universitas Indonesia', icon: BookOpen },
    { label: 'Actuarial Studies A10 • A20 • A50', icon: Award },
    { label: 'Data & Quantitative Risk', icon: Activity },
  ];

  return (
    <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
      {chips.map((c, i) => {
        const Icon = c.icon;
        return (
          <div
            key={i}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-section border border-border text-foreground/85 text-[11px] font-medium tracking-tight shadow-soft hover:bg-card transition-colors"
          >
            <Icon className="w-3.5 h-3.5 text-teal-brand" />
            <span>{c.label}</span>
          </div>
        );
      })}
    </div>
  );
};
