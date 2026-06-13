import type { GameEntry } from '../types';

export const EMBEDDED_GAMES = {

  stars: { title: 'Atrapa las Estrellas', url: 'https://stars.nuvecielas.com.ar' },
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
    available: false,
    statusLabel: '⏳ Próximamente',
  },
  {
    id: 'colors',
    title: 'Pinta con Lunaria',
    icon: '🎨',
    available: false,
    statusLabel: '⏳ Próximamente',
  },
  {
    id: 'puzzle',
    title: 'Reto Nuveciela',
    icon: '👾',
    available: false,
    statusLabel: '⏳ Próximamente',
  },
];

/** URL of the main platformer game */
export const BOSQUE_MAGICO_URL = 'https://nuvebosque.nuvecielas.com.ar';