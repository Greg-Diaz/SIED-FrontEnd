import { useActiveScenario } from '@/features/evaluation/hooks/useActiveScenario'
import styles from './Header.module.css'

interface HeaderProps {
  isSidebarOpen: boolean
  onToggleSidebar: () => void
}

/**
 * Barra superior — en mobile expone el botón que abre/cierra el drawer de
 * navegación. Fase 13 §4: además del nombre de la aplicación, comunica el
 * escenario de práctica activo cuando ya está disponible — es la MISMA
 * fuente que ya usan las páginas (`useActiveScenario`, sin fetch adicional:
 * RTK Query reutiliza la consulta ya cacheada), nunca un segundo selector de
 * escenario ni un cálculo propio.
 */
export function Header({ isSidebarOpen, onToggleSidebar }: HeaderProps) {
  const { scenario } = useActiveScenario()

  return (
    <header className={styles.header}>
      <button
        type="button"
        id="app-menu-button"
        className={styles.menuButton}
        aria-label={isSidebarOpen ? 'Cerrar navegación' : 'Abrir navegación'}
        aria-expanded={isSidebarOpen}
        aria-controls="app-sidebar"
        onClick={onToggleSidebar}
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <path
            d="M3 5h14M3 10h14M3 15h14"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      </button>
      <div className={styles.titles}>
        <span className={styles.title}>Autoevaluación de Escenarios de Práctica Formativa</span>
        {scenario && <span className={styles.scenario}>{scenario.practiceName}</span>}
      </div>
    </header>
  )
}
