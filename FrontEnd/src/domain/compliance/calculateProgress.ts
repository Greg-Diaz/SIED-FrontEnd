import type { Evaluation } from '@/types'

/**
 * Progreso de diligenciamiento — Fase 8, §40.2(d): "qué tan avanzada está la
 * evaluación", NO cuánto se cumple. Es un concepto EXCLUSIVO de la
 * aplicación, sin equivalente en el Excel (que no distingue "pendiente").
 *
 * A diferencia de `calculateCompliance()`, aquí `NA` SÍ cuenta como
 * "evaluado" (el usuario ya se pronunció sobre ese criterio); solo
 * `PENDING` representa trabajo pendiente:
 *
 *   evaluatedCount     = compliantCount (C) + nonCompliantCount (NC) + notApplicableCount (NA)
 *   progressPercentage = evaluatedCount / totalCriteria
 *
 * `progressPercentage` es una fracción decimal (0 a 1), igual que
 * `ComplianceResult.compliancePercentage` — nunca deben mezclarse: un nivel
 * puede tener 100% de progreso y a la vez ser `NOT_EVALUABLE` en
 * cumplimiento (todo evaluado, pero todo en NA).
 */
export interface ProgressResult {
  totalCriteria: number
  evaluatedCount: number
  pendingCount: number
  progressPercentage: number
}

export function calculateProgress(evaluations: readonly Evaluation[]): ProgressResult {
  let evaluatedCount = 0
  let pendingCount = 0

  for (const evaluation of evaluations) {
    if (evaluation.status === 'PENDING') {
      pendingCount++
    } else {
      evaluatedCount++
    }
  }

  const totalCriteria = evaluations.length

  return {
    totalCriteria,
    evaluatedCount,
    pendingCount,
    // Defensivo: un nivel sin criterios (no debería ocurrir en los datos
    // reales) se reporta con 0% de progreso en vez de `NaN`.
    progressPercentage: totalCriteria > 0 ? evaluatedCount / totalCriteria : 0,
  }
}
