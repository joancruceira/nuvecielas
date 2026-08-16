export interface Question {
  id: number;
  text: string;
  options: string[];
  answer: string;
  hint: string;
}

/**
 * El banco de preguntas del Quiz Estelar. Cada partida toma 5 al azar, así que
 * cuantas más haya, más veces se puede volver sin que se repita todo.
 *
 * Todo lo que se pregunta acá tiene que ser verificable en el universo: las
 * fichas de personaje (`data/characters.ts`), los niveles del Bosque Mágico o
 * la historia de las creadoras. Nada inventado sobre la marcha.
 */
export const ALL_QUESTIONS: Question[] = [
  // ── Poderes ───────────────────────────────────────────────────────────────
  {
    id: 1,
    text: '¿Cuál es el poder especial de Nuveciela?',
    options: [
      'Doble salto alto + lanza bolas de fuego 🔥',
      'Mantener ↑ para flotar y disparar rayos de sol ☀️',
      'Deslizamiento veloz + dispara hielo ❄️',
      'Volar con doble salto y aturdir enemigos 🎨',
    ],
    answer: 'Doble salto alto + lanza bolas de fuego 🔥',
    hint: '¡Es la guardiana de las noches estrelladas con su energía brillante!',
  },
  {
    id: 2,
    text: '¿A quién le encanta viajar lejos y tiene un deslizamiento veloz?',
    options: ['Ciela 💧', 'Nuve ⭐', 'Lunaria ✨', 'Nuveciela 🌙'],
    answer: 'Ciela 💧',
    hint: 'Siempre lista para la aventura y congela todo lo que toca.',
  },
  {
    id: 3,
    text: '¿Cuál es el elemento favorito de Lunaria?',
    options: [
      'Atardeceres arcoíris 🌈',
      'Estrellas fugaces ☄️',
      'Descubrir secretos 🔍',
      'Viajar lejos ✈️',
    ],
    answer: 'Atardeceres arcoíris 🌈',
    hint: 'Flota entre sueños y hace realidad los deseos con magia arcoíris.',
  },
  {
    id: 4,
    text: '¿Qué personaje tiene como lema "¡Detallista, trabajadora y tranquila!"?',
    options: ['Nuve ⭐', 'Ciela 💧', 'Nuveciela 🌙', 'Super Natan 🦸'],
    answer: 'Nuve ⭐',
    hint: 'Siempre tiene una pregunta nueva y comparte todo con una sonrisa.',
  },
  {
    id: 5,
    text: '¿Quién es la inventora del grupo?',
    options: ['Lunaria ✨', 'Nina ☀️', 'Ciela 💧', 'Nuveciela 🌙'],
    answer: 'Lunaria ✨',
    hint: 'Usa su magia arcoíris para hacer realidad los sueños.',
  },
  {
    id: 6,
    text: '¿Qué le fascina buscar y descubrir a Nuve?',
    options: [
      'Descubrir secretos 🗝️',
      'Estrellas fugaces ☄️',
      'Viajar lejos 🚢',
      'Pintar paredes 🎨',
    ],
    answer: 'Descubrir secretos 🗝️',
    hint: 'Aprende algo diferente cada día.',
  },
  {
    id: 7,
    text: '¿Qué poder especial tiene Ciela para detener enemigos?',
    options: [
      'Dispara hielo que congela enemigos ❄️',
      'Lanza bolas de fuego 🔥',
      'Dispara rayos de sol ☀️',
      'Aturde al aterrizar de un salto 💥',
    ],
    answer: 'Dispara hielo que congela enemigos ❄️',
    hint: 'Es sabia y rápida como el viento.',
  },
  {
    id: 8,
    text: '¿Qué hay que hacer para que Lunaria se quede flotando en el aire?',
    options: [
      'Mantener apretado ↑',
      'Apretar ↑ dos veces',
      'Agacharse y saltar',
      'No se puede: Lunaria no vuela',
    ],
    answer: 'Mantener apretado ↑',
    hint: 'No es un salto doble: es quedarse suspendida.',
  },
  {
    id: 9,
    text: 'Nuve aterriza de un salto. ¿Qué les pasa a los enemigos que están cerca?',
    options: [
      'Quedan aturdidos 💫',
      'Se congelan ❄️',
      'Se prenden fuego 🔥',
      'No pasa nada',
    ],
    answer: 'Quedan aturdidos 💫',
    hint: 'Vuela con doble salto y su aterrizaje se siente en el piso.',
  },

  // ── Personalidades ────────────────────────────────────────────────────────
  {
    id: 10,
    text: '¿Cuál de las cuatro es "la guardiana de las noches estrelladas"?',
    options: ['Nuveciela 🌙', 'Lunaria ✨', 'Ciela 💧', 'Nuve ⭐'],
    answer: 'Nuveciela 🌙',
    hint: 'Protege a sus amigas con su energía oscura y brillante.',
  },
  {
    id: 11,
    text: '¿Quién es valiente, misteriosa y leal?',
    options: ['Nuveciela 🌙', 'Nuve ⭐', 'Lunaria ✨', 'Ciela 💧'],
    answer: 'Nuveciela 🌙',
    hint: 'Su lema es cortito: "¡Fuerte!".',
  },
  {
    id: 12,
    text: '¿Quién es soñadora, creativa y mágica?',
    options: ['Lunaria ✨', 'Ciela 💧', 'Nuveciela 🌙', 'Nuve ⭐'],
    answer: 'Lunaria ✨',
    hint: 'Es la que te recibe cuando entrás a Manolandia.',
  },
  {
    id: 13,
    text: '¿Quién es libre, aventurera y optimista?',
    options: ['Ciela 💧', 'Nuve ⭐', 'Lunaria ✨', 'Nuveciela 🌙'],
    answer: 'Ciela 💧',
    hint: 'Corre más rápido que el viento.',
  },
  {
    id: 14,
    text: '¿A quién le gustan las estrellas fugaces?',
    options: ['Nuveciela 🌙', 'Nuve ⭐', 'Ciela 💧', 'Lunaria ✨'],
    answer: 'Nuveciela 🌙',
    hint: 'Es la que manda de noche.',
  },
  {
    id: 15,
    text: '¿Qué Nuveciela es curiosa, alegre y amigable?',
    options: ['Nuve ⭐', 'Lunaria ✨', 'Nuveciela 🌙', 'Ciela 💧'],
    answer: 'Nuve ⭐',
    hint: 'Siempre llega con una pregunta nueva.',
  },

  // ── Colores y símbolos ────────────────────────────────────────────────────
  {
    id: 16,
    text: '¿Qué emoji acompaña siempre a Ciela?',
    options: ['💧', '⭐', '🌙', '✨'],
    answer: '💧',
    hint: 'Tiene que ver con el agua y con el hielo que dispara.',
  },
  {
    id: 17,
    text: '¿Qué emoji acompaña a Nuve?',
    options: ['⭐', '💧', '✨', '🌙'],
    answer: '⭐',
    hint: 'Es el mismo que buscás en "Atrapa las Estrellas".',
  },
  {
    id: 18,
    text: 'Si una Nuveciela es celeste, ¿cuál es?',
    options: ['Ciela 💧', 'Lunaria ✨', 'Nuveciela 🌙', 'Nuve ⭐'],
    answer: 'Ciela 💧',
    hint: 'Su nombre ya lo dice un poco.',
  },
  {
    id: 19,
    text: '¿De qué color es Lunaria?',
    options: ['Rosa 💗', 'Celeste 💙', 'Amarillo 💛', 'Naranja 🧡'],
    answer: 'Rosa 💗',
    hint: 'El color de sus atardeceres favoritos.',
  },

  // ── Las creadoras (el corazón del proyecto) ───────────────────────────────
  {
    id: 20,
    text: '¿Quiénes inventaron a las Nuvecielas?',
    options: [
      'Nina y Jazmín 👯',
      'Lunaria y Nuve ✨',
      'Un estudio de dibujantes 🎬',
      'Nadie: siempre existieron',
    ],
    answer: 'Nina y Jazmín 👯',
    hint: 'Son dos hermanas mellizas, y son de verdad.',
  },
  {
    id: 21,
    text: '¿Cómo se llama el mundo donde viven las Nuvecielas?',
    options: ['Manolandia 🌈', 'Nubelandia ☁️', 'Estrellandia ⭐', 'Cielolandia 🌤️'],
    answer: 'Manolandia 🌈',
    hint: 'El nombre viene de que están hechas con las manos.',
  },
  {
    id: 22,
    text: '¿Cómo se llama el hermanito de Nina y Jazmín cuando se vuelve superhéroe?',
    options: ['Super Natan 🦸', 'Capitán Nube ☁️', 'Ultra Natan ⚡', 'Natan Estelar 🌟'],
    answer: 'Super Natan 🦸',
    hint: 'Lleva capa, anteojos oscuros y un gatito.',
  },
  {
    id: 23,
    text: '¿Con qué están hechas las Nuvecielas?',
    options: [
      'Con las manos ✋',
      'Con una computadora 💻',
      'Con plastilina 🎨',
      'Con papel y tijera ✂️',
    ],
    answer: 'Con las manos ✋',
    hint: 'Por eso su mundo se llama como se llama.',
  },
  {
    id: 24,
    text: '¿Cuál de estas NO es una Nuveciela?',
    options: ['Nina ☀️', 'Lunaria ✨', 'Ciela 💧', 'Nuveciela 🌙'],
    answer: 'Nina ☀️',
    hint: 'Una de ellas vive en la Tierra y es quien inventa a las demás.',
  },

  // ── El Bosque Mágico ──────────────────────────────────────────────────────
  {
    id: 25,
    text: '¿Cuál es el primer nivel del Bosque Mágico?',
    options: [
      'Bosque Mágico 🌿',
      'Sendero Nocturno 🌙',
      'Atravesando el Lago 🌊',
      'El Castillo de la Ciela ❄️',
    ],
    answer: 'Bosque Mágico 🌿',
    hint: 'Ahí tenés que encontrar el castillo de Nuveciela.',
  },
  {
    id: 26,
    text: 'En "Atravesando el Lago", ¿entre qué animales hay que nadar?',
    options: ['Medusas 🪼', 'Tiburones 🦈', 'Delfines 🐬', 'Pulpos 🐙'],
    answer: 'Medusas 🪼',
    hint: 'Flotan, son transparentes y conviene no tocarlas.',
  },
  {
    id: 27,
    text: '¿A quién hay que rescatar en la misión urgente?',
    options: [
      'Al gatito Pablo 🐱',
      'A Lunaria ✨',
      'A Super Natan 🦸',
      'A una estrella perdida ⭐',
    ],
    answer: 'Al gatito Pablo 🐱',
    hint: 'Se escapó a la calle y Nina y Jazmín van a buscarlo.',
  },
  {
    id: 28,
    text: '¿Quién es el jefe del Castillo de la Ciela?',
    options: [
      'El Rey de Escarcha ❄️',
      'El Ciempiés gigante 🐛',
      'El Inspector de la perrera 🚓',
      'Un fantasma 👻',
    ],
    answer: 'El Rey de Escarcha ❄️',
    hint: 'Su nombre tiene que ver con el hielo.',
  },
  {
    id: 29,
    text: 'En el Sendero Nocturno aparece un bicho gigante. ¿Cuál?',
    options: ['Un ciempiés 🐛', 'Una araña 🕷️', 'Un escarabajo 🪲', 'Una abeja 🐝'],
    answer: 'Un ciempiés 🐛',
    hint: 'Tiene muchísimas patas y viene con orugas y arbustos.',
  },
];
