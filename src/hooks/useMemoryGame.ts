import { useState, useCallback, useEffect, useRef } from 'react';
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

/** Cuántos pares tiene cada nivel. El tope son las caras disponibles. */
export const LEVELS = [
  { id: 'facil', label: 'Fácil', pairs: 4 },
  { id: 'normal', label: 'Normal', pairs: 6 },
  { id: 'dificil', label: 'Difícil', pairs: FACES.length },
] as const;

export type LevelId = (typeof LEVELS)[number]['id'];

function buildDeck(pairs: number): MemoryCardData[] {
  // Se sortea QUÉ caras entran, no solo el orden: así "Fácil" no es siempre
  // el mismo juego con las mismas cuatro amigas.
  const chosen = [...FACES].sort(() => Math.random() - 0.5).slice(0, pairs);

  const deck: MemoryCardData[] = [...chosen, ...chosen].map((f, id) => ({
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

/**
 * Las estrellas se miden contra el mínimo posible (una jugada por par), no
 * contra un número fijo: si no, "Fácil" siempre daría tres estrellas y
 * "Difícil" casi nunca.
 */
function getStarRating(moves: number, pairs: number): string {
  if (moves <= pairs * 1.5) return '⭐⭐⭐';
  if (moves <= pairs * 2.5) return '⭐⭐';
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

export function useMemoryGame(
  pairs: number,
  onWin?: (moves: number) => void,
): UseMemoryGameReturn {
  const [cards, setCards] = useState<MemoryCardData[]>(() => buildDeck(pairs));
  const [selected, setSelected] = useState<number[]>([]);
  const [busy, setBusy] = useState(false);
  const [moves, setMoves] = useState(0);
  const [won, setWon] = useState(false);

  // En un ref para que cambiar el handler no reconstruya `flip` en cada render.
  const onWinRef = useRef(onWin);
  useEffect(() => {
    onWinRef.current = onWin;
  }, [onWin]);

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
        /*
         * El resultado se calcula ACÁ, no dentro del updater de `setCards`.
         * Un updater tiene que ser puro: React lo invoca dos veces en StrictMode
         * (y puede repetirlo al renderizar en concurrente), así que meter
         * sonidos o `setWon` adentro los ejecutaba por duplicado.
         *
         * `cards` es del render en que se tocó la carta: `a` y `b` todavía
         * figuran sin dar vuelta, pero su `key` —lo único que decide el par— ya
         * es la definitiva.
         */
        const isMatch = cards[a].key === cards[b].key;
        const resolved = cards.map((c, i) =>
          next.includes(i) ? { ...c, matched: isMatch, flipped: isMatch } : c,
        );
        const finished = isMatch && resolved.every(c => c.matched);

        setCards(resolved);
        setBusy(false);

        if (!isMatch) {
          playError();
        } else if (finished) {
          playWin();
          setWon(true);
          onWinRef.current?.(moves + 1);
        } else {
          playSuccess();
        }
      }, 900);
    },
    [cards, selected, busy, moves],
  );

  const reset = useCallback(() => {
    setCards(buildDeck(pairs));
    setSelected([]);
    setBusy(false);
    setMoves(0);
    setWon(false);
  }, [pairs]);

  return { cards, moves, won, stars: getStarRating(moves, pairs), flip, reset };
}