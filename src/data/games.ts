import type { GameEntry } from '../types';

/*
 * Los tres juegos viven ahora en el MISMO origen, como rutas del hub:
 * el platformer y "Atrapa las Estrellas" entran como submódulos de git en
 * `public/`, y Vite los copia tal cual al build.
 *
 * No es un detalle de deploy: localStorage está aislado por origen, así que
 * mientras vivían en subdominios distintos el hub no podía enterarse de nada
 * de lo que pasaba adentro de ellos. Con un solo origen, la colección y el
 * perfil pueden ser de verdad compartidos.
 *
 * Las rutas llevan `index.html` explícito a propósito: GitHub Pages resuelve
 * `/estrellas/` solo, pero el dev server de Vite no —cae en el fallback del SPA
 * y sirve el hub—, así el mismo link funciona en los dos lados.
 */
export const EMBEDDED_GAMES = {
  stars: { title: 'Atrapa las Estrellas', url: '/estrellas/index.html' },
} as const;

export const GAMES: GameEntry[] = [
  {
    id: 'memory',
    title: 'Memoria Mágica',
    icon: '🃏',
    available: true,
    screenId: 'memory',
    statusLabel: '✓ Disponible',
  },
  {
    id: 'stars',
    title: 'Atrapa las Estrellas',
    icon: '⭐',
    available: true,
    screenId: 'stars',
    statusLabel: '✓ Disponible',
  },
  {
    id: 'quiz',
    title: 'Quiz Estelar',
    icon: '🧩',
    available: true,
    screenId: 'quiz',
    statusLabel: '✓ Disponible',
  },
  {
    id: 'colors',
    title: 'Pinta con Lunaria',
    icon: '🎨',
    available: true,
    screenId: 'colors',
    statusLabel: '✓ Disponible',
  },
  {
    id: 'puzzle',
    title: 'Reto Nuveciela',
    icon: '👾',
    available: true,
    screenId: 'puzzle',
    statusLabel: '✓ Disponible',
  },
];

/** Ruta del platformer (mismo origen — ver EMBEDDED_GAMES) */
export const BOSQUE_MAGICO_URL = '/bosque/index.html';