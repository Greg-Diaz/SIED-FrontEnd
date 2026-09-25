import type { ChartData } from '@/types'
import type { DashboardChartData, ScenarioSummary } from '../types'

/**
 * Capa "features" (Fase 10, docs/PROMPT.md — cadena
 * RTK Query → useScenarioSummary → buildScenarioSummary → domain/compliance
 * → ScenarioSummary → buildChartData → Dashboard): transforma un
 * `ScenarioSummary` YA CALCULADO por `buildScenarioSummary()`/
 * `domain/compliance` en datos aptos para las gráficas del Dashboard.
 *
 * NO recalcula compliance, progress, value, judgement ni status — todo eso
 * ya viene resuelto en `ScenarioSummary`. Esta función solo reordena/
 * reformatea (join + conversión de unidad para presentación), igual que
 * `buildScenarioSummary()` solo hace el "join" relacional sin implementar
 * fórmulas de negocio.
 *
 * Vive en `features/dashboard/` (no en `src/domain/compliance/`) porque
 * consume `ScenarioSummary`, un modelo de vista de Fase 9 — el dominio nunca
 * debe depender de un tipo de `features/` (evitaría invertir la dependencia
 * domain → features). `docs/PROMPT.md` Fase 10 permite explícitamente esta
 * "ubicación equivalente coherente con la arquitectura actual".
 *
 * Función pura: no muta `summary` ni ninguno de sus objetos anidados.
 */
export function buildChartData(summary: ScenarioSummary): DashboardChartData {
  return {
    complianceByCondition: buildComplianceByCondition(summary),
    distribution: buildDistribution(summary),
    progress: summary.globalProgress,
  }
}

/**
 * `compliancePercentage` es una fracción decimal (0-1) en el dominio
 * (docs/PROMPT.md Fase 8) — aquí se multiplica por 100 SOLO para el eje 0-100%
 * de la gráfica de barras (Fase 10 "Gráfico 1"); el `ObjectiveResult`
 * original nunca se modifica. Cuando la condición es `NOT_EVALUABLE`,
 * `value` se conserva `null` (nunca se convierte a `0`) y `isNotEvaluable`
 * queda en `true`, tal como exige el contrato de `ChartDataPoint`.
 */
function buildComplianceByCondition(summary: ScenarioSummary): ChartData {
  return summary.conditionResults.map(({ condition, objectiveResult }) => ({
    label: condition.id,
    value:
      objectiveResult.compliancePercentage === null
        ? null
        : objectiveResult.compliancePercentage * 100,
    isNotEvaluable: objectiveResult.status === 'NOT_EVALUABLE',
  }))
}

/**
 * Los 4 conteos de `globalResult` ya son la suma sobre las 7 condiciones
 * (`aggregateComplianceResults`, regla 4: los conteos SIEMPRE se suman, sin
 * importar si el agregado resultó `NOT_EVALUABLE`) — por eso reflejan los 43
 * criterios reales del escenario incluso cuando el global es `NOT_EVALUABLE`
 * (Fase 10 "Gráfico 2"). No se crea ningún JSON ni recuento nuevo aquí.
 */
function buildDistribution(summary: ScenarioSummary): ChartData {
  const { compliantCount, nonCompliantCount, notApplicableCount, pendingCount } =
    summary.globalResult

  return [
    { label: 'C', value: compliantCount },
    { label: 'NC', value: nonCompliantCount },
    { label: 'NA', value: notApplicableCount },
    { label: 'PENDING', value: pendingCount },
  ]
}
