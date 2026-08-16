import type { TimeOfDay } from './useTimeOfDay';
import styles from './LivingWorld.module.css';

interface LivingWorldProps {
  /** Franja horaria actual; la decide quien monta el mundo. */
  tod: TimeOfDay;
}

/**
 * El cielo vivo de Manolandia detrás del launcher.
 * - Hora del día (reloj) → paleta del cielo, astro, estrellas.
 * - Vida ambiental mínima: nubes, una mariposa, un pajarito.
 *
 * Capa puramente decorativa: aria-hidden + pointer-events none. Lo que se puede
 * tocar (la estrella fugaz) vive fuera de acá, en `ShootingStar`.
 *
 * El parallax lo aplica la pantalla contenedora sobre sí misma: escribe
 * `--mx`/`--my`, que se heredan por CSS hasta acá y hasta los personajes. Así
 * hay un solo listener de puntero para todo el Home.
 */
export function LivingWorld({ tod }: LivingWorldProps) {
  return (
    <div className={styles.world} data-tod={tod} aria-hidden="true">
      {/* Cielo */}
      <div className={styles.sky} />

      {/* Estrellas (noche/atardecer) */}
      <div className={`${styles.layer} ${styles.starsLayer}`}>
        <div className={styles.stars} />
      </div>

      {/* Astro: sol / luna */}
      <div className={`${styles.layer} ${styles.celestialLayer}`}>
        <div className={styles.celestial} />
      </div>

      {/* Nubes lentas */}
      <div className={`${styles.layer} ${styles.cloudsLayer}`}>
        <div className={`${styles.cloud} ${styles.cloud1}`} />
        <div className={`${styles.cloud} ${styles.cloud2}`} />
        <div className={`${styles.cloud} ${styles.cloud3}`} />
      </div>

      {/* Pajarito */}
      <div className={`${styles.layer} ${styles.birdLayer}`}>
        <svg className={styles.bird} viewBox="0 0 22 14" fill="none">
          <path
            className={styles.birdWing}
            d="M1 8 Q6 1 11 7"
            stroke="rgba(255,255,255,0.9)"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <path
            className={styles.birdWing}
            d="M11 7 Q16 1 21 8"
            stroke="rgba(255,255,255,0.9)"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Mariposa */}
      <div className={`${styles.layer} ${styles.butterflyLayer}`}>
        <svg className={styles.butterfly} viewBox="0 0 26 26" fill="none">
          {/* alas izquierdas */}
          <g className={styles.wing}>
            <ellipse cx="8" cy="9" rx="6" ry="5" fill="#ffb3d4" opacity="0.9" />
            <ellipse cx="8" cy="17" rx="5" ry="4" fill="#ffd1a9" opacity="0.9" />
          </g>
          {/* alas derechas */}
          <g className={`${styles.wing} ${styles.wingR}`}>
            <ellipse cx="18" cy="9" rx="6" ry="5" fill="#c7b3ff" opacity="0.9" />
            <ellipse cx="18" cy="17" rx="5" ry="4" fill="#a9e7ff" opacity="0.9" />
          </g>
          {/* cuerpo */}
          <rect x="12.4" y="6" width="1.2" height="15" rx="0.6" fill="#5a4a7a" />
        </svg>
      </div>
    </div>
  );
}
