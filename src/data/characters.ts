/**
 * data/characters.ts
 *
 * Drop your images in  src/assets/images/  and Vite will resolve the imports.
 * File names expected:
 *   ciela.png  lunaria.png  nuve.png  nuveciela.png
 *   melli_amarilla.png  melli_celeste.png  natan_run0.png
 */

import type { Character, NewCharacter } from '../types';

import cielaImg     from '../assets/images/ciela.png';
import lunariaImg   from '../assets/images/lunaria.png';
import nuveImg      from '../assets/images/nuve.png';
import nuvecielaImg from '../assets/images/nuveciela.png';
import melliAImg    from '../assets/images/melli_amarilla.png';
import melliCImg    from '../assets/images/melli_celeste.png';
import natanImg     from '../assets/images/natan_run0.png';

export const CHARACTERS: Character[] = [
  {
    id: 'nuveciela',
    name: 'Nuveciela',
    emoji: '🌙',
    tagline: '¡Valiente y misteriosa!',
    description:
      'La guardiana de las noches estrelladas. Protege a sus amigas con su energía oscura y brillante.',
    power: 'Doble salto alto + lanza bolas de fuego 🔥',
    traits: ['Valiente', 'Misteriosa', 'Leal'],
    favorite: 'Estrellas fugaces',
    primaryColor: '#FF6B35',
    cardGradient: 'linear-gradient(145deg, #1a0030, #3d1a00 55%, #FF6B35)',
    textColor: '#FFB380',
    image: nuvecielaImg,
  },
  {
    id: 'nuve',
    name: 'Nuve',
    emoji: '⭐',
    tagline: '¡Curiosa y alegre!',
    description:
      'Siempre con una pregunta nueva. Aprende algo diferente cada día y lo comparte con una gran sonrisa.',
    power: 'Vuela con doble salto. Al aterrizar aturde enemigos 🎨',
    traits: ['Curiosa', 'Alegre', 'Amigable'],
    favorite: 'Descubrir secretos',
    primaryColor: '#FFB300',
    cardGradient: 'linear-gradient(145deg, #4a3500, #7a5a00 55%, #FFB300)',
    textColor: '#FFE066',
    image: nuveImg,
  },
  {
    id: 'lunaria',
    name: 'Lunaria',
    emoji: '✨',
    tagline: '¡Soñadora y mágica!',
    description:
      'Flota entre sueños y hace realidad los deseos de sus amigas con su magia arcoíris.',
    power: 'Mantener ↑ para flotar. Dispara rayos de sol ☀️',
    traits: ['Soñadora', 'Creativa', 'Mágica'],
    favorite: 'Atardeceres arcoíris',
    primaryColor: '#EC407A',
    cardGradient: 'linear-gradient(145deg, #3a0030, #6a0040 55%, #EC407A)',
    textColor: '#FFB3D4',
    image: lunariaImg,
  },
  {
    id: 'ciela',
    name: 'Ciela',
    emoji: '💧',
    tagline: '¡Libre y aventurera!',
    description:
      'Siempre lista para una nueva aventura. Corre más rápido que el viento y congela todo lo que toca.',
    power: 'Deslizamiento veloz. Dispara hielo ❄️ que congela enemigos',
    traits: ['Libre', 'Aventurera', 'Optimista'],
    favorite: 'Viajar lejos',
    primaryColor: '#26C6DA',
    cardGradient: 'linear-gradient(145deg, #003040, #004060 55%, #26C6DA)',
    textColor: '#80EEFF',
    image: cielaImg,
  },
];

export const NEW_CHARACTERS: NewCharacter[] = [
  {
    id: 'melli-amarilla',
    name: 'Melli ☀️',
    accentColor: '#FFD600',
    image: melliAImg,
    isPixelArt: true,
  },
  {
    id: 'melli-celeste',
    name: 'Melli 🩵',
    accentColor: '#26C6DA',
    image: melliCImg,
    isPixelArt: true,
  },
  {
    id: 'natan',
    name: 'Natan',
    accentColor: '#1565C0',
    image: natanImg,
    isPixelArt: true,
  },
];