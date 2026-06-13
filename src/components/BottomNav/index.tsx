import type { ScreenId } from '../../types';
import styles from './BottomNav.module.css';

interface NavItem {
  id: ScreenId;
  icon: string;
  label: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'home',       icon: '🏠', label: 'Inicio'  },
  { id: 'characters', icon: '✨', label: 'Amigas'  },
  { id: 'games',      icon: '🎮', label: 'Juegos'  },
];

interface BottomNavProps {
  current: ScreenId;
  onChange: (screen: ScreenId) => void;
}

export function BottomNav({ current, onChange }: BottomNavProps) {
  return (
    <nav className={styles.nav} role="navigation" aria-label="Navegación principal">
      {NAV_ITEMS.map(({ id, icon, label }) => (
        <button
          key={id}
          className={`${styles.item} ${current === id ? styles.active : ''}`}
          onClick={() => onChange(id)}
          aria-current={current === id ? 'page' : undefined}
          aria-label={label}
        >
          <span className={styles.icon} aria-hidden="true">{icon}</span>
          <span className={styles.label}>{label}</span>
        </button>
      ))}
    </nav>
  );
}