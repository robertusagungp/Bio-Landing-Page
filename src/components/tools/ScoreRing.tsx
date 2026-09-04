import React, { useEffect, useState } from 'react';
import { getScoreCategory } from '../../utils/formatters';

interface ScoreRingProps {
  score: number;
  maxScore?: number;
  size?: number;
  label?: string;
  sublabel?: string;
}

export const ScoreRing: React.FC<ScoreRingProps> = ({
  score,
  maxScore = 100,
  size = 150,
  label = 'Score',
  sublabel,
}) => {
  const [displayScore, setDisplayScore] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 600;
    const stepTime = 16;
    const totalSteps = duration / stepTime;
    const increment = score / totalSteps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= score) {
        setDisplayScore(score);
        clearInterval(timer);
      } else {
        setDisplayScore(Math.round(start));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [score]);

  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(1, Math.max(0, displayScore / maxScore));
  const strokeDashoffset = circumference - progress * circumference;

  const meta = getScoreCategory(score);

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#EDF1EB"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={meta.pillColor}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-300 ease-out"
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            {displayScore}
          </span>
          <span className="text-[11px] font-semibold text-muted -mt-0.5">
            dari {maxScore}
          </span>
        </div>
      </div>

      <div className="mt-3 text-center">
        <span
          className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${meta.bgClass} ${meta.colorClass} border ${meta.borderClass}`}
        >
          {meta.labelId}
        </span>
        {sublabel && (
          <p className="text-[11px] text-muted mt-1 font-medium">{sublabel}</p>
        )}
      </div>
    </div>
  );
};
