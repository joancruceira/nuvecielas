import type { TimeOfDay } from '../components/Manolandia/useTimeOfDay';
import type { Arrival } from './profile';
import { world, type DiaryEntry } from './bridge';

/**
 * La voz del mundo. SOLO datos: qué dice cada personaje y cuándo.
 *
 * Hoy la única que habla es Lunaria (la anfitriona). Cuando otros personajes
 * empiecen a hablar —al ganar un juego, al recibir a una Nuveciela nueva—
 * sus frases viven acá, no repartidas por las pantallas.
 */

/** `{n}` se reemplaza por el nombre de la jugadora. */
const BY_TIME_OF_DAY: Record<TimeOfDay, readonly string[]> = {
  dawn: [
    'Recién amanece en Manolandia.',
    'Mirá, {n}: está saliendo el sol.',
    'Qué temprano te levantaste, {n}.',
    'El cielo está de color durazno.',
  ],
  day: [
    'Hoy hay mucha luz, {n}.',
    'Qué lindo día para volar.',
    '¿Jugamos, {n}?',
    'Las nubes andan lentas hoy.',
  ],
  dusk: [
    'Se está poniendo naranja el cielo.',
    'Este es mi momento favorito, {n}.',
    'Ya se ven las primeras estrellas.',
    'Mirá el atardecer, {n}.',
  ],
  night: [
    'Ya es de noche, {n}.',
    'Salieron todas las estrellas.',
    'Shhh… Manolandia está durmiendo.',
    'Si ves una estrella fugaz, atrapala.',
  ],
};

const FIRST_EVER: readonly string[] = [
  '¡Hola, {n}! Te estaba esperando.',
  '¡{n}! Qué bueno que viniste.',
];

const RETURNING_SOON: readonly string[] = [
  '¡Volviste, {n}!',
  '¡{n}! Justo estaba pensando en vos.',
];

const RETURNING_LONG: readonly string[] = [
  '¡{n}! Hace {d} días que no venías.',
  'Te extrañé, {n}. Pasaron {d} días.',
];

/** Cuando todavía no sabemos quién está del otro lado. */
export const WHO_ARE_YOU = '¡Hola! ¿Quién sos hoy?';

/** Lo que dice Lunaria cuando guarda un dibujo en el mundo. */
export const DRAWING_SAVED: readonly string[] = [
  'Lo guardé en Manolandia 💜',
  '¡Qué lindo te quedó! Ya está guardado.',
  'Lo cuelgo en tu galería.',
];

/** Lo que dice Lunaria cuando se atrapa una estrella fugaz. */
export const WISH_CAUGHT: readonly string[] = [
  '¡La atrapaste! Pedí un deseo.',
  '¡Guau! Esa estrella es tuya.',
  'Nadie la había visto pasar.',
];

/**
 * Quién recibe a la nena en cada juego. No es decorativo: es lo que convierte
 * "abrí un mini-juego" en "fui a ver a una amiga".
 */
export const HOST_BY_GAME: Record<string, string> = {
  memory: 'nuve',
  quiz: 'lunaria',
  puzzle: 'nuveciela',
  colors: 'lunaria',
};

/** Lo que dice cada una al ganar, con su propio tono. */
const WIN_LINES: Record<string, readonly string[]> = {
  nuve: [
    '¡Te acordabas de todas, {n}!',
    'Yo siempre me olvido dónde dejo las cosas…',
    '¡Qué memoria, {n}!',
  ],
  lunaria: [
    '¡Sabía que podías, {n}!',
    'Me encanta cuando te sale.',
    '¡Eso, {n}!',
  ],
  nuveciela: [
    '¡Me armaste enterita, {n}!',
    'Nada mal. Nada mal.',
    '¡Lo lograste, {n}!',
  ],
  ciela: [
    '¡Rapidísima, {n}!',
    '¡Vamos, {n}!',
    'Ni yo lo hubiera hecho mejor.',
  ],
};

/** Cuando además rompe su récord anterior. */
const RECORD_LINES: readonly string[] = [
  '¡Es tu mejor marca, {n}!',
  '¡Nunca te había salido tan bien!',
  '¡Récord nuevo!',
];

const GENERIC_WIN: readonly string[] = ['¡Muy bien, {n}!', '¡Lo hiciste!'];

const todayISO = () => world().todayISO();

/**
 * Lo que dice el mundo sobre lo último que hiciste — en cualquiera de los tres
 * juegos. Es lo que convierte "abriste una app" en "alguien te estuvo mirando".
 *
 * Devuelve null si no hay nada que contar: mejor callarse que inventar.
 */
export function noteLine(entry: DiaryEntry | null): string | null {
  if (!entry) return null;

  const when = entry.day === todayISO() ? 'Hoy' : 'La última vez';

  if (entry.game === 'bosque' && entry.type === 'nivel') {
    return entry.label ? `¡Pasaste ${entry.label}!` : '¡Pasaste un nivel del Bosque!';
  }

  if (entry.game === 'estrellas' && entry.type === 'partida') {
    if (entry.record) return `¡Rompiste tu récord: ${entry.value} estrellas!`;
    return `${when} juntaste ${entry.value} estrellas.`;
  }

  if (entry.type === 'victoria') {
    if (entry.record && entry.label) return `¡Tu mejor marca en ${entry.label}!`;
    return entry.label ? `${when} ganaste en ${entry.label}.` : null;
  }

  if (entry.type === 'deseo') return `${when} atrapaste una estrella fugaz.`;
  if (entry.type === 'dibujo') return 'Me encantó tu último dibujo.';

  return null;
}

function fill(template: string, name: string, days: number): string {
  return template.replace(/\{n\}/g, name).replace(/\{d\}/g, String(days));
}

export function pick<T>(options: readonly T[]): T {
  return options[Math.floor(Math.random() * options.length)];
}

/**
 * Las frases que dice Lunaria en esta visita. La primera es el saludo
 * contextual (te reconoce); las siguientes son color según la hora del día.
 *
 * Si nadie eligió perfil todavía, la única frase es la pregunta — que es
 * también la invitación a elegir, sin bloquear nada.
 */
export function hostessPhrases(arrival: Arrival | null, tod: TimeOfDay): string[] {
  if (!arrival) return [WHO_ARE_YOU];

  const { player, isFirstEver, daysAway } = arrival;
  const name = player.name;

  let greeting: string;
  if (isFirstEver) greeting = pick(FIRST_EVER);
  else if (daysAway >= 3) greeting = pick(RETURNING_LONG);
  else if (daysAway >= 1) greeting = pick(RETURNING_SOON);
  else greeting = `¡Hola de nuevo, ${name}!`;

  // Lo que hizo va SEGUNDO, apenas después del saludo: es lo que demuestra que
  // el mundo estuvo mirando, y si queda perdido entre las frases de ambiente se
  // lo pierde. Puede venir de cualquiera de los tres juegos.
  const lastThing = noteLine(world().lastNote(player.id));

  const flavour = BY_TIME_OF_DAY[tod].map(p => fill(p, name, daysAway));
  return [
    fill(greeting, name, daysAway),
    ...(lastThing ? [lastThing] : []),
    ...flavour,
  ];
}

/**
 * Lo que dice la anfitriona del juego al ganar. Si además fue récord, lo
 * celebra. Sin nombre (nadie eligió perfil) las frases igual funcionan: por eso
 * varias no lo llevan.
 */
export function winLine(
  characterId: string,
  playerName: string | null,
  isRecord = false,
): string {
  const pool = isRecord ? RECORD_LINES : (WIN_LINES[characterId] ?? GENERIC_WIN);
  // Sin perfil elegido descartamos las frases que llevan nombre.
  const usable = playerName ? pool : pool.filter(p => !p.includes('{n}'));
  if (!usable.length) return '¡Lo hiciste!';
  return fill(pick(usable), playerName ?? '', 0);
}
