import React from 'react';
import { Sparkles, RotateCcw } from 'lucide-react';
import { resetUserData } from '../../utils/storage';

interface NavbarProps {
  onNavigate: (view: 'home' | 'tools' | 'score' | 'about') => void;
  currentView: string;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigate, currentView }) => {
  const handleReset = () => {
    if (window.confirm('Reset semua data assessment yang tersimpan di browser ini?')) {
      resetUserData();
      window.location.reload();
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-background/85 backdrop-blur-md border-b border-border transition-all duration-200">
      <div className="max-w-[760px] mx-auto px-4 h-16 flex items-center justify-between">
        <button 
          onClick={() => onNavigate('home')} 
          className="flex items-center gap-2.5 text-left group"
        >
          <div className="w-9 h-9 rounded-full bg-teal-brand text-background flex items-center justify-center font-bold text-sm shadow-soft group-hover:scale-105 transition-transform">
            RP
          </div>
          <div>
            <div className="text-sm font-bold tracking-tight text-foreground flex items-center gap-1.5">
              Robertus Agung Pradana
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-sage"></span>
            </div>
            <div className="text-[11px] text-muted font-medium">
              Data • Health • Financial Readiness
            </div>
          </div>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('tools')}
            className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-colors ${
              currentView === 'tools' 
                ? 'bg-teal-brand text-white' 
                : 'text-muted hover:text-foreground hover:bg-section'
            }`}
          >
            Free Tools
          </button>
          
          <button
            onClick={() => onNavigate('about')}
            className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-colors ${
              currentView === 'about' 
                ? 'bg-teal-brand text-white' 
                : 'text-muted hover:text-foreground hover:bg-section'
            }`}
          >
            Tentang
          </button>

          <button
            onClick={handleReset}
            title="Reset Data Tersimpan"
            aria-label="Reset Data Tersimpan"
            className="p-1.5 text-muted hover:text-terracotta hover:bg-terracotta/10 rounded-full transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
