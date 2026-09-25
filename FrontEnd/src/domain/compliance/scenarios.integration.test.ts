/**
 * Validación del motor de cálculo contra los DATOS REALES de los dos
 * escenarios mock (Fase 8 §23) — no solo casos sintéticos.
 *
 * Importa los JSON de `src/mocks/` directamente: es una decisión válida
 * SOLO en un test (verificar el motor contra datos reales), nunca dentro de
 * `src/domain/` en sí, que jamás debe conocer el origen de los datos
 * (docs/PROMPT.md §21, §26 de esta fase). El "join" criteria/subConditions
 * ↔ evaluations ocurre aquí mismo, no en el dominio.
 */
import { describe, expect, it } from 'vitest'

import conditionsJson from '@/mocks/conditions.json'
import criteriaJson from '@/mocks/criteria.json'
import evaluationsJson from '@/mocks/evaluations.json'
import subConditionsJson from '@/mocks/subConditions.json'
import type { ComplianceResult, Condition, Criterion, Evaluation, SubCondition } from '@/types'
import { calculateCompliance } from './calculateCompliance'
import { calculateConditionSummary } from './calculateConditionSummary'
import { calculateGlobalSummary } from './calculateGlobalSummary'

const conditions = conditionsJson as Condition[]
const subConditions = subConditionsJson as SubCondition[]
const criteria = criteriaJson as Criterion[]
const evaluations = evaluationsJson as Evaluation[]

function subConditionResult(scenarioId: string, subConditionId: string): ComplianceResult {
  const criterionIds = new Set(
    criteria.filter((c) => c.subConditionId === subConditionId).map((c) => c.id),
  )
  const relevant = evaluations.filter(
    (e) => e.scenarioId === scenarioId && criterionIds.has(e.criterionId),
  )
  return calculateCompliance(relevant)
}

function conditionResult(scenarioId: string, conditionId: string): ComplianceResult {
  const subs = subConditions.filter((sc) => sc.conditionId === conditionId)
  return calculateConditionSummary(subs.map((sc) => subConditionResult(scenarioId, sc.id)))
}

function globalResult(scenarioId: string): ComplianceResult {
  return calculateGlobalSummary(conditions.map((c) => conditionResult(scenarioId, c.id)))
}

describe('Motor de cálculo — scenario-hospital-central (real)', () => {
  const scenarioId = 'scenario-hospital-central'

  it('AG: 6C/1NC/1NA de 8 → 6/7 ≈ 85.71%, EVALUATED', () => {
    const result = conditionResult(scenarioId, 'AG')
    expect(result.compliancePercentage).toBeCloseTo(6 / 7, 10)
    expect(result.status).toBe('EVALUATED')
  })

  it('CI: 2.1 (3/4=75%) y 2.2 (6/8=75%) → CI = 75%, EVALUATED', () => {
    const ci21 = subConditionResult(scenarioId, 'CI-2.1')
    const ci22 = subConditionResult(scenarioId, 'CI-2.2')
    expect(ci21.compliancePercentage).toBeCloseTo(0.75, 10)
    expect(ci22.compliancePercentage).toBeCloseTo(0.75, 10)

    const ci = conditionResult(scenarioId, 'CI')
    expect(ci.compliancePercentage).toBeCloseTo(0.75, 10)
    expect(ci.status).toBe('EVALUATED')
    expect(ci.totalCriteria).toBe(13)
  })

  it('PD y PF tienen criterios PENDING → PARTIAL', () => {
    expect(conditionResult(scenarioId, 'PD').status).toBe('PARTIAL')
    expect(conditionResult(scenarioId, 'PF').status).toBe('PARTIAL')
  })

  it('Global: PARTIAL (por PD/PF) con promedio simple de las 7 condiciones ≈ 67.24%', () => {
    const result = globalResult(scenarioId)
    expect(result.status).toBe('PARTIAL')
    expect(result.compliancePercentage).toBeCloseTo(0.6724489796, 9)
  })
})

describe('Motor de cálculo — scenario-centro-comunitario (real, con NOT_EVALUABLE)', () => {
  const scenarioId = 'scenario-centro-comunitario'

  it('CI 2.1: todos sus criterios en NA → NOT_EVALUABLE', () => {
    const ci21 = subConditionResult(scenarioId, 'CI-2.1')
    expect(ci21.effectiveCriteria).toBe(0)
    expect(ci21.status).toBe('NOT_EVALUABLE')
    expect(ci21.compliancePercentage).toBeNull()
  })

  it('CI 2.2: evaluable (7/9 ≈ 77.78%), EVALUATED', () => {
    const ci22 = subConditionResult(scenarioId, 'CI-2.2')
    expect(ci22.compliancePercentage).toBeCloseTo(7 / 9, 10)
    expect(ci22.status).toBe('EVALUATED')
  })

  it('CI (condición): NOT_EVALUABLE por propagación desde 2.1, aunque 2.2 sea evaluable', () => {
    const ci = conditionResult(scenarioId, 'CI')
    expect(ci.status).toBe('NOT_EVALUABLE')
    expect(ci.compliancePercentage).toBeNull()
  })

  it('CMC: ambos criterios en NA → NOT_EVALUABLE', () => {
    const cmc = conditionResult(scenarioId, 'CMC')
    expect(cmc.status).toBe('NOT_EVALUABLE')
  })

  it('Global: NOT_EVALUABLE por propagación (CI y CMC), pese a que las otras 5 condiciones sí son evaluables', () => {
    const result = globalResult(scenarioId)
    expect(result.status).toBe('NOT_EVALUABLE')
    expect(result.compliancePercentage).toBeNull()

    // Confirma explícitamente que NO se excluyeron CI/CMC del promedio: los
    // conteos agregados siguen incluyendo los 43 criterios del escenario.
    expect(result.totalCriteria).toBe(43)
  })
})
