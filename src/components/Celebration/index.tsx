import { useMemo, type ReactNode } from 'react';
import { CHARACTERS } from '../../data/characters';
import { winLine } from '../../world/voice';
import styles from './Celebration.module.css';

interface CelebrationProps {
  /** Quién felicita (id de CHARACTERS) */
  characterId: string;
  /** Nombre de quien jugó, si eligió perfil */
  playerName: string | null;
  title: string;
  /** Fue récord personal: cambia lo que dice y muestra la medalla */
  isRecord?: boolean;
  /** Resultado del juego: estrellas, movimientos, puntaje… */
  stats?: ReactNode;
  /** Botones de acción */
  children: ReactNode;
}

/**
 * La celebración compartida por todos los mini-juegos.
 *
 * Antes cada juego terminaba con un 🏆 y un texto de interfaz: ganabas y el
 * mundo no se enteraba. Acá gana una amiga con vos — te felicita por tu nombre,
 * con su voz y su color.
 */
export function Celebration({
  characterId,
  playerName,
  title,
  isRecord = false,
  stats,
  children,
}: CelebrationProps) {
  const character = CHARACTERS.find(c => c.id === characterId) ?? CHARACTERS[0];

  // Una sola vez por victoria: si se recalculara en cada render, la frase
  // cambiaría sola mientras la nena la está leyendo.
  const line = useMemo(
    () => winLine(character.id, playerName, isRecord),
    [character.id, playerName, isRecord],
  );

  return (
    <div
      className={styles.overlay}
      role="status"
      aria-live="polite"
      style={{ '--accent': character.primaryColor } as React.CSSProperties}
    >
      <div className={styles.friend}>
        <img src={character.image} alt={character.name} className={styles.img} />
        <p className={styles.bubble}>{line}</p>
      </div>

      <h2 className={`nw-title ${styles.title}`}>{title}</h2>

      {isRecord && <p className={styles.record}>🏅 Tu mejor marca</p>}
      {stats && <div className={styles.stats}>{stats}</div>}

      <div className={styles.actions}>{children}</div>
    </div>
  );
}
