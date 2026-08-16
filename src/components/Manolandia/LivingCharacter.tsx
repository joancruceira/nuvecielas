import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import type { Character } from '../../types';
import { playTap } from '../../utils/audio';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import {
  PERSONALITIES,
  DEFAULT_PERSONALITY,
  HOSTESS_PHRASES,
  rand,
} from './config';
import styles from './LivingCharacter.module.css';

interface LivingCharacterProps {
  character: Character;
  /** Tap → abrir la ficha del personaje (navegación existente, sin cambios). */
  onOpen: () => void;
  /**
   * Qué dice, si es la anfitriona. Se pasa desde afuera porque depende de cosas
   * que el personaje no conoce: quién está jugando y qué hora es.
   * Debe venir memoizado (si cambia de identidad, el ciclo de burbujas
   * arranca de nuevo).
   */
  phrases?: readonly string[];
}

/**
 * Un personaje VIVO en Manolandia. Reutiliza el PNG estático existente y lo
 * anima con transform/opacity según su personalidad. La anfitriona (Lunaria)
 * además muestra burbujas de saludo de forma no bloqueante.
 *
 * Listo para evolucionar a sprite-sheet por frames cuando esos assets existan
 * (ver docs/ETAPA1 §assets): bastaría con cambiar el contenido de `.breathe`.
 */
export function LivingCharacter({
  character,
  onOpen,
  phrases = HOSTESS_PHRASES,
}: LivingCharacterProps) {
  const reduced = useReducedMotion();
  const p = PERSONALITIES[character.id] ?? DEFAULT_PERSONALITY;

  // Tiempos/retardos aleatorios fijados al montar → desincroniza a los personajes.
  const style = useMemo<CSSProperties>(
    () =>
      ({
        '--breathe-dur': `${p.breatheDur}s`,
        '--breathe-scale': p.breatheScale,
        '--breathe-delay': `${rand(0, 2).toFixed(2)}s`,
        '--bob-dur': `${p.bobDur}s`,
        '--bob-dist': `${p.bobDist}px`,
        '--bob-delay': `${rand(0, 2).toFixed(2)}s`,
        '--sway-dur': `${p.swayDur}s`,
        '--sway-deg': `${p.swayDeg}deg`,
        '--sway-delay': `${rand(0, 3).toFixed(2)}s`,
      }) as CSSProperties,
    [p],
  );

  // ── Microgesto ocasional (emote) ───────────────────────────────────────────
  const [emoting, setEmoting] = useState(false);
  useEffect(() => {
    if (reduced) return; // movimiento reducido: sin microgestos
    let gestureTimer: number;
    let clearTimer: number;

    const schedule = () => {
      gestureTimer = window.setTimeout(
        () => {
          setEmoting(true);
          clearTimer = window.setTimeout(() => setEmoting(false), 1500);
          schedule();
        },
        rand(p.emoteMin, p.emoteMax) * 1000,
      );
    };
    schedule();

    return () => {
      window.clearTimeout(gestureTimer);
      window.clearTimeout(clearTimer);
    };
  }, [reduced, p.emoteMin, p.emoteMax]);

  // ── Anfitriona: burbujas de saludo no bloqueantes ──────────────────────────
  const [phrase, setPhrase] = useState<string | null>(null);
  const phraseIdx = useRef(0);
  useEffect(() => {
    if (!p.hostess || phrases.length === 0) return;
    let showTimer: number;
    let hideTimer: number;

    // Frases nuevas (cambió de jugadora, cambió la hora) → empieza por el saludo.
    phraseIdx.current = 0;

    const cycle = (firstDelay: number) => {
      showTimer = window.setTimeout(() => {
        setPhrase(phrases[phraseIdx.current % phrases.length]);
        phraseIdx.current += 1;
        hideTimer = window.setTimeout(() => {
          setPhrase(null);
          cycle(rand(12, 20) * 1000); // siguiente saludo más tarde
        }, 3500);
      }, firstDelay);
    };
    cycle(1200); // primer saludo poco después de llegar

    return () => {
      window.clearTimeout(showTimer);
      window.clearTimeout(hideTimer);
      setPhrase(null);
    };
  }, [p.hostess, phrases]);

  return (
    <button
      className={styles.tile}
      onClick={() => {
        playTap();
        onOpen();
      }}
      style={style}
      aria-label={`Ver ${character.name}`}
    >
      <div className={styles.bob}>
        <div className={styles.sway}>
          {/* Mira hacia donde está el dedo/cursor (lee --mx/--my heredadas) */}
          <div className={styles.look}>
            <div
              className={styles.emote}
              data-emote={emoting ? p.emote : undefined}
            >
              <span className={styles.breathe}>
                <img src={character.image} alt="" className={styles.img} />
              </span>
            </div>
          </div>
        </div>
      </div>

      <span className={styles.label} style={{ color: character.textColor }}>
        {character.emoji} {character.name}
      </span>

      {phrase && (
        <span className={styles.bubble} role="status" aria-live="polite">
          {phrase}
        </span>
      )}
    </button>
  );
}
