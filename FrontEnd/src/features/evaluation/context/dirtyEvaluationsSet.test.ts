import { describe, expect, it } from 'vitest'

import { withDirtyEvaluation } from './dirtyEvaluationsSet'

describe('withDirtyEvaluation', () => {
  it('agrega un criterio cuando pasa a estar sucio', () => {
    const result = withDirtyEvaluation(new Set(), 'AG-01', true)
    expect([...result]).toEqual(['AG-01'])
  })

  it('quita un criterio cuando deja de estar sucio', () => {
    const dirty = new Set(['AG-01', 'AG-02'])
    const result = withDirtyEvaluation(dirty, 'AG-01', false)
    expect([...result]).toEqual(['AG-02'])
  })

  it('conserva otros criterios sucios al modificar uno distinto', () => {
    const dirty = new Set(['AG-01'])
    const result = withDirtyEvaluation(dirty, 'AG-02', true)
    expect([...result].sort()).toEqual(['AG-01', 'AG-02'])
  })

  it('devuelve la MISMA referencia si el estado ya coincide (no-op) — marcar sucio dos veces', () => {
    const dirty = new Set(['AG-01'])
    const result = withDirtyEvaluation(dirty, 'AG-01', true)
    expect(result).toBe(dirty)
  })

  it('devuelve la MISMA referencia si el estado ya coincide (no-op) — marcar limpio algo que no estaba sucio', () => {
    const dirty = new Set(['AG-01'])
    const result = withDirtyEvaluation(dirty, 'AG-02', false)
    expect(result).toBe(dirty)
  })

  it('no muta el conjunto original', () => {
    const dirty = new Set(['AG-01'])
    withDirtyEvaluation(dirty, 'AG-02', true)
    expect([...dirty]).toEqual(['AG-01'])
  })
})
