import { describe, expect, it } from 'vitest'

import { calculateCompliance } from './calculateCompliance'
import { makeEvaluations } from './complianceTestHelpers'

describe('calculateCompliance', () => {
  it('todos C → 100%, status EVALUATED', () => {
    const result = calculateCompliance(makeEvaluations(['C', 'C', 'C', 'C']))
    expect(result.compliancePercentage).toBe(1)
    expect(result.status).toBe('EVALUATED')
    expect(result.effectiveCriteria).toBe(4)
  })

  it('mitad C / mitad NC → 50%', () => {
    const result = calculateCompliance(makeEvaluations(['C', 'C', 'NC', 'NC']))
    expect(result.compliancePercentage).toBe(0.5)
    expect(result.status).toBe('EVALUATED')
  })

  it('C + NC + NA → NA excluido del denominador (Caso B: 6C/2NC/2NA → 75%)', () => {
    const result = calculateCompliance(
      makeEvaluations(['C', 'C', 'C', 'C', 'C', 'C', 'NC', 'NC', 'NA', 'NA']),
    )
    expect(result.totalCriteria).toBe(10)
    expect(result.effectiveCriteria).toBe(8)
    expect(result.notApplicableCount).toBe(2)
    expect(result.compliancePercentage).toBe(0.75)
    expect(result.status).toBe('EVALUATED')
  })

  it('PENDING excluido del denominador (además de NA) — status PARTIAL', () => {
    // Caso C del encargo: 5C/2NC/1NA/2PENDING → compliance = 5/7
    const result = calculateCompliance(
      makeEvaluations(['C', 'C', 'C', 'C', 'C', 'NC', 'NC', 'NA', 'PENDING', 'PENDING']),
    )
    expect(result.effectiveCriteria).toBe(7)
    expect(result.compliancePercentage).toBeCloseTo(5 / 7, 10)
    expect(result.status).toBe('PARTIAL')
    expect(result.pendingCount).toBe(2)
  })

  it('todos NA → NOT_EVALUABLE, nunca 0% ni NaN', () => {
    const result = calculateCompliance(makeEvaluations(['NA', 'NA', 'NA']))
    expect(result.effectiveCriteria).toBe(0)
    expect(result.compliancePercentage).toBeNull()
    expect(result.status).toBe('NOT_EVALUABLE')
    expect(Number.isNaN(result.compliancePercentage)).toBe(false)
  })

  it('C = 0, NC > 0 → 0% exacto (no NOT_EVALUABLE: sí hay criterios efectivos)', () => {
    const result = calculateCompliance(makeEvaluations(['NC', 'NC', 'NC']))
    expect(result.compliancePercentage).toBe(0)
    expect(result.status).toBe('EVALUATED')
  })

  it('C > 0, NC = 0 → 100% exacto', () => {
    const result = calculateCompliance(makeEvaluations(['C', 'C']))
    expect(result.compliancePercentage).toBe(1)
  })

  it('nunca produce Infinity', () => {
    const result = calculateCompliance(makeEvaluations(['PENDING', 'PENDING']))
    expect(result.compliancePercentage).toBeNull()
    expect(Number.isFinite(result.compliancePercentage ?? 0)).toBe(true)
  })

  it('no muta el arreglo de evaluaciones recibido', () => {
    const evaluations = makeEvaluations(['C', 'NC'])
    const snapshot = JSON.stringify(evaluations)
    calculateCompliance(evaluations)
    expect(JSON.stringify(evaluations)).toBe(snapshot)
  })

  it('el comentario (vacío, largo, o cambiante) NUNCA altera el resultado — solo se lee `status` (Fase 12 §4)', () => {
    const base = makeEvaluations(['C', 'NC', 'NA', 'PENDING'])
    const withoutComments = base.map((e) => ({ ...e, comments: '' }))
    const withComments = base.map((e) => ({
      ...e,
      comments: `Comentario largo con detalles y observaciones para ${e.criterionId} — ✓`,
    }))

    const resultWithout = calculateCompliance(withoutComments)
    const resultWith = calculateCompliance(withComments)

    expect(resultWith).toEqual(resultWithout)
  })
})
