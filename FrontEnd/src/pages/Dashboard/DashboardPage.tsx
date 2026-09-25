import { Link } from 'react-router-dom'

import { EmptyState } from '@/components/feedback/EmptyState'
import { ErrorState } from '@/components/feedback/ErrorState'
import { LoadingState } from '@/components/feedback/LoadingState'
import { PageHeader } from '@/components/common/PageHeader'
import { ObjectiveResultCard } from '@/components/results/ObjectiveResultCard'
import { ResultSummaryTable } from '@/components/results/ResultSummaryTable'
import { ProgressOverview } from '@/components/results/ProgressOverview'
import { ComplianceBarChart } from '@/features/dashboard/components/ComplianceBarChart'
import { EvaluationDistributionChart } from '@/features/dashboard/components/EvaluationDistributionChart'
import { KpiCard } from '@/features/dashboard/components/KpiCard'
import { useScenarioSummary } from '@/features/dashboard/hooks/useScenarioSummary'
import { buildChartData } from '@/features/dashboard/utils/buildChartData'
import { useActiveScenario } from '@/features/evaluation/hooks/useActiveScenario'
import { formatComplianceValue, formatPercentage } from '@/utils/formatCompliance'
import styles from './DashboardPage.module.css'

/**
 * Dashboard (Fase 10 — visual/analítico; antes tabular de Fase 9). Sigue
 * consumiendo EXACTAMENTE el mismo hook (`useScenarioSummary`) y los mismos
 * componentes de resultado (`ObjectiveResultCard`, `ResultSummaryTable`) que
 * `SummaryPage` — ninguna fórmula de cumplimiento se duplica aquí.
 *
 * Lo único nuevo de esta fase es `buildChartData()`
 * (`features/dashboard/utils/buildChartData.ts`), que reformatea (nunca
 * recalcula) el `ScenarioSummary` ya construido por `buildScenarioSummary()`
 * para alimentar las gráficas — la cadena completa es
 * RTK Query → useScenarioSummary → buildScenarioSummary → domain/compliance
 * → ScenarioSummary → buildChartData → Dashboard (docs/PROMPT.md Fase 10).
 *
 * La diferencia con `/summary` es de énfasis, no de fuente de datos: aquí
 * las tarjetas KPI y las gráficas van primero ("de un vistazo"), y no se
 * repite `ScenarioSummaryCard` (los datos generales del escenario) — ese
 * detalle sigue siendo exclusivo de Consolidado/Tabla de contenido.
 */
export function DashboardPage() {
  const { scenario, isLoading: isScenarioLoading, error: scenarioError } = useActiveScenario()
  const summary = useScenarioSummary(scenario)

  const isLoading = isScenarioLoading || summary.isLoading
  const error = scenarioError ?? summary.error
  const chartData = summary.data ? buildChartData(summary.data) : undefined

  return (
    <div className={styles.page}>
      <PageHeader
        eyebrow="Resumen"
        title="Dashboard"
        description="Vista rápida y visual del cumplimiento del escenario de práctica, calculada en tiempo real a partir de las evaluaciones registradas."
        actions={
          <Link className={styles.summaryLink} to="/summary">
            Ver consolidado →
          </Link>
        }
      />

      {isLoading && <LoadingState label="Calculando resultados…" />}
      {!isLoading && error && <ErrorState error={error} title="No se pudieron calcular los resultados" />}

      {!isLoading && !error && !scenario && (
        <EmptyState message="No hay ningún escenario de práctica registrado." />
      )}

      {!isLoading && !error && summary.data && chartData && (
        <>
          <section aria-label="Indicadores clave" className={styles.kpiGrid}>
            <KpiCard
              label="Cumplimiento"
              value={formatPercentage(summary.data.globalResult.compliancePercentage)}
              isMuted={summary.data.globalResult.compliancePercentage === null}
              {...(summary.data.globalResult.status === 'NOT_EVALUABLE'
                ? { helpText: 'No evaluable — hay al menos una condición sin criterios aplicables' }
                : {})}
            />
            <KpiCard
              label="Valor"
              value={
                summary.data.globalResult.value === null
                  ? formatComplianceValue(summary.data.globalResult.value)
                  : `${formatComplianceValue(summary.data.globalResult.value)} / 5`
              }
              isMuted={summary.data.globalResult.value === null}
            />
            <KpiCard
              label="Progreso"
              value={formatPercentage(summary.data.globalProgress.progressPercentage)}
              helpText={`${summary.data.globalProgress.evaluatedCount} de ${summary.data.globalProgress.totalCriteria} diligenciados`}
            />
            <KpiCard
              label="Pendientes"
              value={String(summary.data.globalProgress.pendingCount)}
              helpText={
                summary.data.globalProgress.pendingCount === 1 ? 'criterio por evaluar' : 'criterios por evaluar'
              }
            />
          </section>

          {/* Fase 12 §14 (accesibilidad, "headings coherentes"): antes esta
              tarjeta pasaba `title`, lo que generaba un <h3> colgando
              directo bajo el <h1> de PageHeader (sin un <h2> intermedio) Y
              apareciendo ANTES del <h2>"Condiciones" de más abajo — un orden
              no monótono. Se envuelve en su propia sección con <h2>, igual
              que ya hacían ConditionPage ("Resultado") y SummaryPage
              ("Cumplimiento total"), y se deja de pasar `title` a la tarjeta. */}
          <section aria-label="Resultado global">
            <h2 className="section-title">Resultado global</h2>
            <p className={styles.scenarioName}>{summary.data.scenario.practiceName}</p>
            <ObjectiveResultCard
              result={summary.data.globalResult}
              progress={summary.data.globalProgress}
            />
          </section>

          <section aria-label="Análisis visual" className={styles.chartsGrid}>
            <ComplianceBarChart data={chartData.complianceByCondition} />
            <div className={styles.chartsRow}>
              <EvaluationDistributionChart data={chartData.distribution} />
              <ProgressOverview progress={chartData.progress} />
            </div>
          </section>

          <section aria-label="Resumen por condición">
            <h2 className="section-title">Condiciones</h2>
            <ResultSummaryTable entries={summary.data.conditionResults} />
          </section>
        </>
      )}
    </div>
  )
}
