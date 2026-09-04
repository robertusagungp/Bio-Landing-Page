import React from 'react';
import { getScoreCategory } from '../../utils/formatters';

interface ScoreBarProps {
  label: string;
  score: number;
  maxScore?: number;
  subtext?: string;
}

export const ScoreBar: React.FC<ScoreBarProps> = ({
  label,
  score,
  maxScore = 100,
  subtext,
}) => {
  const percentage = Math.min(100, Math.max(0, (score / maxScore) * 100));
  const meta = getScoreCategory(score);

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="font-semibold text-foreground">{label}</span>
        <div className="flex items-center gap-1.5">
          <span className="font-bold text-foreground">{score}</span>
          <span className="text-[10px] text-muted">/ {maxScore}</span>
        </div>
      </div>

      <div className="h-2 w-full bg-section rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{
            width: `${percentage}%`,
            backgroundColor: meta.pillColor,
          }}
        />
      </div>

      {subtext && (
        <p className="text-[10px] text-muted leading-tight">{subtext}</p>
      )}
    </div>
  );
};
