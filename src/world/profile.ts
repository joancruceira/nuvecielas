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

/**
 * Cómo saludar a esta jugadora. Función PURA: solo lee. Tiene que ejecutarse
 * antes de `commitVisit`, porque una vez registrada la visita de hoy la última
 * visita anterior se pierde.
 */
function computeArrival(playerId: string): Arrival | null {
  const player = playerById(playerId);
  if (!player) return null;

  const record = read<ProfileStore>(KEY, EMPTY).players[playerId];
  return {
    player,
    isFirstEver: !record,
    daysAway: record ? daysBetween(record.lastVisit, todayISO()) : 0,
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
            firstVisit: record?.firstVisit ?? today,
            lastVisit: today,
            visits: (record?.visits ?? 0) + 1,
          },
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
  /** Volver al selector ("no soy yo") */
  clear: () => void;
  /** Todas las jugadoras disponibles */
  players: Player[];
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

  const clear = useCallback(() => {
    forgetCurrent();
    setArrival(null);
  }, []);

  return {
    player: arrival?.player ?? null,
    arrival,
    choose,
    clear,
    players: PLAYERS,
  };
}
