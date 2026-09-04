import React from 'react';
import { RotateCcw } from 'lucide-react';
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
    <header className="sticky top-0 z-40 bg-background/90 backdrop-blur-md border-b border-border transition-all duration-200">
      <div className="max-w-[760px] mx-auto px-3.5 sm:px-4 h-15 sm:h-16 flex items-center justify-between">
        {/* Brand & Avatar */}
        <button 
          onClick={() => onNavigate('home')} 
          className="flex items-center gap-2 sm:gap-2.5 text-left group"
        >
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-teal-brand/30 p-0.5 bg-card shadow-soft overflow-hidden shrink-0 group-hover:scale-105 transition-transform">
            <img
              src="/foto-robert.png"
              alt="Robertus Agung Pradana"
              className="w-full h-full object-cover object-[center_12%]"
            />
          </div>
          <div>
            <div className="text-xs sm:text-sm font-bold tracking-tight text-foreground flex items-center gap-1 sm:gap-1.5">
              <span>Robertus Agung Pradana</span>
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-sage shrink-0"></span>
            </div>
            <div className="text-[10px] sm:text-[11px] text-muted font-medium line-clamp-1">
              Data • Health • Financial Readiness
            </div>
          </div>
        </button>

        {/* Action Buttons */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          <button
            onClick={() => onNavigate('tools')}
            className={`text-[11px] sm:text-xs font-semibold px-2.5 sm:px-3 py-1.5 rounded-full transition-colors ${
              currentView === 'tools' 
                ? 'bg-teal-brand text-white' 
                : 'text-muted hover:text-foreground hover:bg-section'
            }`}
          >
            Tools
          </button>
          
          <button
            onClick={() => onNavigate('about')}
            className={`text-[11px] sm:text-xs font-semibold px-2.5 sm:px-3 py-1.5 rounded-full transition-colors ${
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
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};
