import { useMemoryGame } from '../hooks/useMemoryGame';
import { MemoryCard } from '../components/MemoryCard';
import styles from './MemoryGameScreen.module.css';

interface MemoryGameScreenProps {
  onBack: () => void;
}

export function MemoryGameScreen({ onBack }: MemoryGameScreenProps) {
  const { cards, moves, won, stars, flip, reset } = useMemoryGame();

  return (
    <main className={`nw-screen ${styles.screen}`}>
      {/* ─── Header ───────────────────────────────────────────────────────── */}
      <div className={styles.header}>
        <button className={styles.backBtn} onClick={onBack} aria-label="Volver a juegos">
          ← Volver
        </button>
        <h1 className={`nw-title ${styles.title}`}>🃏 Memoria Mágica</h1>
      </div>

      {/* ─── Stats bar ────────────────────────────────────────────────────── */}
      <div className={styles.statsBar}>
        <span>Movimientos: <strong>{moves}</strong></span>
        <button className={styles.resetBtn} onClick={reset} aria-label="Reiniciar partida">
          ↺ Reiniciar
        </button>
      </div>

      {/* ─── Board ────────────────────────────────────────────────────────── */}
      <div className={styles.board} role="grid" aria-label="Tablero de memoria">
        {cards.map((card, i) => (
          <MemoryCard key={card.id} card={card} onClick={() => flip(i)} />
        ))}
      </div>

      {/* ─── Win overlay ──────────────────────────────────────────────────── */}
      {won && (
        <div className={styles.winOverlay} role="status" aria-live="polite">
          <div className={styles.winTrophy}>🏆</div>
          <h2 className={`nw-title ${styles.winTitle}`}>¡Ganaste!</h2>
          <p className={styles.winStars}>{stars}</p>
          <p className={styles.winMoves}>en {moves} movimientos</p>
          <button
            className={`nw-btn ${styles.winBtn}`}
            onClick={reset}
          >
            Jugar de nuevo
          </button>
        </div>
      )}
    </main>
  );
}
