import { CHARACTERS, NEW_CHARACTERS } from '../data/characters';
import { CharacterCard } from '../components/CharacterCard';
import { NewCharacterBadge } from '../components/NewCharacterBadge';
import styles from './CharactersScreen.module.css';

interface CharactersScreenProps {
  /** If set, that character card starts expanded */
  initialCharacterIndex?: number | null;
}

export function CharactersScreen({ initialCharacterIndex }: CharactersScreenProps) {
  return (
    <main className="nw-screen">
      <h1 className={`nw-title ${styles.heading}`}>👯 Conocé al grupo</h1>

      {/* ─── Main roster ──────────────────────────────────────────────────── */}
      <section aria-label="Personajes principales">
        {CHARACTERS.map((char, i) => (
          <CharacterCard
            key={char.id}
            character={char}
            index={i}
            initiallyExpanded={initialCharacterIndex === i}
          />
        ))}
      </section>

      {/* ─── Coming soon ──────────────────────────────────────────────────── */}
      <h2 className={`nw-title ${styles.comingSoonTitle}`}>💜 La familia detrás de Nuvecielas</h2>

      <section className={styles.comingSoonGrid} aria-label="Personajes próximamente">
        {NEW_CHARACTERS.map(char => (
          <NewCharacterBadge key={char.id} character={char} />
        ))}
      </section>
    </main>
  );
}
