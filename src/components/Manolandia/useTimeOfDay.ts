import { useEffect, useState } from 'react';

export type TimeOfDay = 'dawn' | 'day' | 'dusk' | 'night';

/** Franja horaria a partir de una fecha. Solo depende del reloj — sin backend. */
export function timeOfDayFor(date: Date = new Date()): TimeOfDay {
  const h = date.getHours();
  if (h >= 6 && h < 10) return 'dawn';
  if (h >= 10 && h < 18) return 'day';
  if (h >= 18 && h < 21) return 'dusk';
  return 'night';
}

/**
 * Hora del día reactiva. Re-evalúa cada 5 min para que, si la niña deja la app
 * abierta, Manolandia transicione sola (mañana → tarde → noche).
 */
export function useTimeOfDay(): TimeOfDay {
  const [tod, setTod] = useState<TimeOfDay>(() => timeOfDayFor());

  useEffect(() => {
    const id = window.setInterval(() => setTod(timeOfDayFor()), 5 * 60 * 1000);
    return () => window.clearInterval(id);
  }, []);

  return tod;
}
