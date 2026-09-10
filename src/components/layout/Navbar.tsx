import React from 'react';
import { MessageCircle } from 'lucide-react';
import { getWhatsAppLink } from '../../utils/formatters';

interface NavbarProps {
  onNavigate: (view: 'home' | 'tools' | 'about') => void;
  currentView: string;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigate, currentView }) => {
  const waUrl = getWhatsAppLink('default');

  return (
    <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-md border-b border-slate-200/70 transition-all duration-200">
      <div className="max-w-[720px] mx-auto px-4 h-15 flex items-center justify-between">
        {/* Brand & Avatar */}
        <button 
          onClick={() => onNavigate('home')} 
          className="flex items-center gap-3 text-left group"
        >
          <div className="relative">
            <div className="w-9 h-9 rounded-full ring-2 ring-teal-brand/20 overflow-hidden shrink-0 group-hover:scale-105 transition-transform bg-slate-100 shadow-sm">
              <img
                src="/foto-robert.png"
                alt="Robertus Agung Pradana"
                className="w-full h-full object-cover object-[center_16%]"
              />
            </div>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full"></span>
          </div>
          <div>
            <div className="text-sm font-bold tracking-tight text-foreground group-hover:text-teal-brand transition-colors">
              Robertus Agung Pradana
            </div>
            <div className="text-[11px] font-medium text-muted">
              Personal Readiness Hub
            </div>
          </div>
        </button>

        {/* Minimal Navigation & Direct WhatsApp */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={() => onNavigate('home')}
            className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-all ${
              currentView === 'home' 
                ? 'bg-teal-brand text-white shadow-soft' 
                : 'text-muted hover:text-foreground hover:bg-slate-100'
            }`}
          >
            Beranda
          </button>

          <button
            onClick={() => onNavigate('tools')}
            className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-all ${
              currentView === 'tools' 
                ? 'bg-teal-brand text-white shadow-soft' 
                : 'text-muted hover:text-foreground hover:bg-slate-100'
            }`}
          >
            Semua Tools
          </button>
          
          <button
            onClick={() => onNavigate('about')}
            className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-all ${
              currentView === 'about' 
                ? 'bg-teal-brand text-white shadow-soft' 
                : 'text-muted hover:text-foreground hover:bg-slate-100'
            }`}
          >
            Tentang
          </button>

          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="Chat via WhatsApp"
            className="ml-1 p-1.5 text-emerald-600 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/60 rounded-full transition-all"
          >
            <MessageCircle className="w-4 h-4 fill-emerald-500/20" />
          </a>
        </div>
      </div>
    </header>
  );
};
