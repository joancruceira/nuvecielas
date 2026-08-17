import ninaAvatar from '../assets/images/melli_amarilla_avatar.png';
import jazminAvatar from '../assets/images/melli_celeste_avatar.png';
import natanAvatar from '../assets/images/natan_avatar.png';

/**
 * Las caras de quienes viven en esta casa.
 *
 * El roster en sí (ids, nombres, colores) vive en `public/nuve-world.js`, para
 * que el Bosque Mágico y Atrapa las Estrellas también sepan que "Nina" es
 * `nina` y no una visita nueva que se llama igual. Los dibujos se quedan acá
 * porque tienen que pasar por el bundler.
 *
 * Son recortes de la cara (~30 KB). Los sprites de cuerpo entero pesan 2,3 MB
 * cada uno: no pueden cargarse en el launcher para dibujar un avatar de 34 px.
 *
 * Las visitas no tienen dibujo: usan su emoji.
 */
export const AVATARS: Record<string, string> = {
  nina: ninaAvatar,
  jazmin: jazminAvatar,
  natan: natanAvatar,
};
