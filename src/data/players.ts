import type { Player } from '../types';

// Recortes chicos de la cara (128px, ~20 KB). Los sprites de cuerpo entero
// pesan 2,3 MB cada uno: no pueden cargarse en el launcher para dibujar un
// avatar de 34px.
import ninaAvatar from '../assets/images/melli_amarilla_avatar.png';
import jazminAvatar from '../assets/images/melli_celeste_avatar.png';
import natanAvatar from '../assets/images/natan_avatar.png';

/**
 * Quién puede estar del otro lado de la pantalla.
 *
 * Son tres hermanos compartiendo un dispositivo: guardar un solo nombre estaría
 * mal casi siempre. Cada uno tiene su propio progreso y su propia colección.
 *
 * Sumar a alguien es agregar una entrada más acá: todo lo demás (selector,
 * saludo, colección) es data-driven.
 */
export const PLAYERS: Player[] = [
  { id: 'nina', name: 'Nina', emoji: '☀️', color: '#FFD600', avatar: ninaAvatar },
  { id: 'jazmin', name: 'Jazmín', emoji: '🩵', color: '#26C6DA', avatar: jazminAvatar },
  { id: 'natan', name: 'Natan', emoji: '🦸', color: '#1565C0', avatar: natanAvatar },
];

export function playerById(id: string | null): Player | null {
  if (!id) return null;
  return PLAYERS.find(p => p.id === id) ?? null;
}
