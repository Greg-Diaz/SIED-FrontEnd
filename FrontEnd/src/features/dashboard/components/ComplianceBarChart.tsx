import type { ChartData } from '@/types'
import styles from './ComplianceBarChart.module.css'

interface ComplianceBarChartProps {
  data: ChartData
}

const AXIS_TICKS = [0, 25, 50, 75, 100]

/**
 * Gráfico 1 (Fase 10): cumplimiento por condición, barras horizontales 0-100%.
 *
 * `data` viene de `buildChartData().complianceByCondition` — cada punto ya
 * trae el porcentaje convertido SOLO para presentación; ningún cálculo de
 * negocio ocurre en este componente.
 *
 * `isNotEvaluable` distingue explícitamente "0% de cumplimiento" (barra
 * vacía, valor `0`) de "no evaluable" (`value: null` → barra rayada + texto
 * "N/A") — nunca se dibuja `null` como una barra a `0` (docs/PROMPT.md
 * Fase 10, "CONDICIONES NOT_EVALUABLE").
 *
 * Construido con HTML/CSS puro (sin librería de gráficas): cada barra ya
 * incluye su valor como texto visible junto al `aria-label` del track, para
 * no depender únicamente del color/posición (accesibilidad).
 */
export function ComplianceBarChart({ data }: ComplianceBarChartProps) {
  return (
    <figure className={styles.figure} aria-label="Cumplimiento por condición">
      <figcaption className={styles.caption}>Cumplimiento por condición</figcaption>

      <ul className={styles.bars}>
        {data.map((point) => (
          <li key={point.label} className={styles.barRow}>
            <span className={styles.barLabel}>{point.label}</span>
            <div
              className={styles.track}
              role="img"
              aria-label={
                point.isNotEvaluable
                  ? `${point.label}: no evaluable`
                  : `${point.label}: ${(point.value ?? 0).toFixed(2)} por ciento de cumplimiento`
              }
            >
              {point.isNotEvaluable ? (
                <span className={styles.notEvaluableFill} aria-hidden="true" />
              ) : (
                <span
                  className={styles.fill}
                  style={{ width: `${Math.max(Math.min(point.value ?? 0, 100), 0)}%` }}
                  aria-hidden="true"
                />
              )}
            </div>
            <span
              className={point.isNotEvaluable ? `${styles.barValue} ${styles.barValueMuted}` : styles.barValue}
            >
              {point.isNotEvaluable ? 'N/A' : `${(point.value ?? 0).toFixed(2)}%`}
            </span>
          </li>
        ))}
      </ul>

      <div className={styles.axis} aria-hidden="true">
        <span />
        <span className={styles.axisTrack}>
          {AXIS_TICKS.map((tick) => (
            <span key={tick}>{tick}%</span>
          ))}
        </span>
        <span />
      </div>
    </figure>
  )
}
