/**
 * Prueba de integración RTK Query ↔ dominio (Fase 9): verifica el flujo
 * completo que `useScenarioSummary` implementa internamente —
 *
 *   updateEvaluation (mutación)
 *     → invalida el tag de `getEvaluationsByScenario`
 *     → un nuevo fetch trae las evaluaciones actualizadas
 *     → buildScenarioSummary() vuelve a ejecutar domain/compliance
 *     → el resultado presentado cambia
 *
 * Se ejercita contra el store real de Redux + los endpoints reales de
 * `services/api` (igual que las pruebas manuales de las Fases 5 y 7), no
 * renderizando el hook de React directamente — evita agregar una
 * dependencia de testing de componentes solo para esta verificación.
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
import { buildScenarioSummary } from '../utils/buildScenarioSummary'

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

describe('Guardar una evaluación recalcula el resultado (RTK Query → domain/compliance → UI)', () => {
  it('cambiar AG-04 de NC a C mejora el resultado de AG y del global', async () => {
    const before = await fetchSummary()
    const agBefore = before.conditionResults.find((r) => r.condition.id === 'AG')
    expect(agBefore?.objectiveResult.compliancePercentage).toBeCloseTo(6 / 7, 10)
    expect(agBefore?.objectiveResult.judgement?.code).toBe('B')

    const updateResult = await store.dispatch(
      evaluationsApi.endpoints.updateEvaluation.initiate({
        scenarioId: SCENARIO_ID,
        criterionId: 'AG-04',
        status: 'C',
        comments: 'Corregido tras revisión — prueba de recálculo de Fase 9.',
      }),
    )
    expect('data' in updateResult && updateResult.data?.status).toBe('C')

    const after = await fetchSummary()
    const agAfter = after.conditionResults.find((r) => r.condition.id === 'AG')

    // AG pasa de 6C/1NC/1NA (6/7 ≈ 85.71%, B) a 7C/0NC/1NA (7/7 = 100%, A).
    expect(agAfter?.objectiveResult.compliancePercentage).toBe(1)
    expect(agAfter?.objectiveResult.judgement?.code).toBe('A')
    expect(agAfter?.objectiveResult.compliantCount).toBe(7)
    expect(agAfter?.objectiveResult.nonCompliantCount).toBe(0)

    // El resultado global también cambia (AG mejoró, y solo AG cambió).
    expect(after.globalResult.compliancePercentage).not.toBe(before.globalResult.compliancePercentage)
    expect(after.globalResult.compliancePercentage ?? 0).toBeGreaterThan(
      before.globalResult.compliancePercentage ?? 0,
    )

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
