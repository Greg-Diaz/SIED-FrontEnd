import { describe, expect, it } from 'vitest'

import { getComplianceJudgement } from './getComplianceJudgement'

describe('getComplianceJudgement', () => {
  it.each([
    [1.0, 'A'],
    [0.9, 'A'],
    [0.8999, 'B'],
    [0.8, 'B'],
    [0.7999, 'C'],
    [0.7, 'C'],
    [0.6999, 'D'],
    [0.3, 'D'],
    [0.2999, 'E'],
    [0, 'E'],
  ])('%p → %s', (percentage, expectedCode) => {
    expect(getComplianceJudgement(percentage)?.code).toBe(expectedCode)
  })

  it('0.8996 se evalúa por su valor real, no por un 90% redondeado visualmente → B', () => {
    expect(getComplianceJudgement(0.8996)?.code).toBe('B')
  })

  it('null (NOT_EVALUABLE) → null, nunca se fuerza un juicio', () => {
    expect(getComplianceJudgement(null)).toBeNull()
  })

  it('cada entrada de la escala conserva min/max 0-100 tal como en el Excel', () => {
    const a = getComplianceJudgement(0.95)
    expect(a).toEqual({ code: 'A', label: 'Se Cumple Plenamente', min: 90, max: 100 })
  })
})
