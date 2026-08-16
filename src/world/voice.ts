import type { TimeOfDay } from '../components/Manolandia/useTimeOfDay';
import type { Arrival } from './profile';

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

/** Lo que dice Lunaria cuando se atrapa una estrella fugaz. */
export const WISH_CAUGHT: readonly string[] = [
  '¡La atrapaste! Pedí un deseo.',
  '¡Guau! Esa estrella es tuya.',
  'Nadie la había visto pasar.',
];

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

  const flavour = BY_TIME_OF_DAY[tod].map(p => fill(p, name, daysAway));
  return [fill(greeting, name, daysAway), ...flavour];
}
