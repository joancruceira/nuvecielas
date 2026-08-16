import { useCallback, useEffect, useState } from 'react';
import type { Player } from '../types';
import { PLAYERS, playerById } from '../data/players';
import { daysBetween, read, todayISO, write } from './storage';

const KEY = 'profile';

interface PlayerRecord {
  /** YYYY-MM-DD de la primera vez que entró */
  firstVisit: string;
  /** YYYY-MM-DD de la última visita ANTERIOR a la actual */
  lastVisit: string;
  visits: number;
  /**
   * Sólo para visitas: el nombre que escribieron. Nina, Jazmín y Natan lo
   * tienen en `data/players.ts`, así que ahí no hace falta.
   */
  name?: string;
  /**
   * Momento exacto de la última entrada, en ms. `lastVisit` es sólo la fecha
   * y sirve para el saludo ("hace 3 días"), pero no alcanza para ordenar a
   * varios que entraron el mismo día.
   */
  lastSeen?: number;
}

interface ProfileStore {
  current: string | null;
  players: Record<string, PlayerRecord>;
}

const EMPTY: ProfileStore = { current: null, players: {} };

/**
 * Cuánto hace que esta jugadora no venía, calculado ANTES de registrar la
 * visita de hoy (si no, siempre daría 0).
 */
export interface Arrival {
  player: Player;
  /** Nunca había entrado con este perfil */
  isFirstEver: boolean;
  /** Días desde la última visita. 0 = ya había entrado hoy */
  daysAway: number;
}

/** Prefijo de las visitas: cualquiera que escriba su nombre. */
const GUEST_PREFIX = 'guest-';
const GUEST_COLOR = '#B39DDB';
/** Cuántas visitas anteriores se ofrecen en el selector (las más recientes). */
const MAX_GUESTS_SHOWN = 3;

/** "Marí­a José" → "maria-jose". Sin acentos ni símbolos: es una clave. */
function slugify(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

/** Nina, Jazmín y Natan salen de los datos; el resto, de su propio registro. */
function resolvePlayer(playerId: string, store: ProfileStore): Player | null {
  const fixed = playerById(playerId);
  if (fixed) return fixed;

  const name = store.players[playerId]?.name;
  return name ? { id: playerId, name, emoji: '🌟', color: GUEST_COLOR } : null;
}

/** Las visitas que ya pasaron por acá, de la más reciente a la más vieja. */
function knownGuests(store: ProfileStore): Player[] {
  return Object.entries(store.players)
    .filter(([id, rec]) => id.startsWith(GUEST_PREFIX) && rec.name)
    .sort(([, a], [, b]) => (b.lastSeen ?? 0) - (a.lastSeen ?? 0))
    .slice(0, MAX_GUESTS_SHOWN)
    .map(([id, rec]) => ({ id, name: rec.name!, emoji: '🌟', color: GUEST_COLOR }));
}

/**
 * Cómo saludar a esta jugadora. Función PURA: solo lee. Tiene que ejecutarse
 * antes de `commitVisit`, porque una vez registrada la visita de hoy la última
 * visita anterior se pierde.
 */
function computeArrival(playerId: string): Arrival | null {
  const store = read<ProfileStore>(KEY, EMPTY);
  const player = resolvePlayer(playerId, store);
  if (!player) return null;

  const record = store.players[playerId];
  // Se mira `lastVisit` y no el registro entero: al anotar el nombre de una
  // visita nueva ya existe registro, pero todavía no entró nunca.
  return {
    player,
    isFirstEver: !record?.lastVisit,
    daysAway: record?.lastVisit ? daysBetween(record.lastVisit, todayISO()) : 0,
  };
}

/** Jugadoras cuya visita ya contamos en esta sesión. */
const countedThisSession = new Set<string>();

/**
 * Deja anotado quién está jugando. La visita se cuenta una sola vez por sesión
 * (si va y vuelve entre perfiles no suma visitas de más), pero `current` se
 * actualiza siempre para que al recargar entre con la jugadora correcta.
 */
function commitVisit(playerId: string): void {
  const store = read<ProfileStore>(KEY, EMPTY);
  const alreadyCounted = countedThisSession.has(playerId);
  countedThisSession.add(playerId);

  const record = store.players[playerId];
  const today = todayISO();

  write(KEY, {
    current: playerId,
    players: alreadyCounted
      ? store.players
      : {
          ...store.players,
          [playerId]: {
            ...record, // conserva el `name` de las visitas
            firstVisit: record?.firstVisit ?? today,
            lastVisit: today,
            lastSeen: Date.now(),
            visits: (record?.visits ?? 0) + 1,
          },
        },
  } satisfies ProfileStore);
}

/**
 * Deja anotado el nombre de una visita, sin contarle todavía la entrada: eso lo
 * hace `commitVisit`, y necesita distinguir si ya había venido antes.
 */
function registerGuest(playerId: string, name: string): void {
  const store = read<ProfileStore>(KEY, EMPTY);
  write(KEY, {
    ...store,
    players: {
      ...store.players,
      [playerId]: { ...store.players[playerId], name } as PlayerRecord,
    },
  } satisfies ProfileStore);
}

function forgetCurrent(): void {
  const store = read<ProfileStore>(KEY, EMPTY);
  write(KEY, { ...store, current: null } satisfies ProfileStore);
}

/**
 * Quién está jugando ahora, sin la ceremonia de llegada.
 * Lo usan los juegos: necesitan saber de quién es el récord, pero no tienen que
 * saludar ni contar visitas (de eso se ocupa el Home).
 */
export function useCurrentPlayer(): Player | null {
  return playerById(read<ProfileStore>(KEY, EMPTY).current);
}

export interface ProfileState {
  /** Quién está jugando, o null si todavía no eligió */
  player: Player | null;
  /** Cómo saludarla en esta sesión (estable mientras no cambie de perfil) */
  arrival: Arrival | null;
  /** Elegir/cambiar de jugadora */
  choose: (playerId: string) => void;
  /**
   * Entrar escribiendo un nombre (para quien no sea Nina, Jazmín o Natan).
   * Devuelve false si lo escrito no da un nombre usable, para que la pantalla
   * sepa que tiene que dejar el teclado abierto.
   */
  chooseByName: (name: string) => boolean;
  /** Volver al selector ("no soy yo") */
  clear: () => void;
  /** Nina, Jazmín y Natan */
  players: Player[];
  /** Visitas que ya estuvieron antes, para que no tengan que reescribir */
  guests: Player[];
}

export function useProfile(): ProfileState {
  // Si ya había alguien elegido, entra directo sin preguntar nada.
  const [arrival, setArrival] = useState<Arrival | null>(() => {
    const current = read<ProfileStore>(KEY, EMPTY).current;
    return current ? computeArrival(current) : null;
  });

  // Anotar la visita es sincronizar con un sistema externo (localStorage);
  // el saludo ya se calculó antes, así que acá no hay estado que actualizar.
  useEffect(() => {
    if (arrival) commitVisit(arrival.player.id);
  }, [arrival]);

  const choose = useCallback((playerId: string) => {
    setArrival(computeArrival(playerId));
  }, []);

  const chooseByName = useCallback((rawName: string): boolean => {
    const name = rawName.trim().replace(/\s+/g, ' ').slice(0, 14);
    const slug = slugify(name);
    if (!slug) return false; // sólo espacios o símbolos: no es un nombre

    // Si escribe "Nina", es Nina — no una visita nueva con el mismo nombre.
    const known = PLAYERS.find(p => p.name.toLowerCase() === name.toLowerCase());
    if (known) {
      setArrival(computeArrival(known.id));
      return true;
    }

    const id = GUEST_PREFIX + slug;
    registerGuest(id, name);
    setArrival(computeArrival(id));
    return true;
  }, []);

  const clear = useCallback(() => {
    forgetCurrent();
    setArrival(null);
  }, []);

  return {
    player: arrival?.player ?? null,
    arrival,
    choose,
    chooseByName,
    clear,
    players: PLAYERS,
    // Se lee en cada render: así una visita nueva aparece en el selector
    // apenas termina de escribir su nombre.
    guests: knownGuests(read<ProfileStore>(KEY, EMPTY)),
  };
}
