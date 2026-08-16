import { useCallback, useReducer } from 'react';
import { read, todayISO, write } from './storage';

const KEY = 'collection';

/**
 * Lo que cada jugadora fue encontrando en Manolandia.
 *
 * Regla de diseño: **todo lo que se junta es un objeto con historia, nunca una
 * moneda.** No hay tienda, no hay energía, no se gasta ni se pierde nada por no
 * volver. Los deseos son el primer descubrimiento del mundo; el día que exista
 * el Libro de las Nuvecielas, esto es lo que va adentro.
 */
/** Lo mejor que le salió en un juego. `best` es el récord, no un puntaje acumulado. */
export interface GameStats {
  wins: number;
  best: number | null;
}

interface PlayerCollection {
  wishes: number;
  /** YYYY-MM-DD del último deseo, para poder contarlo después en el Libro */
  lastWish?: string;
  games?: Record<string, GameStats>;
}

type CollectionStore = Record<string, PlayerCollection>;

const EMPTY: PlayerCollection = { wishes: 0 };
const NO_STATS: GameStats = { wins: 0, best: null };

function collectionFor(playerId: string): PlayerCollection {
  return read<CollectionStore>(KEY, {})[playerId] ?? EMPTY;
}

/**
 * La colección se lee del almacenamiento en cada render en vez de duplicarse en
 * estado de React: así nunca puede quedar desincronizada, y cambiar de jugadora
 * no necesita ningún efecto. `bump` solo fuerza el re-render tras guardar.
 */
export function useWishes(playerId: string | null) {
  const [, bump] = useReducer((n: number) => n + 1, 0);

  const wishes = playerId ? collectionFor(playerId).wishes : 0;

  /** Suma un deseo. Sin perfil elegido no se guarda nada. */
  const addWish = useCallback(() => {
    if (!playerId) return;
    const store = read<CollectionStore>(KEY, {});
    const current = store[playerId] ?? EMPTY;
    write(KEY, {
      ...store,
      [playerId]: { wishes: current.wishes + 1, lastWish: todayISO() },
    } satisfies CollectionStore);
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
) {
  const [, bump] = useReducer((n: number) => n + 1, 0);

  const stats = playerId
    ? (collectionFor(playerId).games?.[gameId] ?? NO_STATS)
    : NO_STATS;

  /** Registra una victoria. Devuelve true si además fue récord nuevo. */
  const recordWin = useCallback(
    (value: number): boolean => {
      if (!playerId) return false;

      const store = read<CollectionStore>(KEY, {});
      const player = store[playerId] ?? EMPTY;
      const previous = player.games?.[gameId] ?? NO_STATS;
      const isRecord =
        previous.best === null ||
        (better === 'lower' ? value < previous.best : value > previous.best);

      write(KEY, {
        ...store,
        [playerId]: {
          ...player,
          games: {
            ...player.games,
            [gameId]: {
              wins: previous.wins + 1,
              best: isRecord ? value : previous.best,
            },
          },
        },
      } satisfies CollectionStore);

      bump();
      return isRecord;
    },
    [playerId, gameId, better],
  );

  return { stats, recordWin };
}
