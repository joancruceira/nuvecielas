import { useState } from 'react';
import styles from './GameFrameScreen.module.css';

interface GameFrameScreenProps {
    /** URL del juego a embeber (en vivo o ruta local en /public). */
    src: string;
    /** Nombre del juego, para el loader y el title del iframe. */
    title: string;
    onBack: () => void;
}

/**
 * Embebe cualquier juego autocontenido (HTML/Canvas) dentro del hub.
 * Reutilizable: lo usamos para "Atrapa las Estrellas" y para el platformer
 * del Bosque Mágico pasándole distinto `src` + `title`.
 */
export function GameFrameScreen({ src, title, onBack }: GameFrameScreenProps) {
    const [loading, setLoading] = useState(true);

    return (
        <div className={styles.wrap}>
            <button className={styles.back} onClick={onBack} aria-label="Volver a juegos">
                ‹ Volver
            </button>

            {loading && (
                <div className={styles.loader} aria-live="polite">
                    <div className={styles.spinner} />
                    <p>Cargando {title}…</p>
                </div>
            )}

            <iframe
                className={styles.frame}
                src={src}
                title={title}
                onLoad={() => setLoading(false)}
                allow="autoplay; fullscreen; gamepad; accelerometer; gyroscope"
            />
        </div>
    );
}