import { describe, expect, it } from 'vitest'

import type { ProgressResult } from '@/domain/compliance'
import { getCompletionStatus } from './getCompletionStatus'

function progress(overrides: Partial<ProgressResult> = {}): ProgressResult {
  return {
    totalCriteria: 8,
    evaluatedCount: 8,
    pendingCount: 0,
    progressPercentage: 1,
    ...overrides,
  }
}

describe('getCompletionStatus', () => {
  it('COMPLETED cuando no hay pendientes y el cumplimiento es EVALUATED', () => {
    expect(getCompletionStatus('EVALUATED', progress())).toBe('COMPLETED')
  })

  it('PENDING cuando existe al menos un criterio PENDING, aunque el estado de cumplimiento sea EVALUATED', () => {
    expect(getCompletionStatus('EVALUATED', progress({ pendingCount: 1, evaluatedCount: 7 }))).toBe(
      'PENDING',
    )
  })

  it('PENDING cuando existe al menos un criterio PENDING, aunque el estado de cumplimiento sea PARTIAL', () => {
    expect(getCompletionStatus('PARTIAL', progress({ pendingCount: 1, evaluatedCount: 7 }))).toBe(
      'PENDING',
    )
  })

  it('NOT_EVALUABLE cuando no hay pendientes pero el cumplimiento no pudo calcularse', () => {
    expect(getCompletionStatus('NOT_EVALUABLE', progress())).toBe('NOT_EVALUABLE')
  })

  it('PENDING tiene prioridad sobre NOT_EVALUABLE: no debe ocultarse un criterio pendiente real', () => {
    // Caso posible en el dominio: algunos criterios en NA (→ NOT_EVALUABLE)
    // y OTRO todavía sin diligenciar (→ pendingCount > 0). El usuario debe
    // ver "Pendiente", no "No evaluable" (Fase 11 §3).
    expect(getCompletionStatus('NOT_EVALUABLE', progress({ pendingCount: 1, evaluatedCount: 7 }))).toBe(
      'PENDING',
    )
  })
})
