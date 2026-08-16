import { useEffect, useRef } from 'react';

/**
 * Parallax muy suave. Escribe las CSS vars `--mx`/`--my` (rango ~[-1, 1]) en el
 * elemento referenciado a partir del puntero (desktop) o del giroscopio (móvil).
 * Las capas internas las leen para desplazarse a distinta velocidad (profundidad).
 *
 * - Throttle por requestAnimationFrame (nunca más de 1 escritura por frame).
 * - Si `enabled` es false (p. ej. movimiento reducido), centra y no escucha nada.
 */
export function useParallax<T extends HTMLElement = HTMLDivElement>(enabled: boolean) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (!enabled) {
      el.style.setProperty('--mx', '0');
      el.style.setProperty('--my', '0');
      return;
    }

    let raf = 0;
    let tx = 0;
    let ty = 0;

    const apply = () => {
      raf = 0;
      el.style.setProperty('--mx', tx.toFixed(3));
      el.style.setProperty('--my', ty.toFixed(3));
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(apply);
    };

    const onPointer = (e: PointerEvent) => {
      tx = (e.clientX / window.innerWidth - 0.5) * 2;
      ty = (e.clientY / window.innerHeight - 0.5) * 2;
      schedule();
    };

    const clamp = (v: number) => Math.max(-1, Math.min(1, v));
    const onOrient = (e: DeviceOrientationEvent) => {
      if (e.gamma == null || e.beta == null) return;
      tx = clamp(e.gamma / 30); // izquierda/derecha
      ty = clamp((e.beta - 45) / 30); // adelante/atrás (45° = sostener natural)
      schedule();
    };

    window.addEventListener('pointermove', onPointer, { passive: true });
    window.addEventListener('deviceorientation', onOrient);
    return () => {
      window.removeEventListener('pointermove', onPointer);
      window.removeEventListener('deviceorientation', onOrient);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [enabled]);

  return ref;
}
