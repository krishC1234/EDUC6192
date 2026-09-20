import { PresetTopic } from '../types';

export const SAMPLE_TOPICS: PresetTopic[] = [
  {
    title: 'Biology: Cell Structure',
    description: 'Core cellular organelles and functions for high school & college biology.',
    cards: [
      {
        term: 'Mitochondria',
        definition: 'The membrane-bound organelle that produces chemical energy (ATP) through cellular respiration.',
      },
      {
        term: 'Ribosome',
        definition: 'Microcellular machine responsible for translating mRNA into polypeptide protein chains.',
      },
      {
        term: 'Endoplasmic Reticulum',
        definition: 'An interconnected network of flattened sacs and tubules involved in protein synthesis and lipid metabolism.',
      },
      {
        term: 'Golgi Apparatus',
        definition: 'Organelle that packages, sorts, and modifies proteins and lipids for transport across or out of the cell.',
      },
      {
        term: 'Lysosome',
        definition: 'Digestive organelle containing hydrolytic enzymes to break down biomolecules, cellular debris, and pathogens.',
      },
    ],
  },
  {
    title: 'Spanish: Essential Travel Phrases',
    description: 'Foundational Spanish vocabulary and conversational greetings.',
    cards: [
      {
        term: 'Mucho gusto',
        definition: 'Nice to meet you (pleased to make your acquaintance).',
      },
      {
        term: '¿Dónde está la estación?',
        definition: 'Where is the station?',
      },
      {
        term: 'Por favor',
        definition: 'Please (polite marker used when making requests).',
      },
      {
        term: 'La cuenta, por favor',
        definition: 'The check / bill, please (used at restaurants).',
      },
      {
        term: 'Disculpe',
        definition: 'Excuse me (used to get attention or apologize politely).',
      },
    ],
  },
  {
    title: 'Computer Science: Core Fundamentals',
    description: 'Key algorithms and data structures vocabulary.',
    cards: [
      {
        term: 'Binary Search',
        definition: 'An efficient search algorithm on sorted collections with O(log n) logarithmic time complexity.',
      },
      {
        term: 'Hash Table',
        definition: 'A key-value data structure offering average O(1) constant-time insertions and lookups using a hashing function.',
      },
      {
        term: 'Recursion',
        definition: 'A programming technique in which a function calls itself directly or indirectly to solve smaller subproblems until reaching a base condition.',
      },
      {
        term: 'Idempotency',
        definition: 'The property of certain operations whereby applying them multiple times has the exact same effect as applying them once.',
      },
    ],
  },
];
