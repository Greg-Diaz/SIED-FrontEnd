import type { ComplianceResult, Evaluation, EvaluationStatus } from '@/types'

/**
 * Utilidades EXCLUSIVAS de los tests de este directorio (no exportadas desde
 * `index.ts`, no forman parte del motor de cálculo en sí).
 */

let sequence = 0

/** Construye evaluaciones sintéticas a partir de una lista de estados, en orden. */
export function makeEvaluations(statuses: EvaluationStatus[]): Evaluation[] {
  return statuses.map((status) => {
    sequence += 1
    return {
      scenarioId: 'test-scenario',
      criterionId: `test-criterion-${sequence}`,
      status,
      comments: '',
    }
  })
}

/** Construye un `ComplianceResult` sintético completo, con overrides puntuales. */
export function makeComplianceResult(overrides: Partial<ComplianceResult> = {}): ComplianceResult {
  return {
    totalCriteria: 10,
    effectiveCriteria: 10,
    compliantCount: 10,
    nonCompliantCount: 0,
    notApplicableCount: 0,
    pendingCount: 0,
    compliancePercentage: 1,
    status: 'EVALUATED',
    ...overrides,
  }
}
