import { describe, expect, it } from 'vitest'

import { calculateGlobalSummary } from './calculateGlobalSummary'
import { makeComplianceResult } from './complianceTestHelpers'

function condition(percentage: number, totalCriteria = 10) {
  return makeComplianceResult({ compliancePercentage: percentage, totalCriteria })
}

const notEvaluable = makeComplianceResult({
  status: 'NOT_EVALUABLE',
  compliancePercentage: null,
  compliantCount: 0,
  nonCompliantCount: 0,
  effectiveCriteria: 0,
})

describe('calculateGlobalSummary', () => {
  it('7 condiciones evaluables → promedio simple (Caso G del encargo ≈ 85.71%)', () => {
    const result = calculateGlobalSummary([
      condition(0.8), // AG
      condition(0.9), // CI
      condition(0.7), // SPyB
      condition(1.0), // OADS
      condition(0.8), // PD
      condition(0.9), // PF
      condition(0.9), // CMC
    ])
    expect(result.compliancePercentage).toBeCloseTo(0.8571428571, 9)
    expect(result.status).toBe('EVALUATED')
  })

  it('una condición NOT_EVALUABLE → global NOT_EVALUABLE (sin reducir el denominador de 7 a 6)', () => {
    const result = calculateGlobalSummary([
      condition(0.8),
      condition(0.9),
      condition(0.85),
      condition(0.9),
      condition(0.8),
      condition(0.95),
      notEvaluable, // CMC
    ])
    expect(result.status).toBe('NOT_EVALUABLE')
    expect(result.compliancePercentage).toBeNull()
  })

  it('múltiples condiciones NOT_EVALUABLE → global NOT_EVALUABLE', () => {
    const result = calculateGlobalSummary([
      notEvaluable,
      condition(0.9),
      condition(0.85),
      notEvaluable,
      condition(0.8),
      condition(0.95),
      condition(0.7),
    ])
    expect(result.status).toBe('NOT_EVALUABLE')
  })

  it('resultados parciales (ninguno NOT_EVALUABLE) → global PARTIAL', () => {
    const partial = makeComplianceResult({ compliancePercentage: 0.6, pendingCount: 1, status: 'PARTIAL' })
    const result = calculateGlobalSummary([
      condition(0.8),
      partial,
      condition(0.85),
      condition(0.9),
      condition(0.8),
      condition(0.95),
      condition(0.7),
    ])
    expect(result.status).toBe('PARTIAL')
  })

  it('NO pondera por cantidad de criterios: una condición con muchos criterios no domina el promedio', () => {
    // Condición A: 100 criterios al 100%. Condición B: 2 criterios al 0%.
    // Ponderando por criterios daría ~98%; el promedio simple correcto es 50%.
    const bigCondition = condition(1.0, 100)
    const smallCondition = condition(0, 2)
    const result = calculateGlobalSummary([bigCondition, smallCondition])
    expect(result.compliancePercentage).toBe(0.5)
    expect(result.compliancePercentage).not.toBeCloseTo(0.98, 1)
  })
})
