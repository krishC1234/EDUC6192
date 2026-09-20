import React, { useState } from 'react';
import { BookOpen, ChevronDown, ChevronUp, CheckCircle2 } from 'lucide-react';

export const InstructionBanner: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(true);

  const steps = [
    { num: 1, text: 'Enter a topic.' },
    { num: 2, text: 'Add the terms you want to study.' },
    { num: 3, text: 'Click Create Flashcards.' },
    { num: 4, text: 'Flip each card to see its definition.' },
    { num: 5, text: 'Mark each term Known or Don\'t Know.' },
    { num: 6, text: 'Use Previous/Next to navigate and track progress.' },
  ];

  return (
    <section
      id="user-instructions-banner"
      aria-labelledby="instructions-heading"
      className="mb-8 rounded-2xl border border-indigo-100 bg-linear-to-r from-indigo-50/80 via-white to-sky-50/60 p-5 shadow-xs transition-all"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-xs">
            <BookOpen className="h-5 w-5" />
          </div>
          <div>
            <h2
              id="instructions-heading"
              className="text-base font-bold text-slate-900"
            >
              How to Study with Flashcards
            </h2>
            <p className="text-xs text-slate-500">
              Simple 6-step study workflow designed for effective active recall
            </p>
          </div>
        </div>

        <button
          type="button"
          id="toggle-instructions-btn"
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-white hover:text-slate-900 border border-transparent hover:border-slate-200 transition-all focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
          aria-expanded={isExpanded}
          aria-controls="instructions-step-list"
        >
          <span>{isExpanded ? 'Hide Steps' : 'View Steps'}</span>
          {isExpanded ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>
      </div>

      {isExpanded && (
        <div id="instructions-step-list" className="mt-4 pt-4 border-t border-indigo-100/60">
          <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {steps.map((step) => (
              <li
                key={step.num}
                className="flex items-start gap-2.5 rounded-xl bg-white/80 p-3 border border-indigo-50/80 shadow-2xs"
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700">
                  {step.num}
                </span>
                <span className="text-xs font-medium text-slate-700 leading-snug">
                  {step.text}
                </span>
              </li>
            ))}
          </ol>
        </div>
      )}
    </section>
  );
};
