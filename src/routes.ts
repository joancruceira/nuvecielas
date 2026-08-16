import type { ScreenId } from './types';

/**
 * Rutas del hub. Cada pantalla tiene una URL propia (hash) para que:
 *  - el botón "atrás" del teléfono vuelva a la pantalla anterior en vez de
 *    salir del sitio,
 *  - se pueda recargar sin perder dónde estabas,
 *  - se pueda compartir el link de un juego.
 *
 * Hash (y no history API) porque el sitio se publica como estático en GitHub
 * Pages: no hay servidor que pueda resolver rutas reales.
 */
export const PATH_BY_SCREEN: Record<ScreenId, string> = {
  home: '/',
  characters: '/personajes',
  games: '/juegos',
  memory: '/memoria',
  stars: '/estrellas',
  colors: '/pintar',
  quiz: '/quiz',
  puzzle: '/puzzle',
};

const SCREEN_BY_PATH = Object.fromEntries(
  Object.entries(PATH_BY_SCREEN).map(([screen, path]) => [path, screen as ScreenId]),
) as Record<string, ScreenId>;

/** `#/juegos` → `'games'`. Cualquier cosa desconocida cae en `'home'`. */
export function screenFromHash(hash: string): ScreenId {
  const path = hash.replace(/^#/, '') || '/';
  return SCREEN_BY_PATH[path] ?? 'home';
}
