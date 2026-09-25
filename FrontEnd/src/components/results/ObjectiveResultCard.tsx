import type { ProgressResult } from '@/domain/compliance'
import type { ObjectiveResult } from '@/types'
import { formatComplianceValue, formatPercentage, NOT_EVALUABLE_EXPLANATION } from '@/utils/formatCompliance'
import { ComplianceStatusBadge } from './ComplianceStatusBadge'
import styles from './ObjectiveResultCard.module.css'

interface ObjectiveResultCardProps {
  title?: string
  result: ObjectiveResult
  progress: ProgressResult
}

/**
 * Componente reutilizable para presentar un `ObjectiveResult` completo
 * (Fase 9): cumplimiento, valor 0-5, juicio A-E, estado y progreso, más el
 * detalle de conteos C/NC/NA/PENDING. Usado tanto para el resultado de una
 * condición (`ConditionPage`) como para el resultado global
 * (`SummaryPage`/`DashboardPage`) — un solo componente, sin duplicar la
 * presentación entre páginas.
 *
 * Todos los valores ya vienen calculados por `domain/compliance/`; este
 * componente solo los formatea (`formatPercentage`/`formatComplianceValue`)
 * y los distribuye visualmente — no realiza ningún cálculo de negocio.
 */
export function ObjectiveResultCard({ title, result, progress }: ObjectiveResultCardProps) {
  const isNotEvaluable = result.status === 'NOT_EVALUABLE'
  // Cada barra usa la métrica de SU PROPIO número (Fase 11 §13, "diferenciar
  // progreso y cumplimiento"): un bug de Fase 9 dibujaba la barra de
  // "Cumplimiento" con el ancho de `progress.progressPercentage` en vez de
  // `result.compliancePercentage` — ambos números pueden diferir (p. ej. un
  // criterio PENDING deja el progreso por debajo del 100% mientras el
  // cumplimiento ya tiene un porcentaje propio sobre lo evaluado), así que la
  // barra visualmente contradecía al número que tenía justo encima. Ver
  // reporte de Fase 11, "Problemas encontrados".
  const complianceBarWidth = `${Math.round((result.compliancePercentage ?? 0) * 100)}%`
  const progressBarWidth = `${Math.round(progress.progressPercentage * 100)}%`

  return (
    <section className={styles.card} aria-label={title ? `Resultado — ${title}` : 'Resultado'}>
      <div className={styles.header}>
        {title && <h3 className={styles.title}>{title}</h3>}
        <ComplianceStatusBadge status={result.status} />
      </div>

      {isNotEvaluable && <p className={styles.notEvaluableNote}>{NOT_EVALUABLE_EXPLANATION}</p>}

      <div className={styles.metrics}>
        <div>
          <p className={styles.metricLabel}>Cumplimiento</p>
          <p className={isNotEvaluable ? `${styles.metricValue} ${styles.metricValueMuted}` : styles.metricValue}>
            {formatPercentage(result.compliancePercentage)}
          </p>
          <div className={styles.progressBar} role="presentation">
            <div
              className={styles.progressBarFill}
              style={{ width: isNotEvaluable ? '0%' : complianceBarWidth }}
            />
          </div>
        </div>

        <div>
          <p className={styles.metricLabel}>Valor</p>
          <p className={isNotEvaluable ? `${styles.metricValue} ${styles.metricValueMuted}` : styles.metricValue}>
            {formatComplianceValue(result.value)}
            {!isNotEvaluable && <span className={styles.metricSub}> / 5</span>}
          </p>
        </div>

        <div>
          <p className={styles.metricLabel}>Juicio</p>
          <p className={isNotEvaluable ? `${styles.metricValue} ${styles.metricValueMuted}` : styles.metricValue}>
            {result.judgement ? result.judgement.code : 'N/A'}
          </p>
          {result.judgement && <p className={styles.metricSub}>{result.judgement.label}</p>}
        </div>

        <div>
          <p className={styles.metricLabel}>Progreso</p>
          <p className={styles.metricValue}>{formatPercentage(progress.progressPercentage)}</p>
          <div className={styles.progressBar} role="presentation">
            <div className={styles.progressBarFill} style={{ width: progressBarWidth }} />
          </div>
          <p className={styles.metricSub}>
            {progress.evaluatedCount} de {progress.totalCriteria} diligenciados
          </p>
        </div>
      </div>

      <div className={styles.counts}>
        <div className={styles.countItem}>
          <span className={styles.countLabel}>C</span>
          <span className={styles.countValue}>{result.compliantCount}</span>
        </div>
        <div className={styles.countItem}>
          <span className={styles.countLabel}>NC</span>
          <span className={styles.countValue}>{result.nonCompliantCount}</span>
        </div>
        <div className={styles.countItem}>
          <span className={styles.countLabel}>NA</span>
          <span className={styles.countValue}>{result.notApplicableCount}</span>
        </div>
        <div className={styles.countItem}>
          <span className={styles.countLabel}>PENDING</span>
          <span className={styles.countValue}>{result.pendingCount}</span>
        </div>
      </div>
    </section>
  )
}
