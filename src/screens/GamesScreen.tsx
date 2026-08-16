import type { ScreenId } from '../types';
import { CHARACTERS } from '../data/characters';
import { GAMES, BOSQUE_MAGICO_URL } from '../data/games';
import { GameCard } from '../components/GameCard';
import styles from './GamesScreen.module.css';

interface GamesScreenProps {
  onNavigate: (screen: ScreenId) => void;
}

export function GamesScreen({ onNavigate }: GamesScreenProps) {
  return (
    <main className="nw-screen">
      <h1 className={`nw-title ${styles.heading}`}>🎮 Juegos</h1>

      {/* ─── Featured: platformer ─────────────────────────────────────────── */}
      <section className={styles.featured} aria-label="Aventura principal">
        <p className={styles.featuredTag}>🌿 Aventura principal</p>
        <h2 className={`nw-title ${styles.featuredTitle}`}>Bosque Mágico</h2>
        <p className={styles.featuredDesc}>
          4 niveles, 4 personajes con habilidades únicas. ¡Colectá estrellas y vencé al jefe final!
        </p>

        {/* Character thumbnails */}
        <div className={styles.thumbRow} aria-hidden="true">
          {CHARACTERS.map(char => (
            <img
              key={char.id}
              src={char.image}
              alt={char.name}
              className={styles.thumb}
            />
          ))}
        </div>

        <a
          href={BOSQUE_MAGICO_URL}
          className={`nw-btn ${styles.btnPlay}`}
        >
          ▶ ¡Jugar ahora!
        </a>
      </section>

      {/* ─── Mini-games grid ──────────────────────────────────────────────── */}
      <div className={styles.grid}>
        {GAMES.map(game => (
          <GameCard
            key={game.id}
            game={game}
            onClick={() => game.screenId && onNavigate(game.screenId)}
          />
        ))}
      </div>
    </main>
  );
}
