/**
 * El ÚNICO lugar del hub que toca localStorage.
 *
 * Todo lleva el prefijo de versión `nuve_v1_`: si algún día cambia la forma de
 * los datos, se puede migrar sin pisar lo viejo. Perder un dibujo o una
 * colección sería el peor bug posible de este proyecto.
 *
 * Todo va envuelto en try/catch: Safari en modo privado tira al escribir, y el
 * mundo tiene que seguir funcionando igual (simplemente sin recordar).
 */
const PREFIX = 'nuve_v1_';

export function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    if (raw === null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function write(key: string, value: unknown): void {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    /* sin espacio o modo privado: el mundo sigue, solo que no recuerda */
  }
}

export function remove(key: string): void {
  try {
    localStorage.removeItem(PREFIX + key);
  } catch {
    /* idem */
  }
}

/** Fecha local en formato YYYY-MM-DD (no UTC: importa el día de la nena). */
export function todayISO(date: Date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/** Días enteros entre dos fechas YYYY-MM-DD. Negativo o inválido → 0. */
export function daysBetween(fromISO: string, toISO: string): number {
  const from = Date.parse(`${fromISO}T00:00:00`);
  const to = Date.parse(`${toISO}T00:00:00`);
  if (Number.isNaN(from) || Number.isNaN(to)) return 0;
  return Math.max(0, Math.round((to - from) / 86_400_000));
}
