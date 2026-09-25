/**
 * Prueba de integración UI/dominio (Fase 9): `buildScenarioSummary` es
 * exactamente la función que `useScenarioSummary` invoca con los datos que
 * RTK Query ya trajo — este test la ejercita directamente contra los DATOS
 * REALES de `src/mocks/` (sin necesidad de montar React ni el store, porque
 * es una función pura), cubriendo ambos escenarios exigidos por el encargo.
 */
import { describe, expect, it } from 'vitest'

import conditionsJson from '@/mocks/conditions.json'
import criteriaJson from '@/mocks/criteria.json'
import evaluationsJson from '@/mocks/evaluations.json'
import objectivesJson from '@/mocks/objectives.json'
import scenariosJson from '@/mocks/scenarios.json'
import subConditionsJson from '@/mocks/subConditions.json'
import type {
  Condition,
  Criterion,
  Evaluation,
  Objective,
  Scenario,
  SubCondition,
} from '@/types'
import { buildScenarioSummary } from './buildScenarioSummary'

const scenarios = scenariosJson as Scenario[]
const conditions = conditionsJson as Condition[]
const subConditions = subConditionsJson as SubCondition[]
const criteria = criteriaJson as Criterion[]
const evaluations = evaluationsJson as Evaluation[]
const objectives = objectivesJson as Objective[]

function summaryFor(scenarioId: string) {
  const scenario = scenarios.find((s) => s.id === scenarioId)
  if (!scenario) throw new Error(`Escenario de prueba "${scenarioId}" no encontrado en los mocks.`)

  return buildScenarioSummary({
    scenario,
    conditions,
    subConditions,
    criteria,
    evaluations: evaluations.filter((e) => e.scenarioId === scenarioId),
    objectives,
  })
}

function findCondition(summary: ReturnType<typeof summaryFor>, conditionId: string) {
  const entry = summary.conditionResults.find((r) => r.condition.id === conditionId)
  if (!entry) throw new Error(`Condición "${conditionId}" no encontrada en el resumen.`)
  return entry
}

describe('buildScenarioSummary — scenario-hospital-central', () => {
  const summary = summaryFor('scenario-hospital-central')

  it('incluye las 7 condiciones, cada una con su Objective correspondiente', () => {
    expect(summary.conditionResults).toHaveLength(7)
    for (const entry of summary.conditionResults) {
      expect(entry.objective.conditionId).toBe(entry.condition.id)
      expect(entry.objectiveResult.objectiveId).toBe(entry.objective.id)
    }
  })

  it('AG ≈ 85.71%, EVALUATED, con value y judgement B calculados', () => {
    const ag = findCondition(summary, 'AG')
    expect(ag.objectiveResult.compliancePercentage).toBeCloseTo(6 / 7, 10)
    expect(ag.objectiveResult.status).toBe('EVALUATED')
    expect(ag.objectiveResult.value).toBeCloseTo((6 / 7) * 5, 10)
    expect(ag.objectiveResult.judgement?.code).toBe('B')
  })

  it('CI = 75%, con sus 2 subcondiciones (2.1 y 2.2) expuestas individualmente', () => {
    const ci = findCondition(summary, 'CI')
    expect(ci.subConditionResults).toHaveLength(2)
    expect(ci.subConditionResults[0]?.result.compliancePercentage).toBeCloseTo(0.75, 10)
    expect(ci.subConditionResults[1]?.result.compliancePercentage).toBeCloseTo(0.75, 10)
    expect(ci.objectiveResult.compliancePercentage).toBeCloseTo(0.75, 10)
    expect(ci.objectiveResult.status).toBe('EVALUATED')
  })

  it('PD y PF quedan PARTIAL (tienen criterios PENDING)', () => {
    expect(findCondition(summary, 'PD').objectiveResult.status).toBe('PARTIAL')
    expect(findCondition(summary, 'PF').objectiveResult.status).toBe('PARTIAL')
  })

  it('Global ≈ 67.24%, PARTIAL, con value y judgement D calculados por el dominio', () => {
    expect(summary.globalResult.compliancePercentage).toBeCloseTo(0.6724489796, 9)
    expect(summary.globalResult.status).toBe('PARTIAL')
    expect(summary.globalResult.value).toBeCloseTo(0.6724489796 * 5, 8)
    expect(summary.globalResult.judgement?.code).toBe('D')
    expect(summary.globalObjective.conditionId).toBeNull()
  })

  it('el progreso global es distinto del cumplimiento global (dos métricas independientes)', () => {
    expect(summary.globalProgress.progressPercentage).not.toBe(summary.globalResult.compliancePercentage)
    expect(summary.globalProgress.totalCriteria).toBe(43)
  })
})

describe('buildScenarioSummary — scenario-centro-comunitario (propagación de NOT_EVALUABLE)', () => {
  const summary = summaryFor('scenario-centro-comunitario')

  it('CI 2.1 = NOT_EVALUABLE, CI 2.2 evaluable → CI (condición) = NOT_EVALUABLE', () => {
    const ci = findCondition(summary, 'CI')
    const [ci21, ci22] = ci.subConditionResults
    expect(ci21?.result.status).toBe('NOT_EVALUABLE')
    expect(ci22?.result.status).toBe('EVALUATED')
    expect(ci22?.result.compliancePercentage).toBeCloseTo(7 / 9, 10)

    expect(ci.objectiveResult.status).toBe('NOT_EVALUABLE')
    expect(ci.objectiveResult.compliancePercentage).toBeNull()
    expect(ci.objectiveResult.value).toBeNull()
    expect(ci.objectiveResult.judgement).toBeNull()
  })

  it('CMC = NOT_EVALUABLE (ambos criterios en NA)', () => {
    const cmc = findCondition(summary, 'CMC')
    expect(cmc.objectiveResult.status).toBe('NOT_EVALUABLE')
  })

  it('Global = NOT_EVALUABLE por propagación desde CI y CMC, sin excluir ningún criterio del conteo', () => {
    expect(summary.globalResult.status).toBe('NOT_EVALUABLE')
    expect(summary.globalResult.compliancePercentage).toBeNull()
    expect(summary.globalResult.value).toBeNull()
    expect(summary.globalResult.judgement).toBeNull()
    expect(summary.globalResult.totalCriteria).toBe(43)
  })

  it('el progreso global SIGUE siendo un número normal aunque el cumplimiento sea NOT_EVALUABLE', () => {
    // Confirma que progreso y cumplimiento son independientes también a
    // nivel global: NOT_EVALUABLE en cumplimiento no vuelve nulo el progreso.
    expect(summary.globalProgress.progressPercentage).toBeGreaterThan(0)
    expect(Number.isFinite(summary.globalProgress.progressPercentage)).toBe(true)
  })
})
