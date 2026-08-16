import nuve from '../assets/images/puzzle/nuve.jpg';
import ciela from '../assets/images/puzzle/ciela.jpg';
import lunaria from '../assets/images/puzzle/lunaria.jpg';
import nuveciela from '../assets/images/puzzle/nuveciela.jpg';
import estrellaria from '../assets/images/puzzle/estrellaria.jpg';

/**
 * Versiones cuadradas y recortadas para el rompecabezas.
 *
 * Los PNG de personaje tienen mucho margen transparente alrededor. En un
 * tablero de 3×3 casi no se nota, pero en 4×4 más de la mitad de las piezas
 * quedaban en blanco: sin nada que mirar, el juego deja de tener pistas y se
 * vuelve adivinanza. Estas están recortadas al personaje, en cuadrado (que es
 * la forma del tablero) y con fondo opaco.
 */
export const PUZZLE_IMAGES: Record<string, string> = {
  nuve,
  ciela,
  lunaria,
  nuveciela,
  estrellaria,
};

export function puzzleImageFor(characterId: string, fallback: string): string {
  return PUZZLE_IMAGES[characterId] ?? fallback;
}
