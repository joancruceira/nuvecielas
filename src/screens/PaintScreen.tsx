import { useRef, useState, useEffect, useCallback, type PointerEvent as ReactPointerEvent } from 'react';
import { playTap, playSuccess } from '../utils/audio';
import { STAMPS, type Stamp } from '../data/stamps';
import { useCurrentPlayer } from '../world/profile';
import { useGallery, saveDrawing } from '../world/gallery';
import { DRAWING_SAVED, pick } from '../world/voice';
import styles from './PaintScreen.module.css';
import duomoImg from '../assets/coloring/duomo.jpg';

interface PaintScreenProps {
  onBack: () => void;
}

type Tool = 'bucket' | 'brush' | 'sparkle' | 'stamp';
interface Lamina { id: string; name: string; src: string; }

const COLORS = [
  '#FF6B6B', '#FF922B', '#FFD43B', '#69DB7C', '#38D9A9', '#4DABF7',
  '#4263EB', '#9775FA', '#F783AC', '#FFC9DE', '#B08968', '#FFD8B1',
  '#495057', '#FFFFFF',
];

// Sumá más láminas acá (poné el .jpg en src/assets/coloring/ e importalo arriba)
const LAMINAS: Lamina[] = [
  { id: 'duomo', name: 'Nuvecielas en el Duomo', src: duomoImg },
];

const MAXW = 900;   // resolución de trabajo (flood fill rápido)
const WALL = 110;   // luminancia < WALL => es línea (borde)

/** Los sellos se cargan una sola vez para todo el módulo. */
const stampCache = new Map<string, HTMLImageElement>();
function stampImage(stamp: Stamp): HTMLImageElement {
  let img = stampCache.get(stamp.id);
  if (!img) {
    img = new Image();
    img.src = stamp.src;
    stampCache.set(stamp.id, img);
  }
  return img;
}

export function PaintScreen({ onBack }: PaintScreenProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLCanvasElement>(null);
  const fxRef = useRef<HTMLCanvasElement>(null);
  const lineRef = useRef<HTMLImageElement>(null);

  const lineDataRef = useRef<Uint8ClampedArray | null>(null);
  const sizeRef = useRef({ W: MAXW, H: Math.round(MAXW * 1.5) });
  const undoRef = useRef<{ f: ImageData; x: ImageData }[]>([]);
  const paintingRef = useRef(false);

  const [lamina, setLamina] = useState<Lamina>(LAMINAS[0]);
  const [color, setColor] = useState(COLORS[0]);
  const [tool, setTool] = useState<Tool>('bucket');
  const [stamp, setStamp] = useState<Stamp>(STAMPS[0]);
  const [ratio, setRatio] = useState(MAXW / Math.round(MAXW * 1.5));

  const player = useCurrentPlayer();
  const { drawings, refresh, remove } = useGallery(player?.id ?? null);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 2400);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const fctx = () => fillRef.current!.getContext('2d', { willReadFrequently: true })!;
  const xctx = () => fxRef.current!.getContext('2d')!;

  // Al cargar la imagen: dimensionar canvases, hornear la máscara de líneas y limpiar
  const handleImgLoad = useCallback(() => {
    const img = lineRef.current;
    if (!img || !img.naturalWidth) return;
    let W = img.naturalWidth, H = img.naturalHeight;
    if (W > MAXW) { H = Math.round(H * MAXW / W); W = MAXW; }
    sizeRef.current = { W, H };
    setRatio(W / H);

    const fill = fillRef.current!, fx = fxRef.current!;
    fill.width = fx.width = W; fill.height = fx.height = H;

    const f = fctx(); f.fillStyle = '#fff'; f.fillRect(0, 0, W, H);
    xctx().clearRect(0, 0, W, H);

    const off = document.createElement('canvas');
    off.width = W; off.height = H;
    const o = off.getContext('2d', { willReadFrequently: true })!;
    o.drawImage(img, 0, 0, W, H);
    lineDataRef.current = o.getImageData(0, 0, W, H).data;

    undoRef.current = [];
  }, []);

  // Cubre el caso de imagen ya cacheada (onLoad podría no dispararse)
  useEffect(() => {
    if (lineRef.current?.complete && lineRef.current.naturalWidth) handleImgLoad();
  }, [lamina, handleImgLoad]);

  function pushUndo() {
    const { W, H } = sizeRef.current;
    if (undoRef.current.length >= 8) undoRef.current.shift();
    undoRef.current.push({ f: fctx().getImageData(0, 0, W, H), x: xctx().getImageData(0, 0, W, H) });
  }
  function undo() {
    const s = undoRef.current.pop();
    if (!s) return;
    fctx().putImageData(s.f, 0, 0);
    xctx().putImageData(s.x, 0, 0);
  }
  function clearAll() {
    const { W, H } = sizeRef.current;
    pushUndo();
    const f = fctx(); f.fillStyle = '#fff'; f.fillRect(0, 0, W, H);
    xctx().clearRect(0, 0, W, H);
  }

  const hexRGB = (hex: string): [number, number, number] =>
    [parseInt(hex.slice(1, 3), 16), parseInt(hex.slice(3, 5), 16), parseInt(hex.slice(5, 7), 16)];
  const lum = (d: Uint8ClampedArray, i: number) => 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2];

  function floodFill(sx: number, sy: number) {
    const line = lineDataRef.current;
    if (!line) return;
    const { W, H } = sizeRef.current;
    if (lum(line, (sy * W + sx) * 4) < WALL) return; // tocó una línea
    const [r, g, b] = hexRGB(color);
    const ctx = fctx();
    const img = ctx.getImageData(0, 0, W, H);
    const d = img.data;
    const visited = new Uint8Array(W * H);
    const stack = [sy * W + sx];
    visited[sy * W + sx] = 1;
    while (stack.length) {
      const p = stack.pop()!;
      const i4 = p * 4;
      d[i4] = r; d[i4 + 1] = g; d[i4 + 2] = b; d[i4 + 3] = 255;
      const px = p % W, py = (p / W) | 0;
      const nb: number[] = [];
      if (px > 0) nb.push(p - 1);
      if (px < W - 1) nb.push(p + 1);
      if (py > 0) nb.push(p - W);
      if (py < H - 1) nb.push(p + W);
      for (const np of nb) {
        if (visited[np]) continue;
        visited[np] = 1;
        if (lum(line, np * 4) < WALL) continue; // pared
        stack.push(np);
      }
    }
    ctx.putImageData(img, 0, 0);
  }

  function brushAt(x: number, y: number) {
    const { W } = sizeRef.current;
    const ctx = fctx();
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, Math.max(6, W * 0.012), 0, Math.PI * 2);
    ctx.fill();
  }
  function sparkleAt(x: number, y: number) {
    const { W } = sizeRef.current;
    const ctx = xctx();
    const R = Math.max(10, W * 0.02);
    ctx.save();
    ctx.translate(x, y);
    ctx.fillStyle = color === '#FFFFFF' ? '#FFD43B' : color;
    ctx.beginPath();
    for (let k = 0; k < 10; k++) {
      const ang = Math.PI * k / 5, rad = k % 2 ? R * 0.4 : R;
      ctx.lineTo(Math.cos(ang - Math.PI / 2) * rad, Math.sin(ang - Math.PI / 2) * rad);
    }
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,.9)';
    ctx.beginPath();
    ctx.arc(0, 0, R * 0.18, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  /** Estampa un sello centrado donde se tocó. Va en la capa FX: sobre las líneas. */
  function stampAt(x: number, y: number) {
    const img = stampImage(stamp);
    if (!img.complete || !img.naturalWidth) return; // todavía cargando
    const { W } = sizeRef.current;
    const w = W * 0.2;
    const h = w * (img.naturalHeight / img.naturalWidth);
    xctx().drawImage(img, x - w / 2, y - h / 2, w, h);
  }

  function toCanvas(e: ReactPointerEvent) {
    const r = stageRef.current!.getBoundingClientRect();
    const { W, H } = sizeRef.current;
    return {
      x: Math.floor((e.clientX - r.left) * (W / r.width)),
      y: Math.floor((e.clientY - r.top) * (H / r.height)),
    };
  }

  function onDown(e: ReactPointerEvent) {
    const { x, y } = toCanvas(e);
    const { W, H } = sizeRef.current;
    if (x < 0 || y < 0 || x >= W || y >= H) return;
    pushUndo();
    if (tool === 'bucket') floodFill(x, y);
    else if (tool === 'brush') { paintingRef.current = true; brushAt(x, y); }
    else if (tool === 'stamp') stampAt(x, y);
    else sparkleAt(x, y);
  }
  function onMove(e: ReactPointerEvent) {
    if (!paintingRef.current || tool !== 'brush') return;
    const { x, y } = toCanvas(e);
    brushAt(x, y);
  }
  function onUp() { paintingRef.current = false; }

  /** Aplana las tres capas en un solo PNG. */
  function flatten(): Promise<Blob | null> {
    const { W, H } = sizeRef.current;
    const out = document.createElement('canvas');
    out.width = W; out.height = H;
    const o = out.getContext('2d')!;
    o.fillStyle = '#fff'; o.fillRect(0, 0, W, H);
    o.drawImage(fillRef.current!, 0, 0);
    o.globalCompositeOperation = 'multiply';
    o.drawImage(lineRef.current!, 0, 0, W, H);
    o.globalCompositeOperation = 'source-over';
    o.drawImage(fxRef.current!, 0, 0);
    return new Promise(resolve => out.toBlob(resolve, 'image/png'));
  }

  /** Guardar = queda en Manolandia, no en la carpeta Descargas. */
  async function save() {
    playTap();
    const blob = await flatten();
    if (!blob) return;
    await saveDrawing(blob, player?.id ?? null, lamina.id);
    refresh();
    playSuccess();
    setToast(pick(DRAWING_SAVED));
  }

  /** Descargar sigue existiendo, para imprimirlo o mandárselo a alguien. */
  async function download() {
    playTap();
    const blob = await flatten();
    if (!blob) return;
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'mi-dibujo-nuvecielas.png';
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  }

  return (
    <main className={styles.screen}>
      <div className={styles.header}>
        <button className={styles.backBtn} onClick={onBack} aria-label="Volver a juegos">← Volver</button>
        <h1 className={styles.title}>✨ Pintá con Lunaria ✨</h1>
      </div>

      {LAMINAS.length > 1 && (
        <div className={styles.laminas}>
          {LAMINAS.map(l => (
            <button
              key={l.id}
              className={`${styles.lamina} ${l.id === lamina.id ? styles.laminaActive : ''}`}
              onClick={() => setLamina(l)}
            >
              {l.name}
            </button>
          ))}
        </div>
      )}

      <div
        ref={stageRef}
        className={styles.stage}
        style={{ aspectRatio: ratio }}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerLeave={onUp}
      >
        <canvas ref={fillRef} className={styles.layer} />
        <img ref={lineRef} src={lamina.src} alt="" className={styles.line} onLoad={handleImgLoad} />
        <canvas ref={fxRef} className={styles.layer} />
      </div>

      {/* Con el sello elegido, la fila de colores no aplica: mostramos los sellos */}
      {tool === 'stamp' ? (
        <div className={styles.stampRow}>
          {STAMPS.map(s => (
            <button
              key={s.id}
              className={`${styles.stampBtn} ${s.id === stamp.id ? styles.stampActive : ''}`}
              onClick={() => { playTap(); setStamp(s); }}
              aria-label={`Sello de ${s.name}`}
            >
              <img src={s.src} alt="" className={styles.stampImg} />
            </button>
          ))}
        </div>
      ) : (
        <div className={styles.palette}>
          {COLORS.map(c => (
            <button
              key={c}
              className={`${styles.swatch} ${c === color ? styles.swatchActive : ''}`}
              style={{ background: c }}
              onClick={() => { playTap(); setColor(c); }}
              aria-label={`Color ${c}`}
            />
          ))}
        </div>
      )}

      <div className={styles.tools}>
        <button className={`${styles.tool} ${tool === 'bucket' ? styles.toolActive : ''}`} onClick={() => { playTap(); setTool('bucket'); }} title="Balde">🪣</button>
        <button className={`${styles.tool} ${tool === 'brush' ? styles.toolActive : ''}`} onClick={() => { playTap(); setTool('brush'); }} title="Pincel">🖌️</button>
        <button className={`${styles.tool} ${tool === 'sparkle' ? styles.toolActive : ''}`} onClick={() => { playTap(); setTool('sparkle'); }} title="Brillos">✨</button>
        <button className={`${styles.tool} ${tool === 'stamp' ? styles.toolActive : ''}`} onClick={() => { playTap(); setTool('stamp'); }} title="Sellos">🧸</button>
        <button className={styles.tool} onClick={() => { playTap(); undo(); }} title="Deshacer">↩️</button>
        <button className={styles.tool} onClick={() => { playTap(); clearAll(); }} title="Limpiar">🔄</button>
        <button className={styles.tool} onClick={save} title="Guardar en mi galería">💾</button>
        <button className={styles.tool} onClick={() => { playTap(); setGalleryOpen(true); }} title="Mi galería">🖼️</button>
      </div>

      {toast && <div className={styles.toast} role="status" aria-live="polite">{toast}</div>}

      {/* ─── Galería ────────────────────────────────────────────────────────── */}
      {galleryOpen && (
        <div className={styles.gallery} role="dialog" aria-label="Mi galería">
          <div className={styles.galleryHeader}>
            <h2 className={styles.galleryTitle}>🖼️ Mis dibujos</h2>
            <button
              className={styles.galleryClose}
              onClick={() => { playTap(); setGalleryOpen(false); }}
              aria-label="Cerrar galería"
            >
              ✕
            </button>
          </div>

          {drawings.length === 0 ? (
            <p className={styles.galleryEmpty}>
              Todavía no guardaste ninguno.<br />
              Pintá algo y tocá 💾
            </p>
          ) : (
            <div className={styles.galleryGrid}>
              {drawings.map(d => (
                <figure key={d.id} className={styles.galleryItem}>
                  <img src={d.url} alt={`Dibujo del ${d.createdAt}`} className={styles.galleryImg} />
                  <figcaption className={styles.galleryDate}>{d.createdAt}</figcaption>
                  <button
                    className={styles.galleryDelete}
                    onClick={() => { playTap(); remove(d.id); }}
                    aria-label="Borrar este dibujo"
                  >
                    🗑️
                  </button>
                </figure>
              ))}
            </div>
          )}

          <button className={styles.galleryDownload} onClick={download}>
            ⬇️ Descargar el dibujo de ahora
          </button>
        </div>
      )}
    </main>
  );
}
