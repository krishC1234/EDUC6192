import React, { useState, useEffect } from 'react';
import {
  RotateCw,
  Check,
  X,
  ChevronLeft,
  ChevronRight,
  Award,
  Layers,
  HelpCircle,
  Sparkles,
  Info,
} from 'lucide-react';
import { Flashcard, ModalState } from '../types';

interface ReviewViewProps {
  topic: string;
  cards: Flashcard[];
  onUpdateCardStatus: (cardId: string, status: 'known' | 'unknown') => void;
  onFinishReview: () => void;
  onRestart: () => void;
  onCreateNewSet: () => void;
  onErrorModal: (modal: ModalState) => void;
}

export const ReviewView: React.FC<ReviewViewProps> = ({
  topic,
  cards,
  onUpdateCardStatus,
  onFinishReview,
  onRestart,
  onCreateNewSet,
  onErrorModal,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [cardFlipHistory, setCardFlipHistory] = useState<Record<string, boolean>>({});

  const currentCard = cards[currentIndex] || cards[0];
  const totalCards = cards.length;

  // Calculate metrics
  const knownCount = cards.filter((c) => c.status === 'known').length;
  const unknownCount = cards.filter((c) => c.status === 'unknown').length;
  const unreviewedCount = cards.filter((c) => c.status === 'unreviewed').length;

  const knownPercent = totalCards > 0 ? (knownCount / totalCards) * 100 : 0;
  const unknownPercent = totalCards > 0 ? (unknownCount / totalCards) * 100 : 0;
  const unreviewedPercent = totalCards > 0 ? (unreviewedCount / totalCards) * 100 : 0;

  // Track if current card was flipped at least once
  const hasCurrentCardFlipped = !!cardFlipHistory[currentCard?.id] || currentCard?.hasFlipped;

  // Reset local visual flip state when card changes
  useEffect(() => {
    setIsFlipped(false);
  }, [currentIndex]);

  const handleFlipCard = () => {
    const nextFlipped = !isFlipped;
    setIsFlipped(nextFlipped);
    if (nextFlipped && currentCard) {
      setCardFlipHistory((prev) => ({ ...prev, [currentCard.id]: true }));
    }
  };

  const handleMarkStatus = (status: 'known' | 'unknown') => {
    if (!hasCurrentCardFlipped && !isFlipped) {
      onErrorModal({
        isOpen: true,
        title: 'Action Not Available',
        message: 'Please flip the card to see its definition before marking it as Known or Don\'t Know.',
        solutionHint:
          'Click the card, press the "Flip Card" button, or hit Spacebar to reveal the definition first.',
        type: 'warning',
        confirmText: 'Got It',
      });
      return;
    }

    onUpdateCardStatus(currentCard.id, status);

    // If not on the last card, auto-advance to next card after a brief moment
    if (currentIndex < totalCards - 1) {
      setTimeout(() => {
        setCurrentIndex((prev) => prev + 1);
      }, 150);
    } else {
      // If on the last card and all are now reviewed, offer to finish
      const pendingCount = cards.filter(
        (c) => c.id !== currentCard.id && c.status === 'unreviewed'
      ).length;
      if (pendingCount === 0) {
        setTimeout(() => {
          onFinishReview();
        }, 300);
      }
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    } else {
      onErrorModal({
        isOpen: true,
        title: 'Action Not Available',
        message: 'You are already on the first flashcard in this set.',
        solutionHint:
          'Use the "Next" button or Right Arrow key (→) to proceed forward through your cards.',
        type: 'warning',
        confirmText: 'Got It',
      });
    }
  };

  const handleNext = () => {
    if (currentIndex < totalCards - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      onErrorModal({
        isOpen: true,
        title: 'Action Not Available',
        message: 'You have reached the last flashcard in this set.',
        solutionHint:
          'You can review previous cards using "Previous", restart the session, or click "Finish & View Results".',
        type: 'warning',
        confirmText: 'Got It',
      });
    }
  };

  const handleAttemptFinish = () => {
    if (unreviewedCount > 0) {
      onErrorModal({
        isOpen: true,
        title: 'Unreviewed Flashcards',
        message: `You still have ${unreviewedCount} unreviewed ${
          unreviewedCount === 1 ? 'card' : 'cards'
        }. Do you want to finish anyway and view your current score?`,
        solutionHint:
          'Click "Continue Reviewing" to test your recall on every card, or "Finish Anyway" to see your results right now.',
        type: 'confirm',
        confirmText: 'Finish Anyway',
        cancelText: 'Continue Reviewing',
        onConfirm: onFinishReview,
      });
    } else {
      onFinishReview();
    }
  };

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is interacting with an input or if modal is open
      if (
        ['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName) ||
        document.getElementById('modal-backdrop')
      ) {
        return;
      }

      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        handleFlipCard();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        if (currentIndex > 0) setCurrentIndex((prev) => prev - 1);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        if (currentIndex < totalCards - 1) setCurrentIndex((prev) => prev + 1);
      } else if (e.key.toLowerCase() === 'k' || e.key === '1') {
        e.preventDefault();
        handleMarkStatus('known');
      } else if (e.key.toLowerCase() === 'd' || e.key === '2') {
        e.preventDefault();
        handleMarkStatus('unknown');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, isFlipped, hasCurrentCardFlipped, totalCards, currentCard]);

  return (
    <div id="review-screen" className="space-y-6">
      {/* Top Header & Navigation Bar */}
      <div
        id="review-header"
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-white rounded-2xl border border-slate-200 shadow-xs"
      >
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 rounded-md border border-indigo-100">
              Active Topic
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs font-semibold text-slate-600">
              Card {currentIndex + 1} of {totalCards}
            </span>
          </div>
          <h2
            id="review-topic-title"
            className="text-xl font-bold text-slate-900 mt-1"
          >
            {topic}
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            id="restart-set-header-btn"
            onClick={onRestart}
            className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
            title="Restart card order from card #1"
          >
            Restart
          </button>
          <button
            type="button"
            id="create-new-set-header-btn"
            onClick={onCreateNewSet}
            className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-indigo-600 bg-slate-100 hover:bg-indigo-50 border border-transparent hover:border-indigo-200 rounded-lg transition-colors cursor-pointer"
            title="Edit topic or create new cards"
          >
            Create New Set
          </button>
          <button
            type="button"
            id="finish-review-header-btn"
            onClick={handleAttemptFinish}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors cursor-pointer"
          >
            <Award className="w-3.5 h-3.5" />
            <span>View Results</span>
          </button>
        </div>
      </div>

      {/* Progress Breakdown Bar */}
      <section
        id="study-progress-tracker"
        aria-label="Study progress breakdown"
        className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs"
      >
        <div className="flex items-center justify-between text-xs font-semibold mb-2">
          <span className="text-slate-700">Study Progress</span>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-emerald-700">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              Known: <strong>{knownCount}</strong>
            </span>
            <span className="flex items-center gap-1.5 text-rose-700">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
              Don't Know: <strong>{unknownCount}</strong>
            </span>
            <span className="flex items-center gap-1.5 text-slate-500">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-300"></span>
              Not Reviewed: <strong>{unreviewedCount}</strong>
            </span>
          </div>
        </div>

        {/* Multi-segment progress bar */}
        <div
          className="h-3 w-full rounded-full bg-slate-100 overflow-hidden flex"
          role="progressbar"
          aria-valuenow={knownCount + unknownCount}
          aria-valuemin={0}
          aria-valuemax={totalCards}
          aria-label={`${knownCount} known, ${unknownCount} don't know, ${unreviewedCount} unreviewed`}
        >
          <div
            style={{ width: `${knownPercent}%` }}
            className="h-full bg-emerald-500 transition-all duration-300"
            title={`Known: ${knownCount} (${Math.round(knownPercent)}%)`}
          />
          <div
            style={{ width: `${unknownPercent}%` }}
            className="h-full bg-rose-500 transition-all duration-300"
            title={`Don't Know: ${unknownCount} (${Math.round(unknownPercent)}%)`}
          />
          <div
            style={{ width: `${unreviewedPercent}%` }}
            className="h-full bg-slate-200 transition-all duration-300"
            title={`Not Reviewed: ${unreviewedCount} (${Math.round(unreviewedPercent)}%)`}
          />
        </div>
      </section>

      {/* 3D Flashcard Stage */}
      <div className="relative perspective-1000 w-full max-w-2xl mx-auto min-h-[340px] sm:min-h-[380px]">
        <div
          id="active-flashcard"
          tabIndex={0}
          role="button"
          aria-label={`Flashcard ${currentIndex + 1} of ${totalCards}. ${
            isFlipped
              ? `Back: Definition: ${currentCard?.definition}`
              : `Front: Term: ${currentCard?.term}. Click or press Space to flip.`
          }`}
          onClick={handleFlipCard}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleFlipCard();
            }
          }}
          className={`relative w-full h-[340px] sm:h-[380px] rounded-3xl transition-transform duration-500 transform-style-3d cursor-pointer select-none focus:outline-hidden focus:ring-4 focus:ring-indigo-500/30 ${
            isFlipped ? 'rotate-y-180' : ''
          }`}
        >
          {/* Card Front (Term) */}
          <div
            id="flashcard-front"
            className="absolute inset-0 w-full h-full bg-white rounded-3xl p-8 border-2 border-slate-200 shadow-xl flex flex-col justify-between backface-hidden"
          >
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-slate-100 text-slate-700">
                <Layers className="w-3.5 h-3.5 text-indigo-600" />
                <span>Front • Term</span>
              </span>

              {/* Status Badge if previously rated */}
              {currentCard?.status !== 'unreviewed' && (
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${
                    currentCard?.status === 'known'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-rose-50 text-rose-700 border border-rose-200'
                  }`}
                >
                  {currentCard?.status === 'known' ? (
                    <>
                      <Check className="w-3.5 h-3.5" /> Marked Known
                    </>
                  ) : (
                    <>
                      <X className="w-3.5 h-3.5" /> Marked Don't Know
                    </>
                  )}
                </span>
              )}
            </div>

            <div className="my-auto text-center px-4">
              <span className="block text-xs font-semibold uppercase tracking-widest text-slate-400 mb-2">
                Vocabulary Concept
              </span>
              <h3
                id="flashcard-term-display"
                className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight"
              >
                {currentCard?.term}
              </h3>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100 text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <RotateCw className="w-3.5 h-3.5 text-indigo-500 animate-spin-reverse" />
                Click card or press <kbd className="px-1.5 py-0.5 bg-slate-100 rounded text-slate-600 font-mono">Space</kbd> to flip
              </span>
              <span className="font-semibold text-slate-500">
                Card {currentIndex + 1} / {totalCards}
              </span>
            </div>
          </div>

          {/* Card Back (Definition) */}
          <div
            id="flashcard-back"
            className="absolute inset-0 w-full h-full bg-linear-to-b from-indigo-900 to-slate-900 text-white rounded-3xl p-8 shadow-xl flex flex-col justify-between backface-hidden rotate-y-180 border-2 border-indigo-700"
          >
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-800/80 text-indigo-200 border border-indigo-700">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Back • Definition</span>
              </span>

              <span className="text-xs text-indigo-200/80 font-medium">
                {currentCard?.term}
              </span>
            </div>

            <div className="my-auto px-4 max-h-[220px] overflow-y-auto">
              <span className="block text-xs font-semibold uppercase tracking-widest text-indigo-300 mb-2">
                Definition & Meaning
              </span>
              <p
                id="flashcard-definition-display"
                className="text-lg sm:text-xl font-medium text-slate-100 leading-relaxed"
              >
                {currentCard?.definition}
              </p>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-indigo-800/60 text-xs text-indigo-300">
              <span className="flex items-center gap-1">
                <RotateCw className="w-3.5 h-3.5 text-indigo-400" />
                Click to flip back
              </span>
              <span className="font-semibold text-indigo-200">
                Card {currentIndex + 1} / {totalCards}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Primary Interaction Controls */}
      <div
        id="card-study-controls"
        className="flex flex-col sm:flex-row items-center justify-center gap-3.5 max-w-2xl mx-auto"
      >
        {/* Flip Button */}
        <button
          type="button"
          id="flip-card-btn"
          onClick={handleFlipCard}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-bold text-slate-800 bg-white hover:bg-slate-50 active:bg-slate-100 rounded-xl border border-slate-300 shadow-xs hover:shadow-md transition-all cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-slate-400"
          aria-label={isFlipped ? 'Flip card back to term' : 'Flip card to definition'}
        >
          <RotateCw className="w-4 h-4 text-slate-600" />
          <span>{isFlipped ? 'Show Term (Front)' : 'Flip Card (Definition)'}</span>
        </button>

        {/* Known Button */}
        <button
          type="button"
          id="mark-known-btn"
          onClick={() => handleMarkStatus('known')}
          className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-bold rounded-xl transition-all cursor-pointer shadow-xs focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 ${
            currentCard?.status === 'known'
              ? 'bg-emerald-600 text-white shadow-emerald-500/20 ring-2 ring-emerald-600 ring-offset-2'
              : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white border border-emerald-200'
          }`}
          title="Mark this term as Known (Keyboard: K or 1)"
        >
          <Check className="w-4 h-4" />
          <span>Known</span>
          <kbd className="hidden sm:inline-block ml-1 px-1.5 py-0.5 text-2xs bg-black/10 rounded font-mono">
            K
          </kbd>
        </button>

        {/* Don't Know Button */}
        <button
          type="button"
          id="mark-unknown-btn"
          onClick={() => handleMarkStatus('unknown')}
          className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-bold rounded-xl transition-all cursor-pointer shadow-xs focus:outline-hidden focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 ${
            currentCard?.status === 'unknown'
              ? 'bg-rose-600 text-white shadow-rose-500/20 ring-2 ring-rose-600 ring-offset-2'
              : 'bg-rose-50 text-rose-700 hover:bg-rose-600 hover:text-white border border-rose-200'
          }`}
          title="Mark this term as Don't Know (Keyboard: D or 2)"
        >
          <X className="w-4 h-4" />
          <span>Don't Know</span>
          <kbd className="hidden sm:inline-block ml-1 px-1.5 py-0.5 text-2xs bg-black/10 rounded font-mono">
            D
          </kbd>
        </button>
      </div>

      {/* Navigation Buttons: Previous / Next & Finish */}
      <div
        id="card-navigation-bar"
        className="flex items-center justify-between max-w-2xl mx-auto pt-4 border-t border-slate-200"
      >
        <button
          type="button"
          id="previous-card-btn"
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
            currentIndex === 0
              ? 'text-slate-300 bg-slate-50 cursor-not-allowed border border-slate-100'
              : 'text-slate-700 bg-white hover:bg-slate-100 active:bg-slate-200 border border-slate-200 shadow-2xs cursor-pointer'
          }`}
          aria-label="Previous flashcard"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous</span>
        </button>

        <span className="text-xs font-semibold text-slate-500">
          Card {currentIndex + 1} of {totalCards}
        </span>

        {currentIndex === totalCards - 1 ? (
          <button
            type="button"
            id="finish-study-btn"
            onClick={handleAttemptFinish}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-xs cursor-pointer transition-all focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
          >
            <span>Finish & Results</span>
            <Award className="w-4 h-4" />
          </button>
        ) : (
          <button
            type="button"
            id="next-card-btn"
            onClick={handleNext}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-700 bg-white hover:bg-slate-100 active:bg-slate-200 border border-slate-200 shadow-2xs cursor-pointer transition-all"
            aria-label="Next flashcard"
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Helpful keyboard shortcuts hint footer */}
      <div
        id="shortcuts-hint"
        className="flex flex-wrap items-center justify-center gap-4 text-2xs text-slate-500 pt-2"
      >
        <span className="flex items-center gap-1">
          <kbd className="px-1.5 py-0.5 bg-slate-200 text-slate-700 rounded font-mono">
            Space
          </kbd>{' '}
          Flip
        </span>
        <span className="flex items-center gap-1">
          <kbd className="px-1.5 py-0.5 bg-slate-200 text-slate-700 rounded font-mono">
            ←
          </kbd>{' '}
          Prev
        </span>
        <span className="flex items-center gap-1">
          <kbd className="px-1.5 py-0.5 bg-slate-200 text-slate-700 rounded font-mono">
            →
          </kbd>{' '}
          Next
        </span>
        <span className="flex items-center gap-1">
          <kbd className="px-1.5 py-0.5 bg-slate-200 text-slate-700 rounded font-mono">
            K
          </kbd>{' '}
          Known
        </span>
        <span className="flex items-center gap-1">
          <kbd className="px-1.5 py-0.5 bg-slate-200 text-slate-700 rounded font-mono">
            D
          </kbd>{' '}
          Don't Know
        </span>
      </div>
    </div>
  );
};
