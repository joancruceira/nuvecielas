import type { GameEntry } from '../../types';
import styles from './GameCard.module.css';

interface GameCardProps {
  game: GameEntry;
  /** Por dónde va esta jugadora en este juego. Null = todavía no jugó. */
  progress?: string | null;
  onClick?: () => void;
}

export function GameCard({ game, progress, onClick }: GameCardProps) {
  const isDisabled = !game.available;

  return (
    <button
      className={`${styles.card} ${isDisabled ? styles.disabled : ''}`}
      onClick={!isDisabled ? onClick : undefined}
      disabled={isDisabled}
      aria-label={`${game.title} — ${progress ?? game.statusLabel}`}
    >
      <span className={styles.icon} aria-hidden="true">{game.icon}</span>
      <span className={`${styles.title} nw-title`}>{game.title}</span>
      {/* Lo que ya hizo pesa más que "✓ Disponible", que no le dice nada */}
      {progress ? (
        <span className={styles.progress}>{progress}</span>
      ) : (
        <span
          className={styles.status}
          style={{ color: game.available ? '#4CAF50' : undefined }}
        >
          {game.statusLabel}
        </span>
      )}
    </button>
  );
}
