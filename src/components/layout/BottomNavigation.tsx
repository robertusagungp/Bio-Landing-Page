import React from 'react';
import { Home, Compass, BarChart2, User } from 'lucide-react';

interface BottomNavigationProps {
  currentView: string;
  onNavigate: (view: 'home' | 'tools' | 'score' | 'about') => void;
  hasScore: boolean;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  currentView,
  onNavigate,
  hasScore,
}) => {
  return (
    <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-lg border-t border-border px-2 py-1 pb-[max(0.35rem,env(safe-area-inset-bottom))] shadow-card">
      <div className="flex items-center justify-around max-w-md mx-auto">
        <button
          onClick={() => onNavigate('home')}
          className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-all ${
            currentView === 'home' ? 'text-teal-brand font-bold' : 'text-muted hover:text-foreground'
          }`}
        >
          <Home className="w-4 h-4" />
          <span className="text-[10px]">Home</span>
        </button>

        <button
          onClick={() => onNavigate('tools')}
          className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-all ${
            currentView === 'tools' ? 'text-teal-brand font-bold' : 'text-muted hover:text-foreground'
          }`}
        >
          <Compass className="w-4 h-4" />
          <span className="text-[10px]">Tools</span>
        </button>

        {hasScore && (
          <button
            onClick={() => onNavigate('score')}
            className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-all relative ${
              currentView === 'score' ? 'text-teal-brand font-bold' : 'text-muted hover:text-foreground'
            }`}
          >
            <BarChart2 className="w-4 h-4" />
            <span className="text-[10px]">My Score</span>
            <span className="absolute top-1 right-2 w-1.5 h-1.5 rounded-full bg-terracotta animate-pulse"></span>
          </button>
        )}

        <button
          onClick={() => onNavigate('about')}
          className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-all ${
            currentView === 'about' ? 'text-teal-brand font-bold' : 'text-muted hover:text-foreground'
          }`}
        >
          <User className="w-4 h-4" />
          <span className="text-[10px]">About</span>
        </button>
      </div>
    </nav>
  );
};
