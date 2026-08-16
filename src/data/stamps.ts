import nuveStamp from '../assets/images/stamps/nuve.png';
import cielaStamp from '../assets/images/stamps/ciela.png';
import lunariaStamp from '../assets/images/stamps/lunaria.png';
import nuvecielaStamp from '../assets/images/stamps/nuveciela.png';
import estrellariaStamp from '../assets/images/stamps/estrellaria.png';

export interface Stamp {
  id: string;
  name: string;
  src: string;
}

/**
 * Sellos para estampar en el dibujo.
 *
 * Son recortes chicos (~35 KB) del arte que ya existe, sin márgenes
 * transparentes, para que el sello caiga justo donde se toca. Los PNG grandes
 * de personaje pesan 200 KB cada uno: no tiene sentido bajarlos para estampar
 * una figurita.
 */
export const STAMPS: Stamp[] = [
  { id: 'nuve', name: 'Nuve', src: nuveStamp },
  { id: 'ciela', name: 'Ciela', src: cielaStamp },
  { id: 'lunaria', name: 'Lunaria', src: lunariaStamp },
  { id: 'nuveciela', name: 'Nuveciela', src: nuvecielaStamp },
  { id: 'estrellaria', name: 'Estrellaria', src: estrellariaStamp },
];
