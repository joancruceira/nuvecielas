import { useCallback, useEffect, useState } from 'react';
import { useMemoryGame, LEVELS, type LevelId } from '../hooks/useMemoryGame';
import { MemoryCard } from '../components/MemoryCard';
import { GameShell } from '../components/GameShell';
import { Celebration } from '../components/Celebration';
import { useCurrentPlayer } from '../world/profile';
import { useGameStats } from '../world/collection';
import { HOST_BY_GAME } from '../world/voice';
import { playTap } from '../utils/audio';
import styles from './MemoryGameScreen.module.css';

interface MemoryGameScreenProps {
  onBack: () => void;
}

export function MemoryGameScreen({ onBack }: MemoryGameScreenProps) {
  const player = useCurrentPlayer();
  const [level, setLevel] = useState<LevelId>('normal');
  const pairs = LEVELS.find(l => l.id === level)!.pairs;

  // El récord es por nivel: 4 pares y 8 pares no compiten entre sí.
  const { stats, recordWin } = useGameStats(player?.id ?? null, `memory-${level}`, 'lower');
  const [isRecord, setIsRecord] = useState(false);

  const handleWin = useCallback(
    (finalMoves: number) => setIsRecord(recordWin(finalMoves)),
    [recordWin],
  );

  const { cards, moves, won, stars, flip, reset } = useMemoryGame(pairs, handleWin);

  // Cambiar de nivel reparte de nuevo.
  useEffect(() => {
    reset();
  }, [level, reset]);

  function playAgain() {
    setIsRecord(false);
    reset();
  }

  function changeLevel(next: LevelId) {
    playTap();
    setIsRecord(false);
    setLevel(next);
  }

  return (
    <GameShell title="🃏 Memoria Mágica" onBack={onBack}>
      {/* ─── Nivel ────────────────────────────────────────────────────────── */}
      <div className={styles.levels} role="group" aria-label="Dificultad">
        {LEVELS.map(l => (
          <button
            key={l.id}
            className={`${styles.level} ${l.id === level ? styles.levelActive : ''}`}
            onClick={() => changeLevel(l.id)}
          >
            {l.label}
          </button>
        ))}
      </div>

      {/* ─── Stats bar ────────────────────────────────────────────────────── */}
      <div className={styles.statsBar}>
        <span>
          Movimientos: <strong>{moves}</strong>
          {stats.best !== null && (
            <span className={styles.best}> · récord {stats.best}</span>
          )}
        </span>
        <button className={styles.resetBtn} onClick={playAgain} aria-label="Reiniciar partida">
          ↺ Reiniciar
        </button>
      </div>

      {/* ─── Board ────────────────────────────────────────────────────────── */}
      <div className={styles.board} role="grid" aria-label="Tablero de memoria">
        {cards.map((card, i) => (
          <MemoryCard key={card.id} card={card} onClick={() => flip(i)} />
        ))}
      </div>

      {/* ─── Victoria ─────────────────────────────────────────────────────── */}
      {won && (
        <Celebration
          characterId={HOST_BY_GAME.memory}
          playerName={player?.name ?? null}
          title="¡Ganaste!"
          isRecord={isRecord}
          stats={
            <>
              <span className={styles.winStars}>{stars}</span>
              <span>en {moves} movimientos</span>
            </>
          }
        >
          <button className="nw-btn nw-btn-primary" onClick={playAgain}>
            Jugar de nuevo 🔁
          </button>
          <button className="nw-btn-secondary" onClick={onBack}>
            Volver a juegos
          </button>
        </Celebration>
      )}
    </GameShell>
  );
}
