import { Link } from 'react-router-dom'

import styles from './ContinueEvaluationAction.module.css'

interface ContinueEvaluationActionProps {
  to: string
  label: string
}

/**
 * Acción de continuación (Fase 11 §19, §20): un único enlace prominente, sin
 * lógica propia — `TableOfContentsPage` ya resolvió `to`/`label` a partir de
 * `findContinueEvaluationTarget()` (primer bloque `PENDING` por
 * `Condition.order`, o `/summary` si todo está completo). Componente
 * puramente presentacional para no mezclar esa decisión con su render.
 */
export function ContinueEvaluationAction({ to, label }: ContinueEvaluationActionProps) {
  return (
    <Link className={styles.action} to={to}>
      {label}
    </Link>
  )
}
