import type { ReactNode } from 'react';
import styles from './GameShell.module.css';

interface GameShellProps {
  /** Título del juego, con su emoji */
  title: string;
  onBack: () => void;
  /** Por defecto vuelve "a juegos"; el puzzle lo usa para volver a elegir personaje */
  backLabel?: string;
  children: ReactNode;
}

/**
 * El marco común de todos los mini-juegos.
 *
 * Antes cada pantalla se dibujaba su propio header y su propio "← Volver", con
 * tamaños y espaciados distintos: entrar a un juego se sentía como cambiar de
 * canal en vez de abrir otra puerta de la misma casa.
 *
 * Ojo con el sonido: el tap lo hace `App.navigate`, así que acá NO se llama a
 * `playTap` (si no, suena dos veces).
 */
export function GameShell({ title, onBack, backLabel, children }: GameShellProps) {
  return (
    <main className={`nw-screen ${styles.screen}`}>
      <div className={styles.header}>
        <button
          className={styles.backBtn}
          onClick={onBack}
          aria-label={backLabel ?? 'Volver a juegos'}
        >
          ← Volver
        </button>
        <h1 className={`nw-title ${styles.title}`}>{title}</h1>
      </div>

      {children}
    </main>
  );
}
