import { useState } from 'react';
import type { Character } from '../../types';
import { playTap } from '../../utils/audio';
import styles from './CharacterCard.module.css';

interface CharacterCardProps {
  character: Character;
  /** Index used to stagger the slide-up animation delay */
  index?: number;
  /** Start expanded (e.g. when navigating here by tapping a char on HomeScreen) */
  initiallyExpanded?: boolean;
}

export function CharacterCard({
  character: c,
  index = 0,
  initiallyExpanded = false,
}: CharacterCardProps) {
  const [expanded, setExpanded] = useState(initiallyExpanded);

  return (
    <article
      className={styles.card}
      style={{
        background: c.cardGradient,
        color: c.textColor,
        animationDelay: `${index * 0.08}s`,
      }}
      onClick={() => {
        playTap();
        setExpanded(prev => !prev);
      }}
      role="button"
      aria-expanded={expanded}
      tabIndex={0}
      onKeyDown={e => {
        if (e.key === 'Enter') {
          playTap();
          setExpanded(prev => !prev);
        }
      }}
    >
      {/* ─── Main row ─────────────────────────────────────────────────────── */}
      <div className={styles.row}>
        <img
          src={c.image}
          alt={c.name}
          className={styles.portrait}
          loading="lazy"
        />

        <div className={styles.body}>
          <div>
            <h2 className={`${styles.name} nw-title`}>
              {c.emoji} {c.name}
            </h2>
            <p className={styles.tagline}>{c.tagline}</p>
            <p
              className={styles.power}
              style={{ background: 'rgba(0 0 0 / 0.25)', color: 'rgba(255 255 255 / 0.9)' }}
            >
              💥 {c.power}
            </p>
          </div>

          <ul className={styles.traits}>
            {c.traits.map(trait => (
              <li key={trait} className={styles.trait}>
                {trait}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ─── Expanded detail ──────────────────────────────────────────────── */}
      {expanded && (
        <div className={styles.detail}>
          <p className={styles.description}>{c.description}</p>
          <p className={styles.favorite}>💕 Favorito: {c.favorite}</p>
        </div>
      )}
    </article>
  );
}
