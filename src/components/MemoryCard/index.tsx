import type { MemoryCardData } from '../../types';
import styles from './MemoryCard.module.css';

interface MemoryCardProps {
  card: MemoryCardData;
  onClick: () => void;
}

export function MemoryCard({ card, onClick }: MemoryCardProps) {
  const isFlipped = card.flipped || card.matched;

  return (
    <div
      className={`${styles.wrapper} ${isFlipped ? styles.flipped : ''} ${card.matched ? styles.matched : ''}`}
      onClick={onClick}
      role="button"
      aria-label={isFlipped ? card.name : 'Carta boca abajo'}
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onClick()}
    >
      <div className={styles.inner}>
        {/* Front (hidden face) */}
        <div className={styles.front} aria-hidden="true">🌟</div>
        {/* Back (character face) */}
        <div className={styles.back}>
          <img
            className={styles.charImg}
            src={card.src}
            alt={card.name}
            draggable={false}
          />
        </div>
      </div>
    </div>
  );
}