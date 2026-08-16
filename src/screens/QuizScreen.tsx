import { useState } from 'react';
import { ALL_QUESTIONS, type Question } from '../data/quiz';
import { GameShell } from '../components/GameShell';
import { Celebration } from '../components/Celebration';
import { useCurrentPlayer } from '../world/profile';
import { useGameStats } from '../world/collection';
import { HOST_BY_GAME } from '../world/voice';
import { playTap, playSuccess, playError, playWin } from '../utils/audio';
import styles from './QuizScreen.module.css';

interface QuizScreenProps {
  onBack: () => void;
}

const ROUND_SIZE = 5;

function drawRound(): Question[] {
  return [...ALL_QUESTIONS].sort(() => 0.5 - Math.random()).slice(0, ROUND_SIZE);
}

export function QuizScreen({ onBack }: QuizScreenProps) {
  const player = useCurrentPlayer();
  const { stats, recordWin } = useGameStats(player?.id ?? null, 'quiz', 'higher');

  const [questions, setQuestions] = useState<Question[]>(drawRound);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isRecord, setIsRecord] = useState(false);

  function handleOptionClick(option: string) {
    if (isAnswered) return;

    setSelectedOption(option);
    setIsAnswered(true);

    const isCorrect = option === questions[currentIndex].answer;
    const nextScore = isCorrect ? score + 1 : score;

    if (isCorrect) {
      playSuccess();
      setScore(nextScore);
    } else {
      playError();
    }

    setTimeout(() => {
      if (currentIndex + 1 < questions.length) {
        setCurrentIndex(prev => prev + 1);
        setSelectedOption(null);
        setIsAnswered(false);
      } else {
        setIsRecord(recordWin(nextScore));
        setShowResult(true);
        playWin();
      }
    }, 1600);
  }

  function handleRestart() {
    playTap();
    setQuestions(drawRound());
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setShowResult(false);
    setIsRecord(false);
  }

  function getRankingLabel() {
    if (score === ROUND_SIZE) return '👑 Guardiana Suprema de las Estrellas';
    if (score >= 4) return '✨ Sabia Nuveciela de Honor';
    if (score >= 2) return '🌟 Aprendiz Estelar Aventurera';
    return '🌱 Semilla de Nube en Crecimiento';
  }

  const currentQuestion = questions[currentIndex];

  return (
    <GameShell title="🧩 Quiz Estelar" onBack={onBack}>
      <div className={styles.gameContainer}>
        {/* Progress bar */}
        <div className={styles.progress}>
          <span className={styles.progressText}>
            Pregunta <strong>{currentIndex + 1}</strong> de {ROUND_SIZE}
            {stats.best !== null && (
              <span className={styles.best}> · récord {stats.best}/{ROUND_SIZE}</span>
            )}
          </span>
          <div className={styles.barOuter}>
            <div
              className={styles.barInner}
              style={{ width: `${((currentIndex + 1) / ROUND_SIZE) * 100}%` }}
            />
          </div>
        </div>

        {/* Question Text */}
        <div className={styles.card}>
          <h2 className={styles.questionText}>{currentQuestion.text}</h2>
        </div>

        {/* Options Grid */}
        <div className={styles.optionsGrid}>
          {currentQuestion.options.map(option => {
            let btnClass = styles.optionBtn;
            if (isAnswered) {
              if (option === currentQuestion.answer) {
                btnClass += ` ${styles.correct}`;
              } else if (option === selectedOption) {
                btnClass += ` ${styles.incorrect}`;
              } else {
                btnClass += ` ${styles.disabled}`;
              }
            }

            return (
              <button
                key={option}
                className={btnClass}
                onClick={() => handleOptionClick(option)}
                disabled={isAnswered}
              >
                {option}
              </button>
            );
          })}
        </div>

        {/* Mini Hint */}
        <p className={styles.hintText}>
          💡 <em>{currentQuestion.hint}</em>
        </p>
      </div>

      {/* ─── Resultado ──────────────────────────────────────────────────────── */}
      {showResult && (
        <Celebration
          characterId={HOST_BY_GAME.quiz}
          playerName={player?.name ?? null}
          title="¡Quiz completado!"
          isRecord={isRecord}
          stats={
            <>
              <span className={styles.resultRanking}>{getRankingLabel()}</span>
              <span>
                <strong className={styles.scoreNum}>{score}</strong> de {ROUND_SIZE} correctas
              </span>
            </>
          }
        >
          <button className="nw-btn nw-btn-primary" onClick={handleRestart}>
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
