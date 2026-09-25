import styles from './KpiCard.module.css'

interface KpiCardProps {
  label: string
  value: string
  helpText?: string
  isMuted?: boolean
}

/**
 * Tarjeta KPI compacta (Fase 10, "TARJETAS RESUMEN"): un solo número grande
 * por tarjeta, para escaneo rápido del estado de la autoevaluación.
 *
 * Recibe valores YA formateados (`formatPercentage`/`formatComplianceValue`,
 * `src/utils/formatCompliance.ts`) y YA calculados
 * (`ScenarioSummary.globalResult`/`globalProgress`, Fase 9) — no calcula ni
 * reformatea nada por sí misma, solo distribuye visualmente lo recibido.
 */
export function KpiCard({ label, value, helpText, isMuted }: KpiCardProps) {
  return (
    <div className={styles.card}>
      <p className={styles.label}>{label}</p>
      <p className={isMuted ? `${styles.value} ${styles.valueMuted}` : styles.value}>{value}</p>
      {helpText && <p className={styles.helpText}>{helpText}</p>}
    </div>
  )
}
