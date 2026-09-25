import { describe, expect, it } from 'vitest'

import { getComplianceValue } from './getComplianceValue'

describe('getComplianceValue', () => {
  it.each([
    [1, 5],
    [0.9, 4.5],
    [0.8, 4],
    [0.7, 3.5],
    [0.5, 2.5],
    [0, 0],
  ])('percentage %p → value %p', (percentage, expected) => {
    expect(getComplianceValue(percentage)).toBeCloseTo(expected, 10)
  })

  it('null (NOT_EVALUABLE) → null, nunca 0', () => {
    expect(getComplianceValue(null)).toBeNull()
  })
})
