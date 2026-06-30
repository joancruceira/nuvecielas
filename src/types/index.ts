// ─── Navigation ───────────────────────────────────────────────────────────────

export type ScreenId = 'home' | 'characters' | 'games' | 'memory' | 'stars' | 'colors' | 'quiz' | 'puzzle';

// ─── Characters ───────────────────────────────────────────────────────────────

export interface Character {
  id: string;
  name: string;
  emoji: string;
  tagline: string;
  description: string;
  /** Special ability in the platformer game */
  power: string;
  traits: string[];
  favorite: string;
  primaryColor: string;
  /** CSS gradient string for the character card background */
  cardGradient: string;
  /** Foreground text color on top of cardGradient */
  textColor: string;
  /** Resolved image URL — import the PNG from assets and pass it here */
  image: string;
}

export interface NewCharacter {
  id: string;
  name: string;
  accentColor: string;
  image: string;
  /** Rol en el universo Nuvecielas (creadoras, superhéroe, etc.) */
  role?: string;
  /** Pixel art sprites need image-rendering: pixelated */
  isPixelArt?: boolean;
}

// ─── Games ────────────────────────────────────────────────────────────────────

export interface GameEntry {
  id: string;
  title: string;
  icon: string;
  available: boolean;
  /** If available, which internal screen does it open? */
  screenId?: ScreenId;
  /** Label shown under the title */
  statusLabel: string;
}

// ─── Memory game ──────────────────────────────────────────────────────────────

export interface MemoryCardData {
  /** Unique slot index (0-15 for a 4×4 board) */
  id: number;
  /** Identidad del personaje (para el match) */
  key: string;
  /** Imagen del personaje */
  src: string;
  /** Nombre (accesibilidad) */
  name: string;
  flipped: boolean;
  matched: boolean;
}