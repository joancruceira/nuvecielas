import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import type { TimeOfDay } from './useTimeOfDay';
import { rand } from './config';
import styles from './ShootingStar.module.css';

interface ShootingStarProps {
  tod: TimeOfDay;
  /** Se llama solo cuando la nena LLEGA a tocarla. */
  onCatch: () => void;
}

/** Cada cuánto pasa una, según la hora. De día es rarísima — y por eso vale. */
const INTERVAL: Record<TimeOfDay, [number, number]> = {
  night: [8, 16],
  dusk: [12, 22],
  dawn: [30, 55],
  day: [34, 60],
};

const FLIGHT_MS = 1900;
/** Sin movimiento: aparece quieta y se queda más tiempo, para poder tocarla. */
const FLIGHT_MS_REDUCED = 3000;
const BURST_MS = 900;

type Phase = 'hidden' | 'flying' | 'caught';

/**
 * Una estrella fugaz que se puede ATRAPAR.
 *
 * Es el primer descubrimiento de Manolandia: no la anuncia nada, no hay tutorial
 * y no pasa nada si no la ves. Está para premiar a quien se queda mirando.
 *
 * Va manejada por JS y no por una animación CSS infinita porque necesitamos
 * saber exactamente cuándo está en pantalla: solo entonces acepta el toque.
 */
export function ShootingStar({ tod, onCatch }: ShootingStarProps) {
  const reduced = useReducedMotion();
  const [phase, setPhase] = useState<Phase>('hidden');
  const [pos, setPos] = useState({ x: 60, y: 16 });

  /**
   * La fase también en un ref: el handler del toque necesita leerla de forma
   * síncrona. (Meter el efecto dentro del updater de `setPhase` haría que
   * StrictMode contara el deseo dos veces.)
   */
  const phaseRef = useRef<Phase>('hidden');
  const burstTimer = useRef(0);

  const goTo = useCallback((next: Phase) => {
    phaseRef.current = next;
    setPhase(next);
  }, []);

  // En un ref para que cambiar el handler no reinicie el ciclo de apariciones.
  const onCatchRef = useRef(onCatch);
  useEffect(() => {
    onCatchRef.current = onCatch;
  }, [onCatch]);

  useEffect(() => () => window.clearTimeout(burstTimer.current), []);

  const flightMs = reduced ? FLIGHT_MS_REDUCED : FLIGHT_MS;

  useEffect(() => {
    let appearTimer = 0;
    let hideTimer = 0;

    const scheduleNext = (delaySec: number) => {
      appearTimer = window.setTimeout(() => {
        setPos({ x: rand(42, 78), y: rand(8, 34) });
        goTo('flying');
        hideTimer = window.setTimeout(() => {
          // Si la atraparon, se queda estallando: no la escondemos de golpe.
          if (phaseRef.current === 'flying') goTo('hidden');
          scheduleNext(rand(...INTERVAL[tod]));
        }, flightMs);
      }, delaySec * 1000);
    };

    scheduleNext(rand(4, 9)); // la primera nunca apenas se abre la app

    return () => {
      window.clearTimeout(appearTimer);
      window.clearTimeout(hideTimer);
    };
  }, [tod, flightMs, goTo]);

  const handleCatch = useCallback(() => {
    if (phaseRef.current !== 'flying') return; // ya la atrapó, o ya se fue
    goTo('caught');
    onCatchRef.current();
    burstTimer.current = window.setTimeout(() => goTo('hidden'), BURST_MS);
  }, [goTo]);

  if (phase === 'hidden') return null;

  const style = {
    left: `${pos.x}%`,
    top: `${pos.y}%`,
    '--flight-ms': `${flightMs}ms`,
  } as CSSProperties;

  return (
    <button
      className={`${styles.star} ${phase === 'caught' ? styles.caught : styles.flying}`}
      style={style}
      onClick={handleCatch}
      aria-label="Atrapar la estrella fugaz"
    >
      <span className={styles.streak} aria-hidden="true" />
      {phase === 'caught' && (
        <span className={styles.burst} aria-hidden="true">
          {Array.from({ length: 6 }, (_, i) => (
            <span key={i} className={styles.spark} style={{ '--i': i } as CSSProperties} />
          ))}
        </span>
      )}
    </button>
  );
}
