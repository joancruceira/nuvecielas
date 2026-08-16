import { useCallback, useEffect, useState } from 'react';
import type { ScreenId } from '../types';
import { PATH_BY_SCREEN, screenFromHash } from '../routes';

/**
 * Navegación por hash. Devuelve la pantalla actual y una función para navegar.
 *
 * `navigate` no cambia el estado directamente: escribe el hash y deja que el
 * evento `hashchange` actualice el estado. Así el botón "atrás" del navegador
 * y la navegación del código pasan exactamente por el mismo camino.
 */
export function useHashRoute(): [ScreenId, (to: ScreenId) => void] {
  const [screen, setScreen] = useState<ScreenId>(() => screenFromHash(window.location.hash));

  useEffect(() => {
    // Primera carga sin hash: lo fijamos sin crear una entrada de historial,
    // para que el primer "atrás" salga del sitio y no quede en un bucle.
    if (!window.location.hash) {
      window.history.replaceState(null, '', `#${PATH_BY_SCREEN.home}`);
    }

    const onHashChange = () => setScreen(screenFromHash(window.location.hash));
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const navigate = useCallback((to: ScreenId) => {
    const next = `#${PATH_BY_SCREEN[to]}`;
    if (window.location.hash === next) return; // ya estamos ahí
    window.location.hash = next;
  }, []);

  return [screen, navigate];
}
