import { Link } from 'react-router-dom'

import { CompletionStatusBadge } from '@/components/results/CompletionStatusBadge'
import type { ConditionResultEntry } from '@/features/dashboard/types'
import type { Condition } from '@/types'
import { formatPercentage } from '@/utils/formatCompliance'
import { getCompletionStatus } from '@/utils/getCompletionStatus'
import styles from './ConditionListItem.module.css'

interface ConditionListItemProps {
  condition: Condition
  subConditionCount: number
  criterionCount: number
  /**
   * Resumen calculado de esta condición (Fase 9 vía `useScenarioSummary` →
   * Fase 11 §2, "TABLE OF CONTENTS": completados/pendientes/% y estado de
   * completitud). `undefined` mientras el resumen aún no está disponible —
   * en ese caso la fila solo muestra los conteos estructurales, sin
   * bloquear la navegación (realce progresivo, igual que en Fase 9).
   */
  conditionResult?: ConditionResultEntry
}

/**
 * Entrada de la Tabla de Contenido para una condición. `subConditionCount` y
 * `criterionCount` son conteos estructurales simples (longitud de arreglos
 * ya filtrados) — no son un cálculo de cumplimiento. Todo lo que sí depende
 * del motor de cálculo (`progress`, `objectiveResult.status`) llega YA
 * CALCULADO dentro de `conditionResult` — esta fila solo lo formatea
 * (`formatPercentage`, `getCompletionStatus`), nunca lo recalcula.
 */
export function ConditionListItem({
  condition,
  subConditionCount,
  criterionCount,
  conditionResult,
}: ConditionListItemProps) {
  const progress = conditionResult?.progress

  return (
    <Link className={styles.item} to={`/conditions/${condition.id}`}>
      <span className={styles.code} aria-hidden="true">
        {condition.id}
      </span>
      <span className={styles.body}>
        <span className={styles.name}>{condition.name}</span>
        <span className={styles.meta}>
          {criterionCount} {criterionCount === 1 ? 'criterio' : 'criterios'}
          {subConditionCount > 1 ? ` · ${subConditionCount} subcondiciones` : ''}
        </span>
        {progress && (
          <span className={styles.progressDetail}>
            {progress.evaluatedCount} / {progress.totalCriteria} criterios evaluados ·{' '}
            {formatPercentage(progress.progressPercentage, 0)} completado
          </span>
        )}
      </span>
      {conditionResult && progress && (
        <CompletionStatusBadge
          completionStatus={getCompletionStatus(conditionResult.objectiveResult.status, progress)}
        />
      )}
      <span className={styles.chevron} aria-hidden="true">
        →
      </span>
    </Link>
  )
}
