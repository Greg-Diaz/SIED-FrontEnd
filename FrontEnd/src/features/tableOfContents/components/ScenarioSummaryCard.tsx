import type { Scenario } from '@/types'
import styles from './ScenarioSummaryCard.module.css'

interface ScenarioSummaryCardProps {
  scenario: Scenario
}

/**
 * Muestra los 4 campos estructurados del escenario (docs/PROMPT.md §9,
 * §40.1 regla 16) — reemplazan el bloque de texto libre único del Excel.
 */
export function ScenarioSummaryCard({ scenario }: ScenarioSummaryCardProps) {
  return (
    <section className={styles.card} aria-label="Datos generales del escenario">
      <p className={styles.name}>{scenario.practiceName}</p>
      <dl className={styles.grid}>
        <div className={styles.field}>
          <dt>Municipio</dt>
          <dd>{scenario.municipality}</dd>
        </div>
        <div className={styles.field}>
          <dt>Servicios a prestar</dt>
          <dd>{scenario.servicesToProvide}</dd>
        </div>
        <div className={styles.field}>
          <dt>Elaborado por</dt>
          <dd>{scenario.preparedBy}</dd>
        </div>
      </dl>
    </section>
  )
}
