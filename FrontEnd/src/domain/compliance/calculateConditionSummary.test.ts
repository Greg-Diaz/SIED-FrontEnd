import { describe, expect, it } from 'vitest'

import { calculateConditionSummary } from './calculateConditionSummary'
import { makeComplianceResult } from './complianceTestHelpers'

describe('calculateConditionSummary', () => {
  it('condición de una sola subcondición (AG, SPyB, OADS, PD, PF, CMC): resultado = el de la subcondición, sin ponderación', () => {
    const subCondition = makeComplianceResult({ compliancePercentage: 0.6, status: 'EVALUATED' })
    const result = calculateConditionSummary([subCondition])
    expect(result.compliancePercentage).toBe(0.6)
    expect(result.status).toBe('EVALUATED')
    expect(result.totalCriteria).toBe(subCondition.totalCriteria)
  })

  it('CI: ambas subcondiciones evaluables → promedio simple (Caso E: 80% y 90% → 85%)', () => {
    const ci21 = makeComplianceResult({ compliancePercentage: 0.8 })
    const ci22 = makeComplianceResult({ compliancePercentage: 0.9 })
    const result = calculateConditionSummary([ci21, ci22])
    expect(result.compliancePercentage).toBeCloseTo(0.85, 10)
    expect(result.status).toBe('EVALUATED')
  })

  it('CI: 2.1 NOT_EVALUABLE, 2.2 evaluable al 90% → CI = NOT_EVALUABLE (Caso F)', () => {
    const ci21 = makeComplianceResult({
      status: 'NOT_EVALUABLE',
      compliancePercentage: null,
      compliantCount: 0,
      nonCompliantCount: 0,
      effectiveCriteria: 0,
    })
    const ci22 = makeComplianceResult({ compliancePercentage: 0.9 })
    const result = calculateConditionSummary([ci21, ci22])
    expect(result.status).toBe('NOT_EVALUABLE')
    expect(result.compliancePercentage).toBeNull()
  })

  it('CI: 2.1 evaluable al 90%, 2.2 NOT_EVALUABLE → CI = NOT_EVALUABLE (Caso C, Fase 12 §7 — orden inverso del Caso F)', () => {
    const ci21 = makeComplianceResult({ compliancePercentage: 0.9 })
    const ci22 = makeComplianceResult({
      status: 'NOT_EVALUABLE',
      compliancePercentage: null,
      compliantCount: 0,
      nonCompliantCount: 0,
      effectiveCriteria: 0,
    })
    const result = calculateConditionSummary([ci21, ci22])
    expect(result.status).toBe('NOT_EVALUABLE')
    expect(result.compliancePercentage).toBeNull()
    // No se promedia solo la subcondición evaluable (2.1) ignorando la NOT_EVALUABLE.
    expect(result.compliancePercentage).not.toBe(0.9)
  })

  it('CI: ambas subcondiciones NOT_EVALUABLE → NOT_EVALUABLE', () => {
    const notEvaluable = makeComplianceResult({
      status: 'NOT_EVALUABLE',
      compliancePercentage: null,
      compliantCount: 0,
      nonCompliantCount: 0,
      effectiveCriteria: 0,
    })
    const result = calculateConditionSummary([notEvaluable, notEvaluable])
    expect(result.status).toBe('NOT_EVALUABLE')
  })

  it('CI: no combina los conteos crudos en un único denominador (no hace C/(Total-NA) sobre los 13 criterios juntos)', () => {
    // 2.1: 4 criterios, 3C/1NC → 75%. 2.2: 9 criterios, 2C/7NC → 22.22%.
    // Si se juntaran los conteos: (3+2)/(4+9) = 38.46%, un número DISTINTO
    // del promedio simple correcto (75% + 22.22%) / 2 = 48.61%.
    const ci21 = makeComplianceResult({
      totalCriteria: 4,
      effectiveCriteria: 4,
      compliantCount: 3,
      nonCompliantCount: 1,
      compliancePercentage: 0.75,
    })
    const ci22 = makeComplianceResult({
      totalCriteria: 9,
      effectiveCriteria: 9,
      compliantCount: 2,
      nonCompliantCount: 7,
      compliancePercentage: 2 / 9,
    })
    const result = calculateConditionSummary([ci21, ci22])
    const wrongJoinedDenominator = 5 / 13
    expect(result.compliancePercentage).toBeCloseTo((0.75 + 2 / 9) / 2, 10)
    expect(result.compliancePercentage).not.toBeCloseTo(wrongJoinedDenominator, 2)
    // Los conteos SÍ se suman como roll-up informativo (13 criterios en total).
    expect(result.totalCriteria).toBe(13)
  })

  it('CI: status PARTIAL si alguna subcondición tiene PENDING (y ninguna es NOT_EVALUABLE)', () => {
    const ci21 = makeComplianceResult({ compliancePercentage: 0.5, pendingCount: 1, status: 'PARTIAL' })
    const ci22 = makeComplianceResult({ compliancePercentage: 0.9 })
    const result = calculateConditionSummary([ci21, ci22])
    expect(result.status).toBe('PARTIAL')
  })
})
