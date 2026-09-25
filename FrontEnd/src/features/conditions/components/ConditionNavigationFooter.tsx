import { Link } from 'react-router-dom'

import type { Condition } from '@/types'
import styles from './ConditionNavigationFooter.module.css'

interface ConditionNavigationFooterProps {
  previousCondition?: Condition
  nextCondition?: Condition
}

/**
 * Acción clara al terminar una condición (Fase 11 §4, §5): anterior/siguiente
 * respetando `Condition.order` (decidido por el llamador vía
 * `getAdjacentConditions`, nunca hardcodeado aquí). Cuando no hay
 * `nextCondition` (última condición, CMC) enlaza a `/summary` — la ruta ya
 * existente del "Consolidado", sin crear una ruta nueva (§5). El copy usa
 * "Ver consolidado" (Fase 13 §26) para coincidir con el nombre que la app ya
 * usa en todas partes para esa ruta (Sidebar, `PageHeader`, Dashboard).
 *
 * Son `Link` normales: si `ConditionPage` tiene cambios sin guardar,
 * `useUnsavedChangesGuard` (§10) intercepta la navegación igual que
 * cualquier otro enlace de la app — no se duplica esa lógica aquí.
 */
export function ConditionNavigationFooter({
  previousCondition,
  nextCondition,
}: ConditionNavigationFooterProps) {
  return (
    <nav className={styles.nav} aria-label="Navegación entre condiciones">
      {previousCondition ? (
        <Link className={styles.link} to={`/conditions/${previousCondition.id}`}>
          ← {previousCondition.name}
        </Link>
      ) : (
        <span className={styles.placeholder} aria-hidden="true" />
      )}

      {nextCondition ? (
        <Link className={`${styles.link} ${styles.next}`} to={`/conditions/${nextCondition.id}`}>
          {nextCondition.name} →
        </Link>
      ) : (
        <Link className={`${styles.link} ${styles.next}`} to="/summary">
          Ver consolidado →
        </Link>
      )}
    </nav>
  )
}
