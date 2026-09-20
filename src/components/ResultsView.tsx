import React, { useState } from 'react';
import {
  Award,
  CheckCircle2,
  XCircle,
  HelpCircle,
  RotateCcw,
  Play,
  PlusCircle,
  ListFilter,
  Check,
  X,
} from 'lucide-react';
import { Flashcard } from '../types';

interface ResultsViewProps {
  topic: string;
  cards: Flashcard[];
  onReviewAgain: () => void;
  onRestart: () => void;
  onCreateNewSet: () => void;
}

export const ResultsView: React.FC<ResultsViewProps> = ({
  topic,
  cards,
  onReviewAgain,
  onRestart,
  onCreateNewSet,
}) => {
  const [filter, setFilter] = useState<'all' | 'known' | 'unknown' | 'unreviewed'>('all');

  const total = cards.length;
  const knownCount = cards.filter((c) => c.status === 'known').length;
  const unknownCount = cards.filter((c) => c.status === 'unknown').length;
  const unreviewedCount = cards.filter((c) => c.status === 'unreviewed').length;

  const scorePercentage = total > 0 ? Math.round((knownCount / total) * 100) : 0;

  const filteredCards = cards.filter((c) => {
    if (filter === 'all') return true;
    return c.status === filter;
  });

  return (
    <div id="results-screen" className="space-y-8 animate-in fade-in duration-200">
      {/* Celebration & Summary Header */}
      <div
        id="results-summary-card"
        className="text-center p-8 bg-white rounded-3xl border border-slate-200 shadow-md relative overflow-hidden"
      >
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 mb-4 shadow-xs">
          <Award className="h-8 w-8" />
        </div>

        <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-slate-100 text-slate-700 mb-2">
          Study Session Complete
        </span>

        <h2 id="results-topic-title" className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          {topic}
        </h2>

        <div className="mt-6 flex flex-col items-center justify-center">
          <div className="text-5xl sm:text-6xl font-black text-indigo-600 tracking-tight">
            {scorePercentage}%
          </div>
          <p className="text-sm font-semibold text-slate-500 mt-1">
            Mastery Score ({knownCount} of {total} terms mastered)
          </p>
        </div>

        {/* 3 Status Metric Boxes */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-xl mx-auto">
          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100 text-center">
            <div className="flex items-center justify-center gap-1.5 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Known</span>
            </div>
            <div className="text-2xl font-black text-emerald-700">{knownCount}</div>
            <div className="text-2xs text-emerald-600 font-medium">
              {total > 0 ? Math.round((knownCount / total) * 100) : 0}% of set
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-100 text-center">
            <div className="flex items-center justify-center gap-1.5 text-rose-800 text-xs font-bold uppercase tracking-wider mb-1">
              <XCircle className="w-4 h-4 text-rose-600" />
              <span>Don't Know</span>
            </div>
            <div className="text-2xl font-black text-rose-700">{unknownCount}</div>
            <div className="text-2xs text-rose-600 font-medium">
              {total > 0 ? Math.round((unknownCount / total) * 100) : 0}% of set
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center">
            <div className="flex items-center justify-center gap-1.5 text-slate-600 text-xs font-bold uppercase tracking-wider mb-1">
              <HelpCircle className="w-4 h-4 text-slate-400" />
              <span>Unreviewed</span>
            </div>
            <div className="text-2xl font-black text-slate-700">{unreviewedCount}</div>
            <div className="text-2xs text-slate-500 font-medium">
              {total > 0 ? Math.round((unreviewedCount / total) * 100) : 0}% of set
            </div>
          </div>
        </div>

        {/* Primary Action Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            id="review-again-btn"
            onClick={onReviewAgain}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-xl shadow-xs transition-all cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Review Again</span>
          </button>

          <button
            type="button"
            id="restart-session-btn"
            onClick={onRestart}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 rounded-xl transition-all cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-slate-400"
          >
            <Play className="w-4 h-4" />
            <span>Restart</span>
          </button>

          <button
            type="button"
            id="create-new-set-btn"
            onClick={onCreateNewSet}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-bold text-indigo-700 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 active:bg-indigo-200 border border-indigo-200 rounded-xl transition-all cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create New Set</span>
          </button>
        </div>
      </div>

      {/* Review List Breakdown */}
      <section
        id="term-breakdown-section"
        aria-labelledby="breakdown-heading"
        className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h3 id="breakdown-heading" className="text-base font-bold text-slate-900 flex items-center gap-2">
              <ListFilter className="w-4 h-4 text-indigo-600" />
              <span>Flashcard Breakdown</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                {cards.length} Total
              </span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Review individual answers and definitions below
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl text-xs font-semibold">
            <button
              type="button"
              id="filter-all-btn"
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                filter === 'all'
                  ? 'bg-white text-slate-900 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All ({cards.length})
            </button>
            <button
              type="button"
              id="filter-known-btn"
              onClick={() => setFilter('known')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                filter === 'known'
                  ? 'bg-emerald-600 text-white shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-emerald-700'
              }`}
            >
              Known ({knownCount})
            </button>
            <button
              type="button"
              id="filter-unknown-btn"
              onClick={() => setFilter('unknown')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                filter === 'unknown'
                  ? 'bg-rose-600 text-white shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-rose-700'
              }`}
            >
              Don't Know ({unknownCount})
            </button>
            {unreviewedCount > 0 && (
              <button
                type="button"
                id="filter-unreviewed-btn"
                onClick={() => setFilter('unreviewed')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  filter === 'unreviewed'
                    ? 'bg-slate-700 text-white shadow-2xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Unreviewed ({unreviewedCount})
              </button>
            )}
          </div>
        </div>

        {/* Card Items */}
        <div className="divide-y divide-slate-100 mt-2">
          {filteredCards.length === 0 ? (
            <div className="py-8 text-center text-sm text-slate-400">
              No cards found for this filter.
            </div>
          ) : (
            filteredCards.map((card, idx) => (
              <div
                key={card.id}
                id={`results-card-item-${idx + 1}`}
                className="py-4 flex flex-col sm:flex-row sm:items-start justify-between gap-4"
              >
                <div className="space-y-1 sm:max-w-md lg:max-w-xl">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-slate-400">#{idx + 1}</span>
                    <h4 className="text-base font-bold text-slate-900">{card.term}</h4>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed pl-5 border-l-2 border-slate-200">
                    {card.definition}
                  </p>
                </div>

                <div className="flex-shrink-0">
                  {card.status === 'known' ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <Check className="w-3.5 h-3.5" />
                      <span>Known</span>
                    </span>
                  ) : card.status === 'unknown' ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
                      <X className="w-3.5 h-3.5" />
                      <span>Don't Know</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200">
                      <HelpCircle className="w-3.5 h-3.5" />
                      <span>Not Reviewed</span>
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
};
