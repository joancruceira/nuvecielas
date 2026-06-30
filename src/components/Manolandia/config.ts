/**
 * Personalidad de cada Nuveciela, expresada SOLO con parámetros de movimiento
 * (no hace falta IA ni frames nuevos: animamos los PNG existentes con transform).
 *
 * Cada personaje cicla respiración + bob + balanceo con tiempos distintos, y de
 * vez en cuando hace un "emote" (microgesto) en un intervalo aleatorio, para que
 * nunca parezcan robots sincronizados.
 */
export type EmoteKind = 'jump' | 'lookUp' | 'wiggle' | 'wave';

export interface Personality {
  /** Respiración (escala) */
  breatheDur: number; // s
  breatheScale: number;
  /** Bob (flotar arriba/abajo) */
  bobDur: number; // s
  bobDist: number; // px
  /** Balanceo (rotación suave) */
  swayDur: number; // s
  swayDeg: number;
  /** Microgesto ocasional y su rango de intervalo */
  emote: EmoteKind;
  emoteMin: number; // s
  emoteMax: number; // s
  /** Lunaria es la anfitriona del mundo */
  hostess?: boolean;
}

/** Claves = ids de CHARACTERS en src/data/characters.ts */
export const PERSONALITIES: Record<string, Personality> = {
  // Curiosa: mira alrededor, tranquila pero atenta.
  nuve: {
    breatheDur: 3.4, breatheScale: 1.02,
    bobDur: 3.0, bobDist: 5,
    swayDur: 4.6, swayDeg: 2.6,
    emote: 'lookUp', emoteMin: 6, emoteMax: 11,
  },
  // Energética: rebota mucho, sonríe.
  ciela: {
    breatheDur: 2.6, breatheScale: 1.035,
    bobDur: 1.9, bobDist: 9,
    swayDur: 3.2, swayDeg: 2.0,
    emote: 'jump', emoteMin: 4, emoteMax: 8,
  },
  // Tranquila: respira lento, mira el cielo, piensa. Anfitriona.
  lunaria: {
    breatheDur: 4.2, breatheScale: 1.015,
    bobDur: 4.0, bobDist: 4,
    swayDur: 6.0, swayDeg: 1.5,
    emote: 'lookUp', emoteMin: 7, emoteMax: 13,
    hostess: true,
  },
  // Dulce: serena, observa y saluda.
  nuveciela: {
    breatheDur: 3.6, breatheScale: 1.02,
    bobDur: 3.4, bobDist: 5,
    swayDur: 5.0, swayDeg: 2.0,
    emote: 'wave', emoteMin: 6, emoteMax: 12,
  },
};

export const DEFAULT_PERSONALITY: Personality = PERSONALITIES.nuve;

/** Frases cortas de la anfitriona (Lunaria). Cortas, cálidas, no bloqueantes. */
export const HOSTESS_PHRASES = [
  '¡Hola!',
  'Qué lindo verte.',
  'Hoy Manolandia está preciosa.',
  '¿Jugamos?',
] as const;

/** Random helper: número en [min, max). */
export function rand(min: number, max: number): number {
  return min + Math.random() * (max - min);
}
