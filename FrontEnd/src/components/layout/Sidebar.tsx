import { NavLink } from 'react-router-dom'

import { useGetConditionsQuery } from '@/services/api'
import styles from './Sidebar.module.css'

interface SidebarProps {
  /** Se invoca al hacer clic en cualquier enlace — usado para cerrar el drawer en mobile. */
  onNavigate?: () => void
}

const navLinkClassName = ({ isActive }: { isActive: boolean }) =>
  isActive ? `${styles.navLink} ${styles.navLinkActive}` : styles.navLink

/**
 * Navegación lateral (docs/PROMPT.md §21). Los enlaces a las 7 condiciones se
 * generan a partir de `useGetConditionsQuery` (Mock API vía RTK Query) — sus
 * nombres y códigos nunca se hardcodean aquí (Fase 6, punto 5).
 */
export function Sidebar({ onNavigate }: SidebarProps) {
  const { data: conditions, isLoading, isError } = useGetConditionsQuery()
  const orderedConditions = conditions ? [...conditions].sort((a, b) => a.order - b.order) : []

  return (
    <aside className={styles.sidebar}>
      <div className={styles.brand}>
        <span className={styles.brandMark} aria-hidden="true">
          AE
        </span>
        <span className={styles.brandText}>
          Autoevaluación
          <br />
          Docencia Servicio
        </span>
      </div>

      <nav aria-label="Navegación principal" className={styles.section}>
        <span className={styles.sectionLabel}>General</span>
        <NavLink to="/dashboard" className={navLinkClassName} onClick={onNavigate}>
          Dashboard
        </NavLink>
        <NavLink to="/table-of-contents" className={navLinkClassName} onClick={onNavigate}>
          Tabla de contenido
        </NavLink>
        <NavLink to="/summary" className={navLinkClassName} onClick={onNavigate}>
          Consolidado
        </NavLink>
      </nav>

      <nav aria-label="Condiciones de calidad" className={styles.section}>
        <span className={styles.sectionLabel}>Condiciones</span>
        {isLoading && <span className={styles.helperText}>Cargando condiciones…</span>}
        {isError && <span className={styles.helperText}>No se pudieron cargar las condiciones.</span>}
        {orderedConditions.map((condition) => (
          <NavLink
            key={condition.id}
            to={`/conditions/${condition.id}`}
            className={navLinkClassName}
            onClick={onNavigate}
          >
            <span className={styles.conditionCode}>{condition.id}</span>
            <span className={styles.conditionName}>{condition.name}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
