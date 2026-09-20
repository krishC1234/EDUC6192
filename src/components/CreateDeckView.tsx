import React, { useState } from 'react';
import { Plus, Trash2, Sparkles, Layers, BookMarked, ArrowRight } from 'lucide-react';
import { ModalState, PresetTopic } from '../types';
import { SAMPLE_TOPICS } from '../data/presets';

interface TermItem {
  id: string;
  term: string;
  definition: string;
}

interface CreateDeckViewProps {
  initialTopic: string;
  initialTerms: TermItem[];
  onCreateDeck: (topic: string, terms: TermItem[]) => void;
  onErrorModal: (modal: ModalState) => void;
}

export const CreateDeckView: React.FC<CreateDeckViewProps> = ({
  initialTopic,
  initialTerms,
  onCreateDeck,
  onErrorModal,
}) => {
  const [topic, setTopic] = useState(initialTopic);
  const [terms, setTerms] = useState<TermItem[]>(
    initialTerms.length > 0
      ? initialTerms
      : [
          { id: '1', term: '', definition: '' },
          { id: '2', term: '', definition: '' },
          { id: '3', term: '', definition: '' },
        ]
  );
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);

  const handleAddTerm = () => {
    const newTerm: TermItem = {
      id: Date.now().toString(),
      term: '',
      definition: '',
    };
    setTerms([...terms, newTerm]);
  };

  const handleRemoveTerm = (id: string, index: number) => {
    if (terms.length <= 1) {
      onErrorModal({
        isOpen: true,
        title: 'Action Not Available',
        message: 'You need at least one term to create flashcards.',
        solutionHint:
          'Flashcard sets require at least one term and definition to study. Keep this term or replace its contents.',
        type: 'error',
        confirmText: 'Got It',
      });
      return;
    }
    setTerms(terms.filter((t) => t.id !== id));
  };

  const handleTermChange = (id: string, field: 'term' | 'definition', value: string) => {
    setTerms(
      terms.map((t) => (t.id === id ? { ...t, [field]: value } : t))
    );
  };

  const handleLoadSample = (sample: PresetTopic) => {
    setTopic(sample.title);
    setTerms(
      sample.cards.map((c, i) => ({
        id: (Date.now() + i).toString(),
        term: c.term,
        definition: c.definition,
      }))
    );
    setAttemptedSubmit(false);
  };

  const handleClearAll = () => {
    setTopic('');
    setTerms([{ id: Date.now().toString(), term: '', definition: '' }]);
    setAttemptedSubmit(false);
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    setAttemptedSubmit(true);

    const trimmedTopic = topic.trim();
    if (!trimmedTopic) {
      onErrorModal({
        isOpen: true,
        title: 'Missing Topic',
        message: 'Please enter a topic before creating your flashcards.',
        solutionHint:
          'Type a subject or topic name (e.g. "Biology 101", "Spanish Vocabulary") in the Topic field above.',
        type: 'error',
        confirmText: 'Got It',
      });
      return;
    }

    if (terms.length === 0) {
      onErrorModal({
        isOpen: true,
        title: 'Missing Term',
        message: 'Please add at least one term before creating your flashcards.',
        solutionHint:
          'Click the "+ Add Term" button below to add concepts you want to study.',
        type: 'error',
        confirmText: 'Got It',
      });
      return;
    }

    // Check for empty terms or definitions
    const emptyTermIndex = terms.findIndex((t) => !t.term.trim());
    if (emptyTermIndex !== -1) {
      onErrorModal({
        isOpen: true,
        title: 'Missing Term',
        message: `Term #${emptyTermIndex + 1} is empty. Please enter a term name before proceeding.`,
        solutionHint:
          'Every card must have a term name. Fill in the highlighted empty term field or remove it.',
        type: 'error',
        confirmText: 'Got It',
      });
      return;
    }

    const emptyDefIndex = terms.findIndex((t) => !t.definition.trim());
    if (emptyDefIndex !== -1) {
      onErrorModal({
        isOpen: true,
        title: 'Missing Definition',
        message: `Term #${emptyDefIndex + 1} ("${terms[emptyDefIndex].term}") is missing its definition.`,
        solutionHint:
          'Provide a clear definition or explanation so you can test your active recall when the card flips.',
        type: 'error',
        confirmText: 'Got It',
      });
      return;
    }

    // All valid! Proceed to study
    onCreateDeck(
      trimmedTopic,
      terms.map((t) => ({
        id: t.id,
        term: t.term.trim(),
        definition: t.definition.trim(),
      }))
    );
  };

  return (
    <form onSubmit={handleCreate} id="create-flashcards-form" noValidate>
      {/* Sample presets strip */}
      <div
        id="sample-topics-bar"
        className="mb-6 flex flex-wrap items-center justify-between gap-3 p-3.5 bg-white rounded-xl border border-slate-200 shadow-2xs"
      >
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>Quick Start with Sample Topics:</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {SAMPLE_TOPICS.map((sample) => (
            <button
              key={sample.title}
              type="button"
              id={`preset-btn-${sample.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
              onClick={() => handleLoadSample(sample)}
              className="px-2.5 py-1 text-xs font-medium text-slate-600 hover:text-indigo-600 bg-slate-100 hover:bg-indigo-50 border border-slate-200/80 hover:border-indigo-200 rounded-md transition-all cursor-pointer"
            >
              {sample.title.split(':')[0]}
            </button>
          ))}
          <button
            type="button"
            id="clear-all-terms-btn"
            onClick={handleClearAll}
            className="px-2.5 py-1 text-xs font-medium text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
          >
            Clear Fields
          </button>
        </div>
      </div>

      {/* Topic Input Field */}
      <div className="mb-8 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <label
          htmlFor="topic-input"
          className="block text-sm font-bold text-slate-900 mb-1.5"
        >
          Study Topic <span className="text-rose-500">*</span>
        </label>
        <p className="text-xs text-slate-500 mb-3">
          Give your flashcard deck a subject title (e.g., Biology Organelles, Spanish Verbs, World History)
        </p>
        <div className="relative">
          <input
            id="topic-input"
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. Cellular Biology & Organelles"
            className={`w-full px-4 py-3 rounded-xl border text-base font-medium transition-all focus:outline-hidden focus:ring-2 ${
              attemptedSubmit && !topic.trim()
                ? 'border-rose-300 bg-rose-50/30 text-rose-900 focus:ring-rose-500'
                : 'border-slate-300 bg-white text-slate-900 focus:border-indigo-500 focus:ring-indigo-500/20'
            }`}
            aria-required="true"
            aria-invalid={attemptedSubmit && !topic.trim()}
          />
          {attemptedSubmit && !topic.trim() && (
            <span className="block mt-2 text-xs font-medium text-rose-600">
              * Please enter a topic before creating your flashcards.
            </span>
          )}
        </div>
      </div>

      {/* Terms Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3
              id="terms-list-heading"
              className="text-lg font-bold text-slate-900 flex items-center gap-2"
            >
              <Layers className="w-5 h-5 text-indigo-600" />
              <span>Study Terms & Definitions</span>
              <span className="ml-2 px-2.5 py-0.5 text-xs font-semibold bg-indigo-50 text-indigo-700 rounded-full border border-indigo-100">
                {terms.length} {terms.length === 1 ? 'card' : 'cards'}
              </span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Enter each term for the front of the card and its definition for the back
            </p>
          </div>

          <button
            type="button"
            id="add-term-top-btn"
            onClick={handleAddTerm}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200/80 rounded-xl transition-all shadow-2xs hover:shadow-xs focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
          >
            <Plus className="w-4 h-4" />
            <span>Add Term</span>
          </button>
        </div>

        {/* List of cards */}
        <div className="space-y-4" role="list" aria-labelledby="terms-list-heading">
          {terms.map((item, index) => {
            const isTermEmpty = attemptedSubmit && !item.term.trim();
            const isDefEmpty = attemptedSubmit && !item.definition.trim();

            return (
              <div
                key={item.id}
                role="listitem"
                id={`term-row-${index + 1}`}
                className="group relative bg-white p-5 rounded-2xl border border-slate-200 hover:border-slate-300 shadow-xs transition-all"
              >
                <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-slate-100 text-xs font-bold text-slate-600">
                      {index + 1}
                    </span>
                    <span className="text-xs font-medium text-slate-500">
                      Flashcard #{index + 1}
                    </span>
                  </div>

                  <button
                    type="button"
                    id={`remove-term-btn-${index + 1}`}
                    onClick={() => handleRemoveTerm(item.id, index)}
                    className="inline-flex items-center gap-1 text-xs font-medium text-slate-400 hover:text-rose-600 hover:bg-rose-50 px-2 py-1 rounded-lg transition-colors"
                    aria-label={`Remove term ${index + 1}`}
                    title="Remove this term"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Remove</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Front Term */}
                  <div>
                    <label
                      htmlFor={`term-input-${item.id}`}
                      className="block text-xs font-semibold text-slate-700 mb-1"
                    >
                      Front: Term / Concept <span className="text-rose-500">*</span>
                    </label>
                    <input
                      id={`term-input-${item.id}`}
                      type="text"
                      value={item.term}
                      onChange={(e) =>
                        handleTermChange(item.id, 'term', e.target.value)
                      }
                      placeholder="e.g. Mitochondria"
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-sm transition-all focus:outline-hidden focus:ring-2 ${
                        isTermEmpty
                          ? 'border-rose-300 bg-rose-50/30 text-rose-900 focus:ring-rose-500'
                          : 'border-slate-200 bg-white text-slate-900 focus:border-indigo-500 focus:ring-indigo-500/20'
                      }`}
                    />
                    {isTermEmpty && (
                      <span className="block mt-1 text-xs text-rose-600 font-medium">
                        * Please fill in this term.
                      </span>
                    )}
                  </div>

                  {/* Back Definition */}
                  <div>
                    <label
                      htmlFor={`def-input-${item.id}`}
                      className="block text-xs font-semibold text-slate-700 mb-1"
                    >
                      Back: Definition / Meaning <span className="text-rose-500">*</span>
                    </label>
                    <input
                      id={`def-input-${item.id}`}
                      type="text"
                      value={item.definition}
                      onChange={(e) =>
                        handleTermChange(item.id, 'definition', e.target.value)
                      }
                      placeholder="e.g. The powerhouse of the cell that generates ATP."
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-sm transition-all focus:outline-hidden focus:ring-2 ${
                        isDefEmpty
                          ? 'border-rose-300 bg-rose-50/30 text-rose-900 focus:ring-rose-500'
                          : 'border-slate-200 bg-white text-slate-900 focus:border-indigo-500 focus:ring-indigo-500/20'
                      }`}
                    />
                    {isDefEmpty && (
                      <span className="block mt-1 text-xs text-rose-600 font-medium">
                        * Please fill in this definition.
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Add another term button at bottom */}
        <div className="mt-4 flex justify-center">
          <button
            type="button"
            id="add-term-bottom-btn"
            onClick={handleAddTerm}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-semibold text-slate-700 hover:text-indigo-600 bg-white hover:bg-indigo-50 border-2 border-dashed border-slate-300 hover:border-indigo-300 rounded-xl transition-all shadow-2xs hover:shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4 text-indigo-600" />
            <span>Add Another Term</span>
          </button>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div
        id="create-deck-action-bar"
        className="sticky bottom-4 z-20 flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200 shadow-lg"
      >
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <BookMarked className="w-4 h-4 text-indigo-600" />
          <span>
            Ready to review{' '}
            <strong className="text-slate-800 font-semibold">
              {terms.filter((t) => t.term.trim()).length}
            </strong>{' '}
            terms
          </span>
        </div>

        <button
          type="submit"
          id="create-flashcards-btn"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 text-base font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-xl shadow-md hover:shadow-indigo-500/20 transition-all cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          <span>Create Flashcards</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </form>
  );
};
