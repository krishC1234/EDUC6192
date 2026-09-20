export type CardStatus = 'unreviewed' | 'known' | 'unknown';

export interface Flashcard {
  id: string;
  term: string;
  definition: string;
  status: CardStatus;
  hasFlipped: boolean;
}

export type AppView = 'create' | 'review' | 'results';

export interface ModalState {
  isOpen: boolean;
  title: string;
  message: string;
  solutionHint?: string;
  type?: 'error' | 'warning' | 'confirm';
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
}

export interface PresetTopic {
  title: string;
  description: string;
  cards: Array<{ term: string; definition: string }>;
}
