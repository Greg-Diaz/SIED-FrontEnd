import type { ChartData } from '@/types'
import styles from './EvaluationDistributionChart.module.css'

interface EvaluationDistributionChartProps {
  data: ChartData
}

/**
 * Colores decorativos por estado de evaluación — coherentes con la
 * semántica ya usada por `ComplianceStatusBadge` (verde=cumple,
 * ámbar=parcial/pendiente, gris=neutro), nunca la única forma de comunicar
 * el dato (siempre acompañados de la leyenda textual con conteo/porcentaje).
 */
const STATUS_COLORS: Record<string, string> = {
  C: '#2f9e58',
  NC: 'var(--color-danger)',
  NA: 'var(--color-text-muted)', // antes '#5a6472' — duplicaba el token existente (Fase 13 §2)
  PENDING: '#b6790c',
}

const STATUS_LABELS: Record<string, string> = {
  C: 'Cumple',
  NC: 'No cumple',
  NA: 'No aplica',
  PENDING: 'Pendiente',
}

/**
 * Gráfico 2 (Fase 10): distribución de evaluaciones C/NC/NA/PENDING.
 *
 * `data` viene de `buildChartData().distribution` — los 4 conteos ya
 * agregados en `ScenarioSummary.globalResult` (Fase 9); este componente no
 * cuenta evaluaciones ni crea ningún dato nuevo, solo dibuja lo recibido.
 *
 * Construido con CSS `conic-gradient` (sin librería de gráficas): un donut
 * decorativo (`aria-hidden` a nivel de segmento, con un único `aria-label`
 * resumen) más una leyenda textual con conteo y porcentaje — la leyenda es
 * la forma accesible de comunicar la misma información, nunca solo el color.
 */
export function EvaluationDistributionChart({ data }: EvaluationDistributionChartProps) {
  const total = data.reduce((sum, point) => sum + (point.value ?? 0), 0)

  let cursor = 0
  const gradientStops = data.map((point) => {
    const value = point.value ?? 0
    const start = total > 0 ? (cursor / total) * 360 : 0
    cursor += value
    const end = total > 0 ? (cursor / total) * 360 : 0
    const color = STATUS_COLORS[point.label] ?? 'var(--color-text-muted)'
    return `${color} ${start}deg ${end}deg`
  })

  const summaryText = data
    .map((point) => `${STATUS_LABELS[point.label] ?? point.label}: ${point.value ?? 0}`)
    .join(', ')

  return (
    <figure className={styles.figure} aria-label="Distribución de evaluaciones">
      <figcaption className={styles.caption}>Distribución de evaluaciones</figcaption>
      <div className={styles.body}>
        <div
          className={styles.donut}
          style={{
            background: total > 0 ? `conic-gradient(${gradientStops.join(', ')})` : 'var(--color-bg)',
          }}
          role="img"
          aria-label={`${summaryText}, de ${total} criterios en total`}
        >
          <div className={styles.donutHole}>
            <span className={styles.donutTotal}>{total}</span>
            <span className={styles.donutTotalLabel}>criterios</span>
          </div>
        </div>

        <ul className={styles.legend}>
          {data.map((point) => (
            <li key={point.label} className={styles.legendItem}>
              <span
                className={styles.swatch}
                style={{ background: STATUS_COLORS[point.label] ?? 'var(--color-text-muted)' }}
                aria-hidden="true"
              />
              <span className={styles.legendLabel}>{STATUS_LABELS[point.label] ?? point.label}</span>
              <span className={styles.legendCount}>{point.value ?? 0}</span>
              <span className={styles.legendPercent}>
                {total > 0 ? `${Math.round(((point.value ?? 0) / total) * 100)}%` : '0%'}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </figure>
  )
}
