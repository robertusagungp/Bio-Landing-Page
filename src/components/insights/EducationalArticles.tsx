import React, { useState } from 'react';
import { EDUCATIONAL_ARTICLES, EducationalArticle } from '../../data/educationalInsights';
import { BookOpen, Clock, ArrowRight, X, Sparkles } from 'lucide-react';

export const EducationalArticles: React.FC = () => {
  const [selectedArticle, setSelectedArticle] = useState<EducationalArticle | null>(null);

  return (
    <section className="py-10 px-4 max-w-[760px] mx-auto">
      <div className="mb-6 text-center sm:text-left">
        <span className="text-[11px] font-bold text-teal-brand uppercase tracking-wider block mb-1">
          Literasi & Sudut Pandang
        </span>
        <h3 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight-heading">
          Insight Singkat Seputar Kesehatan & Risiko
        </h3>
        <p className="text-xs sm:text-sm text-muted mt-1 leading-relaxed">
          Ulasan ringkas berbasis logika kuantitatif untuk membantumu melihat risiko harian secara lebih jernih.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {EDUCATIONAL_ARTICLES.map((art) => (
          <button
            key={art.id}
            onClick={() => setSelectedArticle(art)}
            className="text-left p-5 rounded-card bg-card hover:bg-white border border-border/80 shadow-soft hover:shadow-card hover:border-teal-brand/30 transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-brand bg-teal-brand/10 px-2.5 py-0.5 rounded-full">
                  {art.category}
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] text-muted">
                  <Clock className="w-3 h-3 text-teal-brand" />
                  {art.readTime}
                </span>
              </div>
              <h4 className="font-bold text-sm text-foreground group-hover:text-teal-brand transition-colors leading-snug">
                {art.title}
              </h4>
              <p className="text-xs text-muted leading-relaxed mt-2 line-clamp-2">
                {art.summary}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-border/50 flex items-center justify-between text-xs font-semibold text-teal-brand">
              <span>Baca Ulasan Singkat</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>
        ))}
      </div>

      {/* Article Reader Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 bg-foreground/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-card border border-border max-w-lg w-full max-h-[85vh] rounded-card-lg shadow-elevated overflow-y-auto p-6 sm:p-8">
            <div className="flex items-center justify-between pb-3 border-b border-border/80 mb-4 sticky top-0 bg-card z-10">
              <span className="text-[10px] font-bold uppercase tracking-wider text-teal-brand bg-teal-brand/10 px-2.5 py-0.5 rounded-full">
                {selectedArticle.category} • {selectedArticle.readTime}
              </span>
              <button
                onClick={() => setSelectedArticle(null)}
                className="p-1 rounded-full text-muted hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <h3 className="text-lg sm:text-xl font-bold text-foreground tracking-tight-heading leading-snug mb-3">
              {selectedArticle.title}
            </h3>

            {/* Key Takeaway Callout */}
            <div className="p-3.5 rounded-card bg-teal-brand/10 border border-teal-brand/20 text-xs text-teal-brand font-semibold mb-5 flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-teal-brand shrink-0 mt-0.5" />
              <span>{selectedArticle.keyTakeaway}</span>
            </div>

            {/* Article Content Paragraphs */}
            <div className="space-y-3.5 text-xs sm:text-sm text-foreground/90 leading-relaxed">
              {selectedArticle.content.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>

            <div className="mt-8 pt-4 border-t border-border flex justify-end">
              <button
                onClick={() => setSelectedArticle(null)}
                className="bg-section hover:bg-border text-foreground font-semibold text-xs py-2 px-5 rounded-btn transition-colors"
              >
                Tutup Artikel
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
