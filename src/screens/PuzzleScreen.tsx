import { useState, type CSSProperties } from 'react';
import { CHARACTERS } from '../data/characters';
import { puzzleImageFor } from '../data/puzzleImages';
import { GameShell } from '../components/GameShell';
import { Celebration } from '../components/Celebration';
import { useCurrentPlayer } from '../world/profile';
import { useGameStats } from '../world/collection';
import { playTap, playSuccess, playWin } from '../utils/audio';
import styles from './PuzzleScreen.module.css';

interface PuzzleScreenProps {
  onBack: () => void;
}

interface PuzzlePiece {
  id: number;      // Target position index (0 to 8)
  shuffledIdx: number; // Current position index in the 3x3 grid (0 to 8)
}

/** Lado del tablero. 3 = 9 piezas (chiquitas), 4 = 16 (bastante más difícil). */
const SIZES = [
  { n: 3, label: '3 × 3' },
  { n: 4, label: '4 × 4' },
] as const;

export function PuzzleScreen({ onBack }: PuzzleScreenProps) {
  const player = useCurrentPlayer();
  const [size, setSize] = useState(3);

  // Récord por tamaño: armar 16 piezas no compite con armar 9.
  const { stats, recordWin } = useGameStats(player?.id ?? null, `puzzle-${size}`, 'lower', 'Reto Nuveciela');

  const [selectedChar, setSelectedChar] = useState<typeof CHARACTERS[0] | null>(null);
  const [pieces, setPieces] = useState<PuzzlePiece[]>([]);
  const [selectedPieceIdx, setSelectedPieceIdx] = useState<number | null>(null);
  const [won, setWon] = useState(false);
  const [isRecord, setIsRecord] = useState(false);
  const [moves, setMoves] = useState(0);

  // Initialize and shuffle the puzzle
  function startPuzzle(character: typeof CHARACTERS[0]) {
    playTap();
    setSelectedChar(character);
    setWon(false);
    setIsRecord(false);
    setMoves(0);
    setSelectedPieceIdx(null);

    const total = size * size;
    const initialPieces: PuzzlePiece[] = Array.from({ length: total }, (_, i) => ({
      id: i,
      shuffledIdx: i,
    }));

    // Shuffle until it's not solved
    let shuffled: PuzzlePiece[] = [];
    let isSolved = true;
    while (isSolved) {
      const positions = Array.from({ length: total }, (_, i) => i).sort(() => Math.random() - 0.5);
      shuffled = initialPieces.map((piece, idx) => ({
        ...piece,
        shuffledIdx: positions[idx],
      }));
      isSolved = shuffled.every(p => p.id === p.shuffledIdx);
    }

    setPieces(shuffled);
  }

  function handleTileClick(index: number) {
    if (won) return;

    if (selectedPieceIdx === null) {
      playTap();
      setSelectedPieceIdx(index);
    } else {
      // If clicking the same tile, deselect it
      if (selectedPieceIdx === index) {
        playTap();
        setSelectedPieceIdx(null);
        return;
      }

      // Intercambiar las dos piezas. Se crean objetos nuevos en vez de mutar
      // los del estado: `[...pieces]` copia el array, pero no lo de adentro.
      const a = pieces[selectedPieceIdx];
      const b = pieces[index];
      const newPieces = pieces.map(p => {
        if (p.id === a.id) return { ...p, shuffledIdx: b.shuffledIdx };
        if (p.id === b.id) return { ...p, shuffledIdx: a.shuffledIdx };
        return p;
      });

      const nextMoves = moves + 1;
      setPieces(newPieces);
      setSelectedPieceIdx(null);
      setMoves(nextMoves);

      // Check win condition
      if (newPieces.every(p => p.id === p.shuffledIdx)) {
        setWon(true);
        setIsRecord(recordWin(nextMoves));
        playWin();
      } else {
        playSuccess(); // Small confirmation sound
      }
    }
  }

  /**
   * Qué trozo de la imagen le toca a cada pieza, para un tablero de N×N.
   * Con background-position en %, la columna k de N se ubica en k/(N-1) del
   * recorrido: 3 columnas → 0/50/100 %, 4 columnas → 0/33/66/100 %.
   */
  function getBgStyle(pieceId: number) {
    if (!selectedChar) return {};
    const col = pieceId % size;
    const row = Math.floor(pieceId / size);
    const step = 100 / (size - 1);
    return {
      backgroundImage: `url(${puzzleImageFor(selectedChar.id, selectedChar.image)})`,
      backgroundSize: `${size * 100}% ${size * 100}%`,
      backgroundPosition: `${col * step}% ${row * step}%`,
    };
  }

  // Sort pieces by current position in grid so we render them in grid order
  const sortedPiecesForRender = [...pieces].sort((a, b) => a.shuffledIdx - b.shuffledIdx);

  return (
    <GameShell
      title="👾 Reto Nuveciela"
      backLabel={selectedChar ? 'Volver a la selección' : 'Volver a juegos'}
      onBack={() => {
        if (selectedChar) {
          // Transición interna: acá el tap no lo hace App.navigate
          playTap();
          setSelectedChar(null);
        } else {
          onBack();
        }
      }}
    >
      {!selectedChar ? (
        /* ─── Character Selection Screen ──────────────────────────────────── */
        <div className={styles.selectionContainer}>
          <div className={styles.sizes} role="group" aria-label="Tamaño del tablero">
            {SIZES.map(s => (
              <button
                key={s.n}
                className={`${styles.size} ${s.n === size ? styles.sizeActive : ''}`}
                onClick={() => { playTap(); setSize(s.n); }}
              >
                {s.label}
              </button>
            ))}
          </div>

          <p className={styles.subtitle}>Elige una amiga para armar su rompecabezas:</p>
          <div className={styles.charList}>
            {CHARACTERS.map(char => (
              <button
                key={char.id}
                className={styles.charSelectBtn}
                style={{ background: char.cardGradient }}
                onClick={() => startPuzzle(char)}
              >
                <img src={char.image} alt={char.name} className={styles.charSelectImg} />
                <span className={styles.charSelectName} style={{ color: char.textColor }}>
                  {char.emoji} {char.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        /* ─── Active Puzzle Board ─────────────────────────────────────────── */
        <div className={styles.gameContainer}>
          <div className={styles.statsBar}>
            <span>
              Movimientos: <strong>{moves}</strong>
              {stats.best !== null && (
                <span className={styles.best}> · récord {stats.best}</span>
              )}
            </span>
            <button
              className={styles.resetBtn}
              onClick={() => startPuzzle(selectedChar)}
              aria-label="Reiniciar rompecabezas"
            >
              ↺ Mezclar
            </button>
          </div>

          <div className={styles.boardWrapper}>
            <div
              className={styles.board}
              role="grid"
              aria-label="Tablero del rompecabezas"
              style={{ '--n': size } as CSSProperties}
            >
              {sortedPiecesForRender.map((piece, gridIndex) => {
                // Find index of this piece in the unsorted pieces array to swap it
                const actualIndexInState = pieces.findIndex(p => p.id === piece.id);
                const isSelected = selectedPieceIdx === actualIndexInState;

                return (
                  <button
                    key={piece.id}
                    className={`${styles.tile} ${isSelected ? styles.tileSelected : ''}`}
                    style={getBgStyle(piece.id)}
                    onClick={() => handleTileClick(actualIndexInState)}
                    aria-label={`Pieza ${piece.id + 1} en posición ${gridIndex + 1}`}
                  />
                );
              })}
            </div>

            {/* Reference Image Thumbnail */}
            <div className={styles.referenceContainer}>
              <p className={styles.referenceLabel}>Guía de ayuda:</p>
              <img
                src={puzzleImageFor(selectedChar.id, selectedChar.image)}
                alt="Referencia"
                className={styles.referenceImg}
              />
            </div>
          </div>

        </div>
      )}

      {/* ─── Victoria ─────────────────────────────────────────────────────────
          Va suelta dentro del GameShell (y no del contenedor del juego) para
          que el overlay cubra la pantalla entera y no quede encajonado. */}
      {won && selectedChar && (
        <Celebration
          /* Te felicita justamente la amiga que acabás de armar */
          characterId={selectedChar.id}
          playerName={player?.name ?? null}
          title="¡Completado!"
          isRecord={isRecord}
          stats={<span>Armaste a {selectedChar.name} en {moves} movimientos</span>}
        >
          <button
            className="nw-btn nw-btn-primary"
            onClick={() => startPuzzle(selectedChar)}
          >
            Jugar otra vez 🔁
          </button>
          <button
            className="nw-btn-secondary"
            onClick={() => {
              playTap();
              setSelectedChar(null);
            }}
          >
            Cambiar personaje 👯
          </button>
        </Celebration>
      )}
    </GameShell>
  );
}
