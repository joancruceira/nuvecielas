import { useCallback, useEffect, useState } from 'react';
import type { Player } from '../types';
import { AVATARS } from '../data/players';
import { world, type WorldArrival, type WorldPlayer } from './bridge';

/**
 * Quién está del otro lado de la pantalla.
 *
 * Toda la lógica (quiénes son, cómo se guardan, cómo se saluda) vive en
 * `public/nuve-world.js`, compartida con el Bosque Mágico y Atrapa las
 * Estrellas. Este archivo es sólo la capa de React encima.
 *
 * Los dibujos se pegan acá y no allá porque tienen que pasar por el bundler.
 */
function withAvatar(player: WorldPlayer): Player {
  return { ...player, avatar: AVATARS[player.id] };
}

export interface Arrival {
  player: Player;
  /** Nunca había entrado con este perfil */
  isFirstEver: boolean;
  /** Días desde la última visita. 0 = ya había entrado hoy */
  daysAway: number;
}

function toArrival(arrival: WorldArrival | null): Arrival | null {
  return arrival ? { ...arrival, player: withAvatar(arrival.player) } : null;
}

/**
 * Quién está jugando ahora, sin la ceremonia de llegada.
 * Lo usan los juegos del hub: necesitan saber de quién es el récord, pero no
 * tienen que saludar ni contar visitas (de eso se ocupa el Home).
 */
export function useCurrentPlayer(): Player | null {
  const player = world().currentPlayer();
  return player ? withAvatar(player) : null;
}

export interface ProfileState {
  player: Player | null;
  /** Cómo saludarla en esta sesión (estable mientras no cambie de perfil) */
  arrival: Arrival | null;
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
  // El inicializador es PURO: `arrivalFor` sólo lee.
  const [arrival, setArrival] = useState<Arrival | null>(() => {
    const id = world().currentPlayerId();
    return id ? toArrival(world().arrivalFor(id)) : null;
  });

  // Anotar la visita es sincronizar con un sistema externo (localStorage); el
  // saludo ya se calculó antes, así que acá no hay estado que actualizar.
  // Volver a llamarlo es inofensivo: nuve-world cuenta una visita por sesión.
  useEffect(() => {
    if (arrival) world().setCurrentPlayer(arrival.player.id);
  }, [arrival]);

  const choose = useCallback((playerId: string) => {
    setArrival(toArrival(world().arrivalFor(playerId)));
  }, []);

  const chooseByName = useCallback((name: string): boolean => {
    const arrived = world().enterByName(name);
    if (!arrived) return false;
    setArrival(toArrival(arrived));
    return true;
  }, []);

  const clear = useCallback(() => {
    world().clearCurrentPlayer();
    setArrival(null);
  }, []);

  return {
    player: arrival?.player ?? null,
    arrival,
    choose,
    chooseByName,
    clear,
    players: world().PLAYERS.map(withAvatar),
    // Se lee en cada render: así una visita nueva aparece en el selector
    // apenas termina de escribir su nombre.
    guests: world().knownGuests().map(withAvatar),
  };
}
