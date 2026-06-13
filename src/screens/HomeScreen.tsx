import type { ScreenId } from '../types';
import { CHARACTERS } from '../data/characters';
import { BOSQUE_MAGICO_URL } from '../data/games';
import styles from './HomeScreen.module.css';

const FLOAT_ANIMS = ['nw-float-0', 'nw-float-1', 'nw-float-2', 'nw-float-3'] as const;

interface HomeScreenProps {
  onNavigate: (screen: ScreenId) => void;
  onCharacterClick: (index: number) => void;
}

export function HomeScreen({ onNavigate, onCharacterClick }: HomeScreenProps) {
  return (
    <main className={`nw-screen ${styles.screen}`}>
      {/* ─── Hero title ───────────────────────────────────────────────────── */}
      <h1 className={`nw-title ${styles.heroTitle}`}>✨ Nuve World</h1>
      <p className={styles.heroSub}>El mundo mágico de las Nuvecielas</p>

      {/* ─── Character grid ───────────────────────────────────────────────── */}
      <div className={styles.grid}>
        {CHARACTERS.map((char, i) => (
          <button
            key={char.id}
            className={styles.charTile}
            style={{ animationName: FLOAT_ANIMS[i], animationDelay: `${i * 0.4}s` }}
            onClick={() => onCharacterClick(i)}
            aria-label={`Ver ${char.name}`}
          >
            <img src={char.image} alt={char.name} className={styles.charImg} />
            <div className={styles.charLabel} style={{ color: char.textColor }}>
              {char.emoji} {char.name}
            </div>
          </button>
        ))}
      </div>

      {/* ─── CTAs ─────────────────────────────────────────────────────────── */}
      <a
        href={BOSQUE_MAGICO_URL}
        target="_blank"
        rel="noopener noreferrer"
        className={`nw-btn ${styles.btnPlay}`}
      >
        🎮 ¡Jugar al Bosque Mágico!
      </a>

      <button
        className="nw-btn-secondary"
        onClick={() => onNavigate('games')}
        style={{ marginTop: 10 }}
      >
        🃏 Mini-juegos
      </button>
    </main>
  );
}
