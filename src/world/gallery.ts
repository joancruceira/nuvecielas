import { useCallback, useEffect, useState } from 'react';
import { todayISO } from './storage';

/**
 * Las creaciones de la nena, guardadas DENTRO del mundo.
 *
 * Antes "guardar" disparaba una descarga: el dibujo terminaba en la carpeta
 * Descargas del teléfono, donde una nena de 8 años no lo vuelve a encontrar
 * nunca. Lo más creativo del proyecto se perdía apenas se hacía.
 *
 * Va en IndexedDB y no en localStorage a propósito: son imágenes. localStorage
 * guarda texto, así que habría que meterlas en base64 (+33% de peso) contra un
 * límite de ~5 MB, y al llenarse tira una excepción — es decir, perder dibujos.
 * IndexedDB guarda el Blob tal cual y no tiene ese techo.
 */
const DB_NAME = 'nuve_v1_gallery';
const STORE = 'drawings';

export interface Drawing {
  id: string;
  /** Quién lo hizo; null si nadie eligió perfil */
  playerId: string | null;
  /** Qué lámina usó (o 'libre') */
  laminaId: string;
  createdAt: string;
  blob: Blob;
}

/** Lo mismo pero con una URL lista para mostrar en un <img>. */
export interface DrawingView extends Omit<Drawing, 'blob'> {
  url: string;
}

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE, { keyPath: 'id' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function tx<T>(mode: IDBTransactionMode, run: (store: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  return openDb().then(
    db =>
      new Promise<T>((resolve, reject) => {
        const request = run(db.transaction(STORE, mode).objectStore(STORE));
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      }),
  );
}

export async function saveDrawing(blob: Blob, playerId: string | null, laminaId: string) {
  const drawing: Drawing = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    playerId,
    laminaId,
    createdAt: todayISO(),
    blob,
  };
  await tx('readwrite', store => store.put(drawing));
  return drawing.id;
}

export async function deleteDrawing(id: string) {
  await tx('readwrite', store => store.delete(id));
}

/** Los dibujos de una jugadora, del más nuevo al más viejo. */
async function loadDrawings(playerId: string | null): Promise<DrawingView[]> {
  const all = await tx<Drawing[]>('readonly', store => store.getAll());
  return all
    .filter(d => d.playerId === playerId)
    .sort((a, b) => b.id.localeCompare(a.id))
    .map(({ blob, ...rest }) => ({ ...rest, url: URL.createObjectURL(blob) }));
}

export function useGallery(playerId: string | null) {
  const [drawings, setDrawings] = useState<DrawingView[]>([]);

  const refresh = useCallback(() => {
    let cancelled = false;
    loadDrawings(playerId).then(list => {
      if (cancelled) list.forEach(d => URL.revokeObjectURL(d.url));
      else setDrawings(list);
    });
    return () => {
      cancelled = true;
    };
  }, [playerId]);

  useEffect(() => refresh(), [refresh]);

  // Las object URLs son memoria viva del navegador: si no se liberan al
  // reemplazar la lista, cada visita a la galería deja los blobs colgados.
  useEffect(
    () => () => drawings.forEach(d => URL.revokeObjectURL(d.url)),
    [drawings],
  );

  const remove = useCallback(
    async (id: string) => {
      await deleteDrawing(id);
      refresh();
    },
    [refresh],
  );

  return { drawings, refresh, remove };
}
