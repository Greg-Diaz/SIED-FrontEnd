/**
 * Prueba de integración (Fase 10): extiende la de Fase 9
 * (`useScenarioSummary.integration.test.ts`) un paso más —
 *
 *   updateEvaluation (mutación)
 *     → invalida el tag de `getEvaluationsByScenario`
 *     → un nuevo fetch trae las evaluaciones actualizadas
 *     → buildScenarioSummary() vuelve a ejecutar domain/compliance
 *     → buildChartData() reformatea el nuevo ScenarioSummary
 *     → los datos que alimentan las gráficas del Dashboard cambian
 *
 * Se ejercita contra el store real de Redux + los endpoints reales de
 * `services/api`, igual que la prueba de Fase 9 — sin montar React (evita
 * agregar una dependencia de testing de componentes solo para esta
 * verificación, ver el comentario de `useScenarioSummary.integration.test.ts`).
 *
 * `DashboardPage`, `SummaryPage` y `ConditionPage` llaman TODAS al mismo
 * `useScenarioSummary()`, suscrito al cache de RTK Query: cuando la mutación
 * invalida ese cache, React-Redux vuelve a renderizar automáticamente
 * cualquier componente suscrito — por eso esta prueba a nivel de datos
 * (RTK Query → dominio → `buildChartData`) certifica también el
 * comportamiento de las 3 páginas, sin necesidad de triplicar la prueba por
 * página ni de recargar nada.
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

const store = configureStore({
  reducer: { [baseApi.reducerPath]: baseApi.reducer },
  middleware: (getDefault) => getDefault().concat(baseApi.middleware),
})

const SCENARIO_ID = 'scenario-hospital-central'

async function fetchChartData() {
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

  const summary = buildScenarioSummary({
    scenario,
    conditions: conditions.data,
    subConditions: subConditions.data,
    criteria: criteria.data,
    evaluations: evaluations.data,
    objectives: objectives.data,
  })

  return buildChartData(summary)
}

describe('Guardar una evaluación recalcula los datos de las gráficas (RTK Query → domain/compliance → buildChartData)', () => {
  it('cambiar AG-04 de NC a C mueve la barra de AG de ≈85.71% a 100% y reduce NC en la distribución', async () => {
    const before = await fetchChartData()
    const agBefore = before.complianceByCondition.find((p) => p.label === 'AG')
    expect(agBefore?.value).toBeCloseTo((6 / 7) * 100, 10)

    const ncBefore = before.distribution.find((p) => p.label === 'NC')
    const cBefore = before.distribution.find((p) => p.label === 'C')

    const updateResult = await store.dispatch(
      evaluationsApi.endpoints.updateEvaluation.initiate({
        scenarioId: SCENARIO_ID,
        criterionId: 'AG-04',
        status: 'C',
        comments: 'Corregido tras revisión — prueba de recálculo de Fase 10.',
      }),
    )
    expect('data' in updateResult && updateResult.data?.status).toBe('C')

    const after = await fetchChartData()
    const agAfter = after.complianceByCondition.find((p) => p.label === 'AG')
    expect(agAfter?.value).toBe(100)
    expect(agAfter?.isNotEvaluable).toBe(false)

    // La distribución global también cambia: 1 criterio pasa de NC a C.
    const ncAfter = after.distribution.find((p) => p.label === 'NC')
    const cAfter = after.distribution.find((p) => p.label === 'C')
    expect((ncAfter?.value ?? 0)).toBe((ncBefore?.value ?? 0) - 1)
    expect((cAfter?.value ?? 0)).toBe((cBefore?.value ?? 0) + 1)

    // El progreso no cambia (AG-04 ya estaba diligenciado antes y después:
    // progreso ≠ cumplimiento, un cambio de NC a C no altera cuántos
    // criterios están evaluados).
    expect(after.progress.progressPercentage).toBe(before.progress.progressPercentage)

    // Revertir para no afectar otros tests que dependan del estado original.
    await store.dispatch(
      evaluationsApi.endpoints.updateEvaluation.initiate({
        scenarioId: SCENARIO_ID,
        criterionId: 'AG-04',
        status: 'NC',
        comments: '',
      }),
    )
  })
})
