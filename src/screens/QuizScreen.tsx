import { useState } from 'react';
import { playTap, playSuccess, playError, playWin } from '../utils/audio';
import styles from './QuizScreen.module.css';

interface QuizScreenProps {
  onBack: () => void;
}

interface Question {
  id: number;
  text: string;
  options: string[];
  answer: string;
  hint: string;
}

const ALL_QUESTIONS: Question[] = [
  {
    id: 1,
    text: '¿Cuál es el poder especial de Nuveciela?',
    options: [
      'Doble salto alto + lanza bolas de fuego 🔥',
      'Mantener ↑ para flotar y disparar rayos de sol ☀️',
      'Deslizamiento veloz + dispara hielo ❄️',
      'Volar con doble salto y aturdir enemigos 🎨'
    ],
    answer: 'Doble salto alto + lanza bolas de fuego 🔥',
    hint: '¡Es la guardiana de las noches estrelladas con su energía brillante!'
  },
  {
    id: 2,
    text: '¿A quién le encanta viajar lejos y tiene un deslizamiento veloz?',
    options: ['Ciela 💧', 'Nuve ⭐', 'Lunaria ✨', 'Nuveciela 🌙'],
    answer: 'Ciela 💧',
    hint: 'Siempre lista para la aventura y congela todo lo que toca.'
  },
  {
    id: 3,
    text: '¿Cuál es el dulce o elemento favorito de Lunaria?',
    options: [
      'Atardeceres arcoíris 🌈',
      'Estrellas fugaces ☄️',
      'Descubrir secretos 🔍',
      'Viajar lejos ✈️'
    ],
    answer: 'Atardeceres arcoíris 🌈',
    hint: 'Flota entre sueños y hace realidad los deseos con magia arcoíris.'
  },
  {
    id: 4,
    text: '¿Qué personaje tiene como lema "¡Detallista, trabajadora y tranquila!"?',
    options: ['Nuve ⭐', 'Ciela 💧', 'Nuveciela 🌙', 'Super Natan 🟦'],
    answer: 'Nuve ⭐',
    hint: 'Siempre tiene una pregunta nueva y comparte todo con una sonrisa.'
  },
  {
    id: 5,
    text: '¿Quién es la inventora del grupo y tiene un color rosa brillante (#EC407A)?',
    options: ['Lunaria ✨', 'Nina ☀️', 'Ciela 💧', 'Nuveciela 🌙'],
    answer: 'Lunaria ✨',
    hint: 'Usa su magia arcoíris para hacer realidad los sueños.'
  },
  {
    id: 6,
    text: '¿Qué le fascina buscar y descubrir a Nuve?',
    options: [
      'Descubrir secretos 🗝️',
      'Estrellas fugaces ☄️',
      'Viajar lejos 🚢',
      'Pintar paredes 🎨'
    ],
    answer: 'Descubrir secretos 🗝️',
    hint: 'Aprende algo diferente cada día.'
  },
  {
    id: 7,
    text: '¿Qué poder especial tiene Ciela para detener enemigos?',
    options: [
      'Dispara hielo que congela enemigos ❄️',
      'Lanza bolas de fuego 🔥',
      'Dispara rayos de sol ☀️',
      'Aturde al aterrizar de un salto 💥'
    ],
    answer: 'Dispara hielo que congela enemigos ❄️',
    hint: 'Es sabia y rápida como el viento.'
  }
];

export function QuizScreen({ onBack }: QuizScreenProps) {
  const [questions, setQuestions] = useState<Question[]>(() => {
    return [...ALL_QUESTIONS].sort(() => 0.5 - Math.random()).slice(0, 5);
  });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  function handleOptionClick(option: string) {
    if (isAnswered) return;
    
    setSelectedOption(option);
    setIsAnswered(true);

    const currentQuestion = questions[currentIndex];
    const isCorrect = option === currentQuestion.answer;

    if (isCorrect) {
      playSuccess();
      setScore(prev => prev + 1);
    } else {
      playError();
    }

    // Advance after delay
    setTimeout(() => {
      if (currentIndex + 1 < questions.length) {
        setCurrentIndex(prev => prev + 1);
        setSelectedOption(null);
        setIsAnswered(false);
      } else {
        setShowResult(true);
        playWin();
      }
    }, 1600);
  }

  function handleRestart() {
    playTap();
    const shuffled = [...ALL_QUESTIONS].sort(() => 0.5 - Math.random());
    setQuestions(shuffled.slice(0, 5));
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setShowResult(false);
  }

  function getRankingLabel() {
    if (score === 5) return '👑 Guardiana Suprema de las Estrellas';
    if (score >= 4) return '✨ Sabia Nuveciela de Honor';
    if (score >= 2) return '🌟 Aprendiz Estelar Aventurera';
    return '🌱 Semilla de Nube en Crecimiento';
  }

  if (questions.length === 0) {
    return (
      <main className={`nw-screen ${styles.screen}`}>
        <p className={styles.loading}>Cargando preguntas mágicas...</p>
      </main>
    );
  }

  const currentQuestion = questions[currentIndex];

  return (
    <main className={`nw-screen ${styles.screen}`}>
      {/* ─── Header ───────────────────────────────────────────────────────── */}
      <div className={styles.header}>
        <button
          className={styles.backBtn}
          onClick={() => {
            playTap();
            onBack();
          }}
          aria-label="Volver a juegos"
        >
          ← Volver
        </button>
        <h1 className={`nw-title ${styles.title}`}>🧩 Quiz Estelar</h1>
      </div>

      {!showResult ? (
        <div className={styles.gameContainer}>
          {/* Progress bar */}
          <div className={styles.progress}>
            <span className={styles.progressText}>
              Pregunta <strong>{currentIndex + 1}</strong> de 5
            </span>
            <div className={styles.barOuter}>
              <div
                className={styles.barInner}
                style={{ width: `${((currentIndex + 1) / 5) * 100}%` }}
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
      ) : (
        /* ─── Result Dashboard ────────────────────────────────────────────── */
        <div className={styles.resultContainer}>
          <div className={styles.trophy}>🏆</div>
          <h2 className={`nw-title ${styles.resultTitle}`}>¡Quiz Completado!</h2>
          <p className={styles.resultRanking}>{getRankingLabel()}</p>
          <div className={styles.scoreCard}>
            <span className={styles.scoreNum}>{score}</span>
            <span className={styles.scoreDen}>/ 5</span>
            <p className={styles.scoreLabel}>Respuestas correctas</p>
          </div>
          <button className={`nw-btn ${styles.restartBtn}`} onClick={handleRestart}>
            Jugar de nuevo 🔁
          </button>
        </div>
      )}
    </main>
  );
}
