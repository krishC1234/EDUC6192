import React, { useState } from 'react';
import { Sparkles, GraduationCap } from 'lucide-react';
import { AppView, Flashcard, ModalState } from './types';
import { InstructionBanner } from './components/InstructionBanner';
import { CreateDeckView } from './components/CreateDeckView';
import { ReviewView } from './components/ReviewView';
import { ResultsView } from './components/ResultsView';
import { Modal } from './components/Modal';
import { SAMPLE_TOPICS } from './data/presets';

export default function App() {
  const [view, setView] = useState<AppView>('create');
  const [topic, setTopic] = useState<string>(SAMPLE_TOPICS[0].title);
  const [cards, setCards] = useState<Flashcard[]>(
    SAMPLE_TOPICS[0].cards.map((c, i) => ({
      id: (i + 1).toString(),
      term: c.term,
      definition: c.definition,
      status: 'unreviewed',
      hasFlipped: false,
    }))
  );

  const [modalState, setModalState] = useState<ModalState>({
    isOpen: false,
    title: '',
    message: '',
  });

  const handleOpenErrorModal = (modal: ModalState) => {
    setModalState(modal);
  };

  const handleCloseModal = () => {
    setModalState((prev) => ({ ...prev, isOpen: false }));
  };

  const handleCreateDeck = (newTopic: string, terms: { id: string; term: string; definition: string }[]) => {
    setTopic(newTopic);
    const newCards: Flashcard[] = terms.map((t) => ({
      id: t.id,
      term: t.term,
      definition: t.definition,
      status: 'unreviewed',
      hasFlipped: false,
    }));
    setCards(newCards);
    setView('review');
  };

  const handleUpdateCardStatus = (cardId: string, status: 'known' | 'unknown') => {
    setCards((prev) =>
      prev.map((c) => (c.id === cardId ? { ...c, status, hasFlipped: true } : c))
    );
  };

  const handleReviewAgain = () => {
    // Reset status to unreviewed and start review over
    setCards((prev) =>
      prev.map((c) => ({ ...c, status: 'unreviewed', hasFlipped: false }))
    );
    setView('review');
  };

  const handleRestart = () => {
    // Retain statuses but restart from card 1
    setView('review');
  };

  const handleCreateNewSet = () => {
    setView('create');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Top Application Navbar */}
      <header
        id="app-header"
        className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-2xs"
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-sm shadow-indigo-600/20">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h1 id="app-title" className="text-lg font-extrabold text-slate-900 leading-none">
                Flashcard Study
              </h1>
              <p className="text-2xs text-slate-500 font-medium mt-0.5">
                Quick, free concept and vocabulary review for students
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span
              id="free-badge"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>100% Free • No Account</span>
            </span>

            {view !== 'create' && (
              <button
                type="button"
                id="nav-edit-set-btn"
                onClick={handleCreateNewSet}
                className="px-3.5 py-1.5 text-xs font-bold text-indigo-700 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg transition-colors cursor-pointer"
              >
                Edit Deck
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {view === 'create' && (
          <div className="animate-in fade-in duration-150">
            <InstructionBanner />
            <CreateDeckView
              initialTopic={topic}
              initialTerms={cards.map((c) => ({
                id: c.id,
                term: c.term,
                definition: c.definition,
              }))}
              onCreateDeck={handleCreateDeck}
              onErrorModal={handleOpenErrorModal}
            />
          </div>
        )}

        {view === 'review' && (
          <div className="animate-in fade-in duration-150">
            <ReviewView
              topic={topic}
              cards={cards}
              onUpdateCardStatus={handleUpdateCardStatus}
              onFinishReview={() => setView('results')}
              onRestart={handleRestart}
              onCreateNewSet={handleCreateNewSet}
              onErrorModal={handleOpenErrorModal}
            />
          </div>
        )}

        {view === 'results' && (
          <div className="animate-in fade-in duration-150">
            <ResultsView
              topic={topic}
              cards={cards}
              onReviewAgain={handleReviewAgain}
              onRestart={handleRestart}
              onCreateNewSet={handleCreateNewSet}
            />
          </div>
        )}
      </main>

      {/* Application Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-4 text-center text-xs text-slate-500">
        <p>
          Flashcard Study &mdash; Free active-recall educational tool for students and lifelong learners.
        </p>
      </footer>

      {/* Accessible Error / Confirmation Modal */}
      <Modal modal={modalState} onClose={handleCloseModal} />
    </div>
  );
}
