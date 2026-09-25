import { Link } from 'react-router-dom'

import type { ConditionResultEntry } from '@/features/dashboard/types'
import { formatComplianceValue, formatPercentage } from '@/utils/formatCompliance'
import { ComplianceStatusBadge } from './ComplianceStatusBadge'
import styles from './ResultSummaryTable.module.css'

interface ResultSummaryTableProps {
  entries: readonly ConditionResultEntry[]
}

/**
 * Tabla de resumen de las 7 condiciones (Fase 9) — reutilizada tal cual por
 * `SummaryPage` y `DashboardPage` para no duplicar la presentación entre
 * ambas páginas. Cada fila navega a `/conditions/:conditionId`.
 */
export function ResultSummaryTable({ entries }: ResultSummaryTableProps) {
  return (
    <div className={styles.wrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th scope="col">Código</th>
            <th scope="col">Condición</th>
            <th scope="col">Cumplimiento</th>
            <th scope="col">Valor</th>
            <th scope="col">Juicio</th>
            <th scope="col">Estado</th>
            <th scope="col">Progreso</th>
          </tr>
        </thead>
        <tbody>
          {entries.map(({ condition, objectiveResult, progress }) => (
            <tr key={condition.id}>
              <td>
                <Link className={styles.rowLink} to={`/conditions/${condition.id}`}>
                  <span className={styles.code}>{condition.id}</span>
                </Link>
              </td>
              <td>
                <Link className={styles.rowLink} to={`/conditions/${condition.id}`}>
                  {condition.name}
                </Link>
              </td>
              <td>{formatPercentage(objectiveResult.compliancePercentage)}</td>
              <td className={objectiveResult.value === null ? styles.muted : undefined}>
                {formatComplianceValue(objectiveResult.value)}
              </td>
              <td className={!objectiveResult.judgement ? styles.muted : undefined}>
                {objectiveResult.judgement ? objectiveResult.judgement.code : 'N/A'}
              </td>
              <td>
                <ComplianceStatusBadge status={objectiveResult.status} />
              </td>
              <td>{formatPercentage(progress.progressPercentage)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
