import type { ScreenId } from '../types';
import { CHARACTERS } from '../data/characters';
import { BOSQUE_MAGICO_URL } from '../data/games';
import { playTap } from '../utils/audio';
import { LivingWorld, LivingCharacter } from '../components/Manolandia';
import styles from './HomeScreen.module.css';

interface HomeScreenProps {
  onNavigate: (screen: ScreenId) => void;
  onCharacterClick: (index: number) => void;
}

export function HomeScreen({ onNavigate, onCharacterClick }: HomeScreenProps) {
  return (
    <main className={`nw-screen ${styles.screen}`}>
      {/* ─── Manolandia viva (capa de fondo, no bloqueante) ────────────────── */}
      <LivingWorld />

      {/* ─── Contenido (por encima del mundo) ─────────────────────────────── */}
      <div className={styles.content}>
        <h1 className={`nw-title ${styles.heroTitle}`}>✨ Manolandia</h1>
        <p className={styles.heroSub}>El mundo mágico de las Nuvecielas</p>

        {/* Personajes vivos */}
        <div className={styles.grid}>
          {CHARACTERS.map((char, i) => (
            <LivingCharacter
              key={char.id}
              character={char}
              onOpen={() => onCharacterClick(i)}
            />
          ))}
        </div>

        {/* CTAs (navegación intacta) */}
        <a
          href={BOSQUE_MAGICO_URL}
          target="_blank"
          rel="noopener noreferrer"
          className={`nw-btn ${styles.btnPlay}`}
          onClick={() => playTap()}
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
      </div>
    </main>
  );
}
