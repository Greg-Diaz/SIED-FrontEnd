import type { ProgressResult } from '@/domain/compliance'
import { formatPercentage } from '@/utils/formatCompliance'
import styles from './ProgressOverview.module.css'

interface ProgressOverviewProps {
  progress: ProgressResult
  /** Fase 11 §12: permite reutilizar el mismo componente para el progreso
   * global (Dashboard, Fase 10) y para el progreso de UNA condición
   * (`ConditionPage`) sin duplicarlo — solo cambia el título. */
  title?: string
}

/**
 * Progreso de diligenciamiento (Fase 10 "Gráfico 3"; promovido a
 * `components/results/` en Fase 11 §12 para reutilizarlo también en
 * `ConditionPage`, no solo en el Dashboard — mismo componente, sin duplicar
 * la presentación entre páginas).
 *
 * Recibe el `ProgressResult` TAL CUAL — `completed` (= `evaluatedCount`, es
 * decir C+NC+NA) y `pending` (= `pendingCount`) ya vienen calculados por
 * `calculateProgress()` (Fase 8).
 *
 * Deliberadamente NO usa `compliancePercentage` ni `value`: progreso mide
 * qué tan diligenciada está la evaluación, no cuánto se cumple — son dos
 * métricas independientes que nunca deben mezclarse (Fase 11 §12, §13).
 */
export function ProgressOverview({ progress, title = 'Progreso de evaluación' }: ProgressOverviewProps) {
  const percentLabel = formatPercentage(progress.progressPercentage, 0)
  const width = `${Math.round(progress.progressPercentage * 100)}%`

  return (
    <figure className={styles.figure} aria-label={title}>
      <figcaption className={styles.caption}>{title}</figcaption>

      <div className={styles.track} role="img" aria-label={`Evaluación completada al ${percentLabel}`}>
        <div className={styles.fill} style={{ width }} />
      </div>

      <p className={styles.percent}>{percentLabel} completado</p>
      <p className={styles.detail}>
        {progress.evaluatedCount} de {progress.totalCriteria} criterios evaluados
        {progress.pendingCount > 0 && (
          <>
            {' '}
            · {progress.pendingCount} {progress.pendingCount === 1 ? 'criterio pendiente' : 'criterios pendientes'}
          </>
        )}
      </p>
    </figure>
  )
}
