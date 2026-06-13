import type { NewCharacter } from '../../types';
import styles from './NewCharacterBadge.module.css';

interface NewCharacterBadgeProps {
  character: NewCharacter;
}

export function NewCharacterBadge({ character: c }: NewCharacterBadgeProps) {
  return (
    <div className={styles.badge} style={{ borderColor: `${c.accentColor}33` }}>
      <span className={styles.pill}>PRONTO</span>
      <img
        src={c.image}
        alt={c.name}
        className={`${styles.img} ${c.isPixelArt ? styles.pixelArt : ''}`}
      />
      <span className={styles.name} style={{ color: c.accentColor }}>
        {c.name}
      </span>
    </div>
  );
}
