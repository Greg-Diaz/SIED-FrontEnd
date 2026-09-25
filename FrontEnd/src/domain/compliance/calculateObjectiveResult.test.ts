import { describe, expect, it } from 'vitest'

import type { Objective } from '@/types'
import { calculateObjectiveResult } from './calculateObjectiveResult'
import { makeComplianceResult } from './complianceTestHelpers'

const objective: Objective = {
  id: 'objective-test',
  conditionId: 'AG',
  title: 'Objetivo de prueba',
  description: 'Descripción de prueba',
}

describe('calculateObjectiveResult', () => {
  it('EVALUATED: incluye value y judgement calculados a partir del porcentaje', () => {
    const result = calculateObjectiveResult(
      objective,
      makeComplianceResult({ compliancePercentage: 0.8, status: 'EVALUATED' }),
    )
    expect(result.objectiveId).toBe('objective-test')
    expect(result.value).toBeCloseTo(4, 10)
    expect(result.judgement?.code).toBe('B')
    expect(result.status).toBe('EVALUATED')
  })

  it('PARTIAL: value/judgement se calculan igual sobre el porcentaje ya evaluado', () => {
    const result = calculateObjectiveResult(
      objective,
      makeComplianceResult({ compliancePercentage: 5 / 7, status: 'PARTIAL', pendingCount: 2 }),
    )
    expect(result.status).toBe('PARTIAL')
    expect(result.value).toBeCloseTo((5 / 7) * 5, 10)
    expect(result.judgement?.code).toBe('C')
  })

  it('NOT_EVALUABLE: compliancePercentage, value y judgement son null (nunca 0)', () => {
    const result = calculateObjectiveResult(
      objective,
      makeComplianceResult({
        status: 'NOT_EVALUABLE',
        compliancePercentage: null,
        compliantCount: 0,
        nonCompliantCount: 0,
        effectiveCriteria: 0,
        notApplicableCount: 10,
      }),
    )
    expect(result.compliancePercentage).toBeNull()
    expect(result.value).toBeNull()
    expect(result.judgement).toBeNull()
    expect(result.status).toBe('NOT_EVALUABLE')
  })

  it('conserva los conteos exactos del ComplianceResult recibido, sin inventar métricas adicionales', () => {
    const compliance = makeComplianceResult({
      totalCriteria: 8,
      effectiveCriteria: 7,
      compliantCount: 5,
      nonCompliantCount: 2,
      notApplicableCount: 1,
      pendingCount: 0,
      compliancePercentage: 5 / 7,
    })
    const result = calculateObjectiveResult(objective, compliance)
    expect(result).toEqual({
      ...compliance,
      objectiveId: objective.id,
      value: result.value,
      judgement: result.judgement,
    })
    expect(Object.keys(result).sort()).toEqual(
      [
        'compliancePercentage',
        'compliantCount',
        'effectiveCriteria',
        'judgement',
        'nonCompliantCount',
        'notApplicableCount',
        'objectiveId',
        'pendingCount',
        'status',
        'totalCriteria',
        'value',
      ].sort(),
    )
  })
})
