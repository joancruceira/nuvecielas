/**
 * Puente tipado hacia `public/nuve-world.js`, el contrato que el hub comparte
 * con el Bosque Mágico y Atrapa las Estrellas.
 *
 * Acá NO hay lógica: sólo los tipos y el acceso. La implementación (claves,
 * formas, migración) vive en un único lugar, que es JS plano justamente para
 * que los dos juegos —que no tienen build— puedan usar el mismo archivo.
 *
 * Se carga con un <script> en index.html, antes del módulo de React.
 */

export interface WorldPlayer {
  id: string;
  name: string;
  emoji: string;
  color: string;
}

export interface WorldArrival {
  player: WorldPlayer;
  /** Nunca había entrado con este perfil */
  isFirstEver: boolean;
  /** Días desde la última visita. 0 = ya había entrado hoy */
  daysAway: number;
}

/** Bolsa libre: cada juego guarda lo que necesita. */
export type GameState = Record<string, unknown>;

interface NuveWorldApi {
  version: number;
  PLAYERS: WorldPlayer[];
  GUEST_PREFIX: string;

  currentPlayer(): WorldPlayer | null;
  currentPlayerId(): string | null;
  /** PURO: sólo lee. Hay que llamarlo antes de `setCurrentPlayer`. */
  arrivalFor(playerId: string): WorldArrival | null;
  /** Elige y anota la visita. Devuelve el saludo ya calculado. */
  setCurrentPlayer(playerId: string): WorldArrival | null;
  enterByName(name: string): WorldArrival | null;
  clearCurrentPlayer(): void;
  knownGuests(): WorldPlayer[];

  /** Estrellas fugaces atrapadas en el Home */
  wishes(playerId?: string | null): number;
  addWish(playerId?: string | null): number;

  gameState(gameId: string, playerId?: string | null): GameState;
  patchGameState(gameId: string, patch: GameState, playerId?: string | null): boolean;
  recordBest(
    gameId: string,
    field: string,
    value: number,
    better: 'lower' | 'higher',
    playerId?: string | null,
  ): boolean;

  legacy: {
    unlocked(): number;
    starsForLevel(idx: number): number;
    bestScore(): number;
  };

  slugify(name: string): string;
  cleanName(name: string): string;
  todayISO(date?: Date): string;
  daysBetween(fromISO: string, toISO: string): number;
}

declare global {
  interface Window {
    NuveWorld?: NuveWorldApi;
  }
}

/**
 * El hub no puede funcionar sin el contrato: si falta, algo está muy mal en el
 * deploy y es mejor un error claro que perder datos en silencio.
 */
export function world(): NuveWorldApi {
  const api = window.NuveWorld;
  if (!api) {
    throw new Error(
      'NuveWorld no está cargado. Falta <script src="/nuve-world.js"> en index.html.',
    );
  }
  return api;
}
