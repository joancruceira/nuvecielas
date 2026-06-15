import { useState, useCallback } from 'react';
import type { MemoryCardData } from '../types';
import { playTap, playSuccess, playError, playWin } from '../utils/audio';

import nuvecielaImg from '../assets/images/nuveciela.png';
import nuveImg from '../assets/images/nuve.png';
import lunariaImg from '../assets/images/lunaria.png';
import cielaImg from '../assets/images/ciela.png';
import melliAImg from '../assets/images/melli_amarilla.png';
import melliCImg from '../assets/images/melli_celeste.png';
import natanImg from '../assets/images/natan_run0.png';
import estrellariaImg from '../assets/images/Estrellaria.png';

interface Face { key: string; name: string; src: string; }

const FACES: Face[] = [
  { key: 'nuveciela', name: 'Nuveciela', src: nuvecielaImg },
  { key: 'nuve', name: 'Nuve', src: nuveImg },
  { key: 'lunaria', name: 'Lunaria', src: lunariaImg },
  { key: 'ciela', name: 'Ciela', src: cielaImg },
  { key: 'melli-amarilla', name: 'Melli ☀️', src: melliAImg },
  { key: 'melli-celeste', name: 'Melli 🩵', src: melliCImg },
  { key: 'natan', name: 'Natan', src: natanImg },
  { key: 'estrellaria', name: 'Estrellaria', src: estrellariaImg },
];

function buildDeck(): MemoryCardData[] {
  const deck: MemoryCardData[] = [...FACES, ...FACES].map((f, id) => ({
    id,
    key: f.key,
    src: f.src,
    name: f.name,
    flipped: false,
    matched: false,
  }));

  // Fisher-Yates shuffle
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

function getStarRating(moves: number): string {
  if (moves <= 12) return '⭐⭐⭐';
  if (moves <= 18) return '⭐⭐';
  return '⭐';
}

export interface UseMemoryGameReturn {
  cards: MemoryCardData[];
  moves: number;
  won: boolean;
  stars: string;
  flip: (index: number) => void;
  reset: () => void;
}

export function useMemoryGame(): UseMemoryGameReturn {
  const [cards, setCards] = useState<MemoryCardData[]>(buildDeck);
  const [selected, setSelected] = useState<number[]>([]);
  const [busy, setBusy] = useState(false);
  const [moves, setMoves] = useState(0);
  const [won, setWon] = useState(false);

  const flip = useCallback(
    (index: number) => {
      if (busy || cards[index].matched || cards[index].flipped) return;

      playTap();

      const next = [...selected, index];
      setCards(prev =>
        prev.map((c, i) => (i === index ? { ...c, flipped: true } : c)),
      );

      if (next.length === 1) {
        setSelected(next);
        return;
      }

      // Second card — evaluate match
      setSelected([]);
      setBusy(true);
      setMoves(m => m + 1);

      const [a, b] = next;
      setTimeout(() => {
        setCards(prev => {
          const isMatch = prev[a].key === prev[b].key;
          const updated = prev.map((c, i) =>
            next.includes(i)
              ? { ...c, matched: isMatch, flipped: isMatch }
              : c,
          );
          if (isMatch) {
            if (updated.every(c => c.matched)) {
              playWin();
              setWon(true);
            } else {
              playSuccess();
            }
          } else {
            playError();
          }
          return updated;
        });
        setBusy(false);
      }, 900);
    },
    [cards, selected, busy],
  );

  const reset = useCallback(() => {
    setCards(buildDeck());
    setSelected([]);
    setBusy(false);
    setMoves(0);
    setWon(false);
  }, []);

  return { cards, moves, won, stars: getStarRating(moves), flip, reset };
}