import { useCallback, useReducer } from 'react';
import { world } from './bridge';

/**
 * Lo que cada jugador fue encontrando y logrando en Manolandia.
 *
 * El almacenamiento vive en `public/nuve-world.js`, compartido con los otros
 * dos juegos: eso es lo que permite que el récord del Bosque Mágico y el de
 * Memoria Mágica sean de la misma persona.
 *
 * Regla de diseño: **todo lo que se junta es un objeto con historia, nunca una
 * moneda.** No hay tienda, no hay energía, no se gasta ni se pierde nada por no
 * volver.
 */
export interface GameStats {
  wins: number;
  best: number | null;
}

export function useWishes(playerId: string | null) {
  const [, bump] = useReducer((n: number) => n + 1, 0);

  const wishes = playerId ? world().wishes(playerId) : 0;

  /** Suma un deseo. Sin perfil elegido no se guarda nada. */
  const addWish = useCallback(() => {
    if (!playerId) return;
    world().addWish(playerId);
    world().note('manolandia', 'deseo', { label: 'una estrella fugaz' });
    bump();
  }, [playerId]);

  return { wishes, addWish };
}

/**
 * Récord de un juego para quien esté jugando.
 *
 * `better` dice qué es "mejor": en Memoria y el Puzzle gana el número más
 * chico (movimientos); en el Quiz, el más grande (aciertos).
 *
 * Sin perfil elegido el juego funciona igual — simplemente no se guarda nada.
 * Nunca hay que bloquear a nadie por no haber dicho quién es.
 */
export function useGameStats(
  playerId: string | null,
  gameId: string,
  better: 'lower' | 'higher',
  /** Cómo se llama el juego, para que el mundo pueda contarlo después */
  label?: string,
) {
  const [, bump] = useReducer((n: number) => n + 1, 0);

  const raw = world().gameState(gameId, playerId);
  const stats: GameStats = {
    wins: Number(raw.wins ?? 0),
    best: raw.best === undefined || raw.best === null ? null : Number(raw.best),
  };

  /** Registra una victoria. Devuelve true si además fue récord nuevo. */
  const recordWin = useCallback(
    (value: number): boolean => {
      if (!playerId) return false;
      const wins = Number(world().gameState(gameId, playerId).wins ?? 0);
      world().patchGameState(gameId, { wins: wins + 1 }, playerId);
      const isRecord = world().recordBest(gameId, 'best', value, better, playerId);
      world().note(gameId, 'victoria', { value, record: isRecord, label });
      bump();
      return isRecord;
    },
    [playerId, gameId, better, label],
  );

  return { stats, recordWin };
}
