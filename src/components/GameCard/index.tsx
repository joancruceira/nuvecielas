import type { GameEntry } from '../../types';
import styles from './GameCard.module.css';

interface GameCardProps {
  game: GameEntry;
  onClick?: () => void;
}

export function GameCard({ game, onClick }: GameCardProps) {
  const isDisabled = !game.available;

  return (
    <button
      className={`${styles.card} ${isDisabled ? styles.disabled : ''}`}
      onClick={!isDisabled ? onClick : undefined}
      disabled={isDisabled}
      aria-label={`${game.title} — ${game.statusLabel}`}
    >
      <span className={styles.icon} aria-hidden="true">{game.icon}</span>
      <span className={`${styles.title} nw-title`}>{game.title}</span>
      <span
        className={styles.status}
        style={{ color: game.available ? '#4CAF50' : undefined }}
      >
        {game.statusLabel}
      </span>
    </button>
  );
}
