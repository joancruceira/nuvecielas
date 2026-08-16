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
interface PlayerCollection {
  wishes: number;
  /** YYYY-MM-DD del último deseo, para poder contarlo después en el Libro */
  lastWish?: string;
}

type CollectionStore = Record<string, PlayerCollection>;

const EMPTY: PlayerCollection = { wishes: 0 };

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
