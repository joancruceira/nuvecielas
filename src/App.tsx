import { useState } from 'react';
import type { ScreenId } from './types';

import { BottomNav } from './components/BottomNav';
import { HomeScreen } from './screens/HomeScreen';
import { CharactersScreen } from './screens/CharactersScreen';
import { GamesScreen } from './screens/GamesScreen';
import { MemoryGameScreen } from './screens/MemoryGameScreen';
import { GameFrameScreen } from './screens/GameFrameScreen';
import { PaintScreen } from './screens/PaintScreen';
import { QuizScreen } from './screens/QuizScreen';
import { PuzzleScreen } from './screens/PuzzleScreen';
import { EMBEDDED_GAMES } from './data/games';
import { playTap } from './utils/audio';
import './styles/theme.css';

/** Screens that hide the bottom nav */
const FULLSCREEN: ScreenId[] = ['memory', 'stars', 'colors', 'quiz', 'puzzle'];

export default function App() {
  const [screen, setScreen] = useState<ScreenId>('home');
  const [activeCharIdx, setActiveCharIdx] = useState<number | null>(null);

  /** Navigate to a screen, optionally resetting sub-state */
  function navigate(to: ScreenId) {
    playTap();
    if (to !== 'characters') setActiveCharIdx(null);
    setScreen(to);
  }

  /** Tap a character on HomeScreen → go to Characters with that card expanded */
  function openCharacter(index: number) {
    setActiveCharIdx(index);
    setScreen('characters');
  }

  return (
    <div className="nw-app">
      {/* ─── Screens ──────────────────────────────────────────────────────── */}
      {screen === 'home' && (
        <HomeScreen
          onNavigate={navigate}
          onCharacterClick={openCharacter}
        />
      )}

      {screen === 'characters' && (
        <CharactersScreen initialCharacterIndex={activeCharIdx} />
      )}

      {screen === 'games' && (
        <GamesScreen onNavigate={navigate} />
      )}

      {screen === 'memory' && (
        <MemoryGameScreen onBack={() => navigate('games')} />
      )}

      {screen === 'stars' && (
        <GameFrameScreen
          src={EMBEDDED_GAMES.stars.url}
          title={EMBEDDED_GAMES.stars.title}
          onBack={() => navigate('games')}
        />
      )}

      {screen === 'colors' && (
        <PaintScreen onBack={() => navigate('games')} />
      )}

      {screen === 'quiz' && (
        <QuizScreen onBack={() => navigate('games')} />
      )}

      {screen === 'puzzle' && (
        <PuzzleScreen onBack={() => navigate('games')} />
      )}

      {/* ─── Bottom nav ───────────────────────────────────────────────────── */}
      {!FULLSCREEN.includes(screen) && (
        <BottomNav current={screen} onChange={navigate} />
      )}
    </div>
  );
}