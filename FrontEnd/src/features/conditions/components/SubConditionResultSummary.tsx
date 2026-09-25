import { ComplianceStatusBadge } from '@/components/results/ComplianceStatusBadge'
import type { SubConditionResultEntry } from '@/features/dashboard/types'
import { formatPercentage, NOT_EVALUABLE_EXPLANATION } from '@/utils/formatCompliance'
import styles from './SubConditionResultSummary.module.css'

interface SubConditionResultSummaryProps {
  entry: SubConditionResultEntry
}

/**
 * Fila compacta con el cumplimiento de UNA subcondición (Fase 9) — usada
 * solo para Capacidad Instalada (2.1 y 2.2), que es la única condición con
 * más de una subcondición. No muestra valor 0-5 ni juicio A-E: esas métricas
 * están ligadas a un `Objective`, y no existe ningún `Objective` a nivel de
 * subcondición en los mocks (docs/PROMPT.md §13) — solo la condición
 * completa (CI) y el global tienen esa forma completa de resultado.
 */
export function SubConditionResultSummary({ entry }: SubConditionResultSummaryProps) {
  const { subCondition, result } = entry
  const isNotEvaluable = result.status === 'NOT_EVALUABLE'

  return (
    <div className={styles.wrapper}>
      <div className={styles.row}>
        <span className={styles.label}>
          <span className={styles.code}>{subCondition.code}</span>
          <span>{subCondition.name}</span>
        </span>
        <span className={styles.value}>
          <span className={isNotEvaluable ? `${styles.percentage} ${styles.percentageMuted}` : styles.percentage}>
            {formatPercentage(result.compliancePercentage)}
          </span>
          <ComplianceStatusBadge status={result.status} />
        </span>
      </div>
      {isNotEvaluable && <p className={styles.note}>{NOT_EVALUABLE_EXPLANATION}</p>}
    </div>
  )
}
