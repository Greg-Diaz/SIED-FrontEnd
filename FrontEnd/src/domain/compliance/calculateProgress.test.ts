import { describe, expect, it } from 'vitest'

import { calculateProgress } from './calculateProgress'
import { makeEvaluations } from './complianceTestHelpers'

describe('calculateProgress', () => {
  it('todos PENDING → 0% de progreso', () => {
    const result = calculateProgress(makeEvaluations(['PENDING', 'PENDING', 'PENDING']))
    expect(result.progressPercentage).toBe(0)
    expect(result.evaluatedCount).toBe(0)
  })

  it('todos evaluados (sin PENDING) → 100% de progreso', () => {
    const result = calculateProgress(makeEvaluations(['C', 'NC', 'NA']))
    expect(result.progressPercentage).toBe(1)
    expect(result.pendingCount).toBe(0)
  })

  it('mezcla C/NC/NA/PENDING (Caso C del encargo: 8/10 evaluados → 80%)', () => {
    const result = calculateProgress(
      makeEvaluations(['C', 'C', 'C', 'C', 'C', 'NC', 'NC', 'NA', 'PENDING', 'PENDING']),
    )
    expect(result.totalCriteria).toBe(10)
    expect(result.evaluatedCount).toBe(8)
    expect(result.pendingCount).toBe(2)
    expect(result.progressPercentage).toBe(0.8)
  })

  it('NA cuenta como evaluado para el progreso (a diferencia del cumplimiento)', () => {
    const result = calculateProgress(makeEvaluations(['NA', 'NA']))
    expect(result.progressPercentage).toBe(1)
  })

  it('PENDING NO cuenta como evaluado', () => {
    const result = calculateProgress(makeEvaluations(['C', 'PENDING']))
    expect(result.evaluatedCount).toBe(1)
    expect(result.progressPercentage).toBe(0.5)
  })

  it('progress y compliance son métricas independientes (100% progreso puede ser NOT_EVALUABLE en cumplimiento)', () => {
    // Ver calculateCompliance.test.ts: todos-NA da NOT_EVALUABLE en cumplimiento,
    // pero aquí probamos que el PROGRESO de ese mismo conjunto es 100%.
    const result = calculateProgress(makeEvaluations(['NA', 'NA', 'NA']))
    expect(result.progressPercentage).toBe(1)
  })

  it('el comentario NUNCA altera el progreso — solo se lee `status` (Fase 12 §4)', () => {
    const base = makeEvaluations(['C', 'NC', 'NA', 'PENDING'])
    const withComments = base.map((e) => ({ ...e, comments: 'Observación de prueba' }))
    expect(calculateProgress(withComments)).toEqual(calculateProgress(base))
  })
})
