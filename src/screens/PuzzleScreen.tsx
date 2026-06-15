import { useState } from 'react';
import { CHARACTERS } from '../data/characters';
import { playTap, playSuccess, playWin } from '../utils/audio';
import styles from './PuzzleScreen.module.css';

interface PuzzleScreenProps {
  onBack: () => void;
}

interface PuzzlePiece {
  id: number;      // Target position index (0 to 8)
  shuffledIdx: number; // Current position index in the 3x3 grid (0 to 8)
}

export function PuzzleScreen({ onBack }: PuzzleScreenProps) {
  const [selectedChar, setSelectedChar] = useState<typeof CHARACTERS[0] | null>(null);
  const [pieces, setPieces] = useState<PuzzlePiece[]>([]);
  const [selectedPieceIdx, setSelectedPieceIdx] = useState<number | null>(null);
  const [won, setWon] = useState(false);
  const [moves, setMoves] = useState(0);

  // Initialize and shuffle the puzzle
  function startPuzzle(character: typeof CHARACTERS[0]) {
    playTap();
    setSelectedChar(character);
    setWon(false);
    setMoves(0);
    setSelectedPieceIdx(null);

    // Create 9 pieces
    const initialPieces: PuzzlePiece[] = Array.from({ length: 9 }, (_, i) => ({
      id: i,
      shuffledIdx: i,
    }));

    // Shuffle until it's not solved
    let shuffled: PuzzlePiece[] = [];
    let isSolved = true;
    while (isSolved) {
      const positions = Array.from({ length: 9 }, (_, i) => i).sort(() => Math.random() - 0.5);
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

      // Swap the positions of the two pieces
      const newPieces = [...pieces];
      const temp = newPieces[selectedPieceIdx].shuffledIdx;
      newPieces[selectedPieceIdx].shuffledIdx = newPieces[index].shuffledIdx;
      newPieces[index].shuffledIdx = temp;

      setPieces(newPieces);
      setSelectedPieceIdx(null);
      setMoves(prev => prev + 1);

      // Check win condition
      const checkWin = newPieces.every(p => p.id === p.shuffledIdx);
      if (checkWin) {
        setWon(true);
        playWin();
      } else {
        playSuccess(); // Small confirmation sound
      }
    }
  }

  // Get background offset percentage for a 3x3 grid
  function getBgStyle(pieceId: number) {
    if (!selectedChar) return {};
    const col = pieceId % 3;
    const row = Math.floor(pieceId / 3);
    // col values: 0, 1, 2 map to 0%, 50%, 100%
    // row values: 0, 1, 2 map to 0%, 50%, 100%
    const xPos = col * 50;
    const yPos = row * 50;
    return {
      backgroundImage: `url(${selectedChar.image})`,
      backgroundSize: '300% 300%',
      backgroundPosition: `${xPos}% ${yPos}%`,
    };
  }

  // Sort pieces by current position in grid so we render them in grid order
  const sortedPiecesForRender = [...pieces].sort((a, b) => a.shuffledIdx - b.shuffledIdx);

  return (
    <main className={`nw-screen ${styles.screen}`}>
      {/* ─── Header ───────────────────────────────────────────────────────── */}
      <div className={styles.header}>
        <button
          className={styles.backBtn}
          onClick={() => {
            playTap();
            if (selectedChar) {
              setSelectedChar(null);
            } else {
              onBack();
            }
          }}
          aria-label={selectedChar ? "Volver a la selección" : "Volver a juegos"}
        >
          ← Volver
        </button>
        <h1 className={`nw-title ${styles.title}`}>👾 Reto Nuveciela</h1>
      </div>

      {!selectedChar ? (
        /* ─── Character Selection Screen ──────────────────────────────────── */
        <div className={styles.selectionContainer}>
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
            <span>Movimientos: <strong>{moves}</strong></span>
            <button
              className={styles.resetBtn}
              onClick={() => startPuzzle(selectedChar)}
              aria-label="Reiniciar rompecabezas"
            >
              ↺ Mezclar
            </button>
          </div>

          <div className={styles.boardWrapper}>
            <div className={styles.board} role="grid" aria-label="Tablero del rompecabezas">
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
                src={selectedChar.image}
                alt="Referencia"
                className={styles.referenceImg}
              />
            </div>
          </div>

          {/* ─── Win Overlay ────────────────────────────────────────────────── */}
          {won && (
            <div className={styles.winOverlay} role="status" aria-live="polite">
              <div className={styles.winTrophy}>⭐🎉</div>
              <h2 className={`nw-title ${styles.winTitle}`}>¡Completado!</h2>
              <p className={styles.winDesc}>
                Armaste el rompecabezas de <strong>{selectedChar.name}</strong> en {moves} movimientos.
              </p>
              <div className={styles.winActionRow}>
                <button
                  className={`nw-btn-secondary ${styles.winBtn}`}
                  onClick={() => setSelectedChar(null)}
                >
                  Cambiar Personaje 👯
                </button>
                <button
                  className={`nw-btn ${styles.winBtnPrimary}`}
                  onClick={() => startPuzzle(selectedChar)}
                >
                  Jugar otra vez 🔁
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </main>
  );
}
