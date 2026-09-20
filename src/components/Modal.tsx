import React, { useEffect, useRef } from 'react';
import { AlertCircle, AlertTriangle, HelpCircle, X } from 'lucide-react';
import { ModalState } from '../types';

interface ModalProps {
  modal: ModalState;
  onClose: () => void;
}

export const Modal: React.FC<ModalProps> = ({ modal, onClose }) => {
  const dialogRef = useRef<HTMLDivElement>(null);
  const primaryButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!modal.isOpen) return;

    // Focus the primary action button when modal opens
    const timer = setTimeout(() => {
      primaryButtonRef.current?.focus();
    }, 50);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }

      // Focus trap
      if (e.key === 'Tab' && dialogRef.current) {
        const focusableElements = dialogRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement?.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement?.focus();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [modal.isOpen, onClose]);

  if (!modal.isOpen) return null;

  const isConfirm = modal.type === 'confirm';
  const isWarning = modal.type === 'warning';

  return (
    <div
      id="modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
        id="accessible-modal-dialog"
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150 relative text-slate-800"
      >
        <button
          type="button"
          id="modal-close-icon-btn"
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 rounded-full p-1 transition-colors hover:bg-slate-100 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-start gap-4">
          <div
            className={`flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center ${
              isConfirm
                ? 'bg-amber-100 text-amber-700'
                : isWarning
                ? 'bg-amber-100 text-amber-600'
                : 'bg-rose-100 text-rose-600'
            }`}
          >
            {isConfirm ? (
              <HelpCircle className="w-6 h-6" />
            ) : isWarning ? (
              <AlertTriangle className="w-6 h-6" />
            ) : (
              <AlertCircle className="w-6 h-6" />
            )}
          </div>

          <div className="flex-1 pr-4">
            <h3
              id="modal-title"
              className="text-lg font-bold text-slate-900 leading-snug"
            >
              {modal.title}
            </h3>

            <p
              id="modal-description"
              className="mt-2 text-sm text-slate-600 leading-relaxed"
            >
              {modal.message}
            </p>

            {modal.solutionHint && (
              <div className="mt-3.5 p-3 rounded-lg bg-slate-50 border border-slate-200/80 text-xs text-slate-700">
                <span className="font-semibold text-slate-900 block mb-1">
                  How to fix:
                </span>
                {modal.solutionHint}
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          {isConfirm ? (
            <>
              <button
                type="button"
                id="modal-cancel-btn"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors focus:outline-hidden focus:ring-2 focus:ring-slate-400"
              >
                {modal.cancelText || 'Continue Reviewing'}
              </button>
              <button
                type="button"
                id="modal-confirm-btn"
                ref={primaryButtonRef}
                onClick={() => {
                  if (modal.onConfirm) {
                    modal.onConfirm();
                  }
                  onClose();
                }}
                className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                {modal.confirmText || 'Finish Anyway'}
              </button>
            </>
          ) : (
            <button
              type="button"
              id="modal-got-it-btn"
              ref={primaryButtonRef}
              onClick={onClose}
              className="px-5 py-2 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-xs transition-colors focus:outline-hidden focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
            >
              {modal.confirmText || 'Got It'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
