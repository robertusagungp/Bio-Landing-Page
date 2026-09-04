import React from 'react';

interface NavbarProps {
  onNavigate: (view: 'home' | 'tools' | 'about') => void;
  currentView: string;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigate, currentView }) => {
  return (
    <header className="sticky top-0 z-40 bg-background/90 backdrop-blur-md border-b border-border/80 transition-all duration-200">
      <div className="max-w-[680px] mx-auto px-4 h-14 flex items-center justify-between">
        {/* Brand & Avatar */}
        <button 
          onClick={() => onNavigate('home')} 
          className="flex items-center gap-2.5 text-left group"
        >
          <div className="w-8 h-8 rounded-full border border-teal-brand/30 overflow-hidden shrink-0 group-hover:scale-105 transition-transform bg-card">
            <img
              src="/foto-robert.png"
              alt="Robertus Agung Pradana"
              className="w-full h-full object-cover object-[center_12%]"
            />
          </div>
          <div>
            <div className="text-xs sm:text-sm font-bold tracking-tight text-foreground group-hover:text-teal-brand transition-colors">
              Robertus Agung Pradana
            </div>
          </div>
        </button>

        {/* Minimal Navigation Links */}
        <div className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => onNavigate('tools')}
            className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-colors ${
              currentView === 'tools' 
                ? 'bg-teal-brand text-white' 
                : 'text-muted hover:text-foreground hover:bg-section'
            }`}
          >
            Tools
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
        </div>
      </div>
    </header>
  );
};
