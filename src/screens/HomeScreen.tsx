import { useCallback, useEffect, useMemo, useState, type CSSProperties } from 'react';
import type { ScreenId } from '../types';
import { CHARACTERS } from '../data/characters';
import { BOSQUE_MAGICO_URL } from '../data/games';
import { playTap, playWish } from '../utils/audio';
import { useReducedMotion } from '../hooks/useReducedMotion';
import {
  LivingWorld,
  LivingCharacter,
  ShootingStar,
  useParallax,
  useTimeOfDay,
} from '../components/Manolandia';
import { useProfile } from '../world/profile';
import { useWishes } from '../world/collection';
import { hostessPhrases, pick, WISH_CAUGHT } from '../world/voice';
import styles from './HomeScreen.module.css';

interface HomeScreenProps {
  onNavigate: (screen: ScreenId) => void;
  onCharacterClick: (index: number) => void;
}

interface Toast {
  id: number;
  text: string;
}

export function HomeScreen({ onNavigate, onCharacterClick }: HomeScreenProps) {
  const reduced = useReducedMotion();
  const tod = useTimeOfDay();

  // Un solo listener de puntero para todo el Home: escribe --mx/--my acá y las
  // heredan por CSS tanto el cielo como los personajes.
  const worldRef = useParallax<HTMLElement>(!reduced);

  const { player, arrival, choose, clear, players } = useProfile();
  const { wishes, addWish } = useWishes(player?.id ?? null);

  /** "Después": no insistir con el selector durante esta sesión. */
  const [askLater, setAskLater] = useState(false);
  const [toast, setToast] = useState<Toast | null>(null);

  const phrases = useMemo(() => hostessPhrases(arrival, tod), [arrival, tod]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 2600);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const handleCatchStar = useCallback(() => {
    playWish();
    addWish();
    setToast({ id: Date.now(), text: pick(WISH_CAUGHT) });
  }, [addWish]);

  const showPicker = !player && !askLater;

  return (
    <main ref={worldRef} className={`nw-screen ${styles.screen}`}>
      {/* ─── Manolandia viva (capa de fondo, no bloqueante) ────────────────── */}
      <LivingWorld tod={tod} />

      {/* Lo único del mundo que se puede tocar */}
      <ShootingStar tod={tod} onCatch={handleCatchStar} />

      {/* ─── Contenido (por encima del mundo) ─────────────────────────────── */}
      <div className={styles.content}>
        {/* Quién está jugando — cambiar de perfil sin salir de acá.
            La barra reserva su altura siempre, para que el título no salte. */}
        <div className={styles.topBar}>
          {player ? (
            <button
              className={styles.chip}
              style={{ '--accent': player.color } as CSSProperties}
              onClick={() => {
                playTap();
                clear();
              }}
              aria-label={`Estás jugando como ${player.name}. Tocá para cambiar.`}
            >
              <img src={player.avatar} alt="" className={styles.chipImg} />
              <span>{player.name}</span>
            </button>
          ) : (
            askLater && (
              <button
                className={styles.chip}
                onClick={() => {
                  playTap();
                  setAskLater(false);
                }}
              >
                👤 <span>¿Quién sos?</span>
              </button>
            )
          )}
        </div>

        <h1 className={`nw-title ${styles.heroTitle}`}>✨ Manolandia</h1>
        <p className={styles.heroSub}>El mundo mágico de las Nuvecielas</p>

        {wishes > 0 && (
          <p className={styles.wishes}>
            ✨ Atrapaste {wishes}{' '}
            {wishes === 1 ? 'estrella fugaz' : 'estrellas fugaces'}
          </p>
        )}

        {/* Selector de jugadora. Flota sobre el mundo en vez de empujar el
            contenido: el botón de jugar tiene que seguir estando a la vista. */}
        {showPicker && (
          <div className={styles.picker}>
            <button
              className={styles.pickerSkip}
              onClick={() => {
                playTap();
                setAskLater(true);
              }}
              aria-label="Elegir después"
            >
              ✕
            </button>
            <p className={styles.pickerTitle}>¿Quién sos hoy?</p>
            <div className={styles.pickerRow}>
              {players.map(p => (
                <button
                  key={p.id}
                  className={styles.pickerBtn}
                  style={{ '--accent': p.color } as CSSProperties}
                  onClick={() => {
                    playTap();
                    choose(p.id);
                  }}
                >
                  <img src={p.avatar} alt="" className={styles.pickerImg} />
                  <span className={styles.pickerName}>
                    {p.emoji} {p.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Personajes vivos. La grilla es de las cuatro protagonistas: las
            `secret` viven al final del array, así que los índices coinciden
            con los que espera CharactersScreen. */}
        <div className={styles.grid}>
          {CHARACTERS.filter(c => !c.secret).map((char, i) => (
            <LivingCharacter
              key={char.id}
              character={char}
              phrases={phrases}
              onOpen={() => onCharacterClick(i)}
            />
          ))}
        </div>

        {/* CTAs (navegación intacta) */}
        <a
          href={BOSQUE_MAGICO_URL}
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

      {toast && (
        <div className={styles.toast} role="status" aria-live="polite">
          {toast.text}
        </div>
      )}
    </main>
  );
}
