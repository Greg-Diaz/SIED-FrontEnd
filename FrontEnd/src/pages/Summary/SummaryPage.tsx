import { EmptyState } from '@/components/feedback/EmptyState'
import { ErrorState } from '@/components/feedback/ErrorState'
import { LoadingState } from '@/components/feedback/LoadingState'
import { PageHeader } from '@/components/common/PageHeader'
import { ObjectiveResultCard } from '@/components/results/ObjectiveResultCard'
import { ResultSummaryTable } from '@/components/results/ResultSummaryTable'
import { useScenarioSummary } from '@/features/dashboard/hooks/useScenarioSummary'
import { useActiveScenario } from '@/features/evaluation/hooks/useActiveScenario'
import { ScenarioSummaryCard } from '@/features/tableOfContents/components/ScenarioSummaryCard'
import styles from './SummaryPage.module.css'

/**
 * Consolidado (Fase 9 — antes placeholder de Fase 6). Corresponde al
 * "Consolidado" del Excel (docs/PROMPT.md §14): datos del escenario,
 * resultado global y resultado de las 7 condiciones. Todo el cálculo viene
 * de `useScenarioSummary` (features → domain/compliance) — esta página solo
 * presenta, no calcula nada.
 */
export function SummaryPage() {
  const { scenario, isLoading: isScenarioLoading, error: scenarioError } = useActiveScenario()
  const summary = useScenarioSummary(scenario)

  const isLoading = isScenarioLoading || summary.isLoading
  const error = scenarioError ?? summary.error

  return (
    <div className={styles.page}>
      <PageHeader
        eyebrow="Resultado final"
        title="Consolidado"
        description="Cumplimiento total del escenario: promedio simple de las 7 condiciones, calculado en tiempo real a partir de las evaluaciones registradas."
        breadcrumbs={[{ label: 'Dashboard', to: '/dashboard' }, { label: 'Consolidado' }]}
      />

      {isLoading && <LoadingState label="Calculando el consolidado…" />}
      {!isLoading && error && <ErrorState error={error} title="No se pudo calcular el consolidado" />}

      {!isLoading && !error && !scenario && (
        <EmptyState message="No hay ningún escenario de práctica registrado." />
      )}

      {!isLoading && !error && summary.data && (
        <>
          <ScenarioSummaryCard scenario={summary.data.scenario} />

          <section aria-label="Resultado global">
            <h2 className="section-title">Cumplimiento total</h2>
            <ObjectiveResultCard
              result={summary.data.globalResult}
              progress={summary.data.globalProgress}
            />
          </section>

          <section aria-label="Resumen por condición">
            <h2 className="section-title">Resumen por condición</h2>
            <ResultSummaryTable entries={summary.data.conditionResults} />
          </section>
        </>
      )}
    </div>
  )
}
