/**
 * Prueba de "flujo completo" (Fase 11 §34, §35, §36) — equivalente, a nivel
 * de datos, al recorrido manual descrito en el encargo:
 *
 *   1-2. Table of Contents: ver progreso de condiciones → aquí,
 *        `findContinueEvaluationTarget` sobre el `ScenarioSummary` inicial.
 *   3.   Seleccionar la condición pendiente que la propia función señala.
 *   4-6. Evaluar un criterio PENDING (PD-04) y guardarlo (`updateEvaluation`,
 *        el mismo camino que usa `EvaluationForm`/`EvaluationSaveButton`).
 *   7-8. El progreso Y el resultado de PD cambian.
 *   9-11. "Ver consolidado" recalcula automáticamente — no hay nada que
 *        "regresar a refrescar" manualmente: `ScenarioSummary` es la MISMA
 *        fuente para las 3 páginas (§34, punto 14).
 *   12-13. `SummaryPage`/`DashboardPage` leen el mismo `ScenarioSummary` (y
 *        `buildChartData` lo reformatea) — se verifica aquí que ambos
 *        derivados quedan consistentes entre sí tras el cambio.
 *
 * No se monta React (mismo criterio que las pruebas de integración de Fase 9
 * y 10: el proyecto no tiene infraestructura de testing de componentes, y
 * agregarla solo para esto sería una dependencia nueva no justificada, §37).
 * En su lugar se ejercita la MISMA cadena que las 3 páginas usan por debajo:
 * RTK Query → buildScenarioSummary → domain/compliance → buildChartData /
 * findContinueEvaluationTarget. Como `ConditionPage`, `SummaryPage` y
 * `DashboardPage` comparten el único hook `useScenarioSummary` suscrito al
 * cache de RTK Query, una invalidación de éste vuelve a renderizar las 3
 * automáticamente — verificarlo a este nivel certifica la consistencia entre
 * las 3 páginas sin necesidad de triplicar la prueba por página.
 */
import { configureStore } from '@reduxjs/toolkit'
import { describe, expect, it } from 'vitest'

import { baseApi } from '@/services/api/baseApi'
import { conditionsApi } from '@/services/api/conditionsApi'
import { criteriaApi } from '@/services/api/criteriaApi'
import { evaluationsApi } from '@/services/api/evaluationsApi'
import { objectivesApi } from '@/services/api/objectivesApi'
import { scenariosApi } from '@/services/api/scenariosApi'
import { subConditionsApi } from '@/services/api/subConditionsApi'
import { buildScenarioSummary } from './buildScenarioSummary'
import { buildChartData } from './buildChartData'
import { findContinueEvaluationTarget } from './findContinueEvaluationTarget'

const store = configureStore({
  reducer: { [baseApi.reducerPath]: baseApi.reducer },
  middleware: (getDefault) => getDefault().concat(baseApi.middleware),
})

const SCENARIO_ID = 'scenario-hospital-central'

async function fetchSummary() {
  const [scenarios, conditions, subConditions, criteria, objectives, evaluations] = await Promise.all([
    store.dispatch(scenariosApi.endpoints.getScenarios.initiate()),
    store.dispatch(conditionsApi.endpoints.getConditions.initiate()),
    store.dispatch(subConditionsApi.endpoints.getSubConditions.initiate()),
    store.dispatch(criteriaApi.endpoints.getCriteria.initiate()),
    store.dispatch(objectivesApi.endpoints.getObjectives.initiate()),
    store.dispatch(
      evaluationsApi.endpoints.getEvaluationsByScenario.initiate(SCENARIO_ID, { forceRefetch: true }),
    ),
  ])

  const scenario = scenarios.data?.find((s) => s.id === SCENARIO_ID)
  if (!scenario || !conditions.data || !subConditions.data || !criteria.data || !objectives.data || !evaluations.data) {
    throw new Error('Datos incompletos al construir el resumen de prueba.')
  }

  return buildScenarioSummary({
    scenario,
    conditions: conditions.data,
    subConditions: subConditions.data,
    criteria: criteria.data,
    evaluations: evaluations.data,
    objectives: objectives.data,
  })
}

describe('Flujo completo — Table of Contents → Condición → Guardar → Summary/Dashboard consistentes', () => {
  it('recorre el flujo end-to-end sobre scenario-hospital-central', async () => {
    // 1-3. Table of Contents: "Continuar evaluación" señala PD (primera
    // condición, por `order`, con un criterio PENDING — ver PROMPT §33).
    const before = await fetchSummary()
    expect(findContinueEvaluationTarget(before.conditionResults)).toEqual({
      type: 'condition',
      conditionId: 'PD',
    })

    const pdBefore = before.conditionResults.find((r) => r.condition.id === 'PD')
    expect(pdBefore?.progress.pendingCount).toBe(1)
    expect(pdBefore?.progress.evaluatedCount).toBe(3)
    expect(pdBefore?.objectiveResult.status).toBe('PARTIAL')

    const globalProgressBefore = before.globalProgress
    const globalComplianceBefore = before.globalResult.compliancePercentage

    // 4-6. Evaluar PD-04 (el criterio PENDING de PD) y guardarlo — mismo
    // camino que `EvaluationForm.handleSave()` → `updateEvaluation`.
    const updateResult = await store.dispatch(
      evaluationsApi.endpoints.updateEvaluation.initiate({
        scenarioId: SCENARIO_ID,
        criterionId: 'PD-04',
        status: 'C',
        comments: 'Evaluado durante la prueba de flujo completo — Fase 11.',
      }),
    )
    expect('data' in updateResult && updateResult.data?.status).toBe('C')

    // 7-8. El progreso Y el resultado de PD cambian (sin recargar nada: la
    // siguiente consulta ya trae los datos actualizados vía invalidación de
    // tags de RTK Query).
    const after = await fetchSummary()
    const pdAfter = after.conditionResults.find((r) => r.condition.id === 'PD')
    expect(pdAfter?.progress.pendingCount).toBe(0)
    expect(pdAfter?.progress.evaluatedCount).toBe(4)
    expect(pdAfter?.objectiveResult.status).toBe('EVALUATED')
    // PD-01=C, PD-02=NC, PD-03=C, PD-04 pasa de PENDING a C → 3 de 4 = 75%.
    expect(pdAfter?.objectiveResult.compliancePercentage).toBeCloseTo(0.75, 10)

    // El progreso GLOBAL avanza (un criterio menos pendiente)...
    expect(after.globalProgress.pendingCount).toBe(globalProgressBefore.pendingCount - 1)
    // ...y el cumplimiento global también cambia (PD mejoró) — progreso y
    // cumplimiento son métricas independientes que aquí cambian a la vez,
    // pero por razones distintas (§13).
    expect(after.globalResult.compliancePercentage).not.toBe(globalComplianceBefore)

    // 9-11. "Continuar evaluación" ahora debe señalar PF (la siguiente
    // condición pendiente, por `order`) — PD ya no tiene nada pendiente.
    expect(findContinueEvaluationTarget(after.conditionResults)).toEqual({
      type: 'condition',
      conditionId: 'PF',
    })

    // 12-13. Summary/Dashboard leen el MISMO `ScenarioSummary`: se verifica
    // que `buildChartData` (Dashboard) queda consistente con
    // `conditionResults`/`globalResult` (Summary) tras el cambio, sin volver
    // a calcular nada por su cuenta.
    const chartData = buildChartData(after)
    const pdChartPoint = chartData.complianceByCondition.find((point) => point.label === 'PD')
    expect(pdChartPoint?.value).toBeCloseTo(75, 10)
    expect(pdChartPoint?.isNotEvaluable).toBe(false)
    expect(chartData.progress).toBe(after.globalProgress)
    const totalDistribution = chartData.distribution.reduce((sum, point) => sum + (point.value ?? 0), 0)
    expect(totalDistribution).toBe(43)

    // Revertir para no afectar otras pruebas que dependan del estado original.
    await store.dispatch(
      evaluationsApi.endpoints.updateEvaluation.initiate({
        scenarioId: SCENARIO_ID,
        criterionId: 'PD-04',
        status: 'PENDING',
        comments: '',
      }),
    )
    const reverted = await fetchSummary()
    expect(findContinueEvaluationTarget(reverted.conditionResults)).toEqual({
      type: 'condition',
      conditionId: 'PD',
    })
  })
})
