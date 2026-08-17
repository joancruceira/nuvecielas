import { world } from './bridge';
import type { ScreenId } from '../types';

/**
 * Traduce lo que cada juego guardó a una línea que una nena entienda.
 *
 * Ojo con el reparto de responsabilidades: el hub NO sabe cómo se llaman los
 * niveles del Bosque ni cómo puntúa Atrapa las Estrellas. Cada juego guarda lo
 * suyo (incluido el nombre del nivel) y acá sólo se arma la frase.
 *
 * Devuelve null cuando todavía no hay nada: una tarjeta sin historia es mejor
 * que una que dice "0".
 */
function num(value: unknown): number | null {
  return typeof value === 'number' ? value : null;
}

/** Suma los `wins` de varios modos del mismo juego (fácil/normal/difícil…). */
function totalWins(playerId: string | null, gameIds: string[]): number {
  return gameIds.reduce(
    (total, id) => total + (num(world().gameState(id, playerId).wins) ?? 0),
    0,
  );
}

function plural(n: number, one: string, many: string): string {
  return n === 1 ? one : many;
}

export function progressLine(gameId: string, playerId: string | null): string | null {
  if (!playerId) return null;

  switch (gameId) {
    case 'bosque': {
      const state = world().gameState('bosque', playerId);
      const lastLevel = state.lastLevelName;
      if (typeof lastLevel === 'string' && lastLevel) return `Vas por ${lastLevel}`;
      const unlocked = num(state.unlocked);
      return unlocked && unlocked > 0 ? `Nivel ${unlocked + 1} desbloqueado` : null;
    }

    case 'stars': {
      const best = num(world().gameState('estrellas', playerId).best);
      return best ? `Tu récord: ${best} ⭐` : null;
    }

    case 'quiz': {
      const best = num(world().gameState('quiz', playerId).best);
      return best !== null ? `Tu récord: ${best} de 5` : null;
    }

    case 'memory': {
      const wins = totalWins(playerId, ['memory-facil', 'memory-normal', 'memory-dificil']);
      return wins ? `Ganaste ${wins} ${plural(wins, 'vez', 'veces')}` : null;
    }

    case 'puzzle': {
      const wins = totalWins(playerId, ['puzzle-3', 'puzzle-4']);
      return wins ? `Armaste ${wins} ${plural(wins, 'vez', 'veces')}` : null;
    }

    case 'colors': {
      const saved = num(world().gameState('pintar', playerId).saved);
      return saved ? `${saved} ${plural(saved, 'dibujo guardado', 'dibujos guardados')}` : null;
    }

    default:
      return null;
  }
}

/** A dónde lleva cada cosa que aparece en el diario. */
const DESTINATION: Record<string, { screen?: ScreenId; href?: string; title: string }> = {
  bosque: { href: '/bosque/index.html', title: 'Bosque Mágico' },
  estrellas: { screen: 'stars', title: 'Atrapa las Estrellas' },
  'memory-facil': { screen: 'memory', title: 'Memoria Mágica' },
  'memory-normal': { screen: 'memory', title: 'Memoria Mágica' },
  'memory-dificil': { screen: 'memory', title: 'Memoria Mágica' },
  quiz: { screen: 'quiz', title: 'Quiz Estelar' },
  'puzzle-3': { screen: 'puzzle', title: 'Reto Nuveciela' },
  'puzzle-4': { screen: 'puzzle', title: 'Reto Nuveciela' },
  pintar: { screen: 'colors', title: 'Pintá con Lunaria' },
};

/**
 * Lo último que estuvo jugando, para poder volver de un toque.
 * Ignora las anotaciones que no son de un juego (los deseos del Home).
 */
export function lastPlayed(playerId: string | null) {
  if (!playerId) return null;
  const entries = world().diary(playerId, 10);
  for (const entry of entries) {
    const destination = DESTINATION[entry.game];
    if (destination) return destination;
  }
  return null;
}
