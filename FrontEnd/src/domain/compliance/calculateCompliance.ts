import type { ComplianceResult, Evaluation } from '@/types'

/**
 * Cumplimiento de UN nivel (típicamente los criterios de una `SubCondition`)
 * a partir de sus evaluaciones (Fase 8, docs/PROMPT.md §40.1 regla 7).
 *
 * REGLA CONFIRMADA (no una interpretación): tanto `NA` como `PENDING` quedan
 * FUERA del denominador de cumplimiento — ninguno de los dos constituye
 * todavía una evaluación válida de cumplimiento/incumplimiento:
 *
 *   effectiveCriteria    = compliantCount (C) + nonCompliantCount (NC)
 *   compliancePercentage = compliantCount / effectiveCriteria
 *
 * Esto es distinto de `calculateProgress()` (qué tan diligenciado está el
 * criterio, donde NA SÍ cuenta como "evaluado" pero PENDING no) — ver ese
 * archivo. Nunca deben mezclarse ambos conceptos.
 *
 * Caso defensivo `NOT_EVALUABLE`: si `effectiveCriteria === 0` (todos los
 * criterios aplicables están en NA, o el arreglo está vacío), el resultado
 * NUNCA es `0%` — reemplaza el `#DIV/0!` del Excel con `compliancePercentage:
 * null` y `status: "NOT_EVALUABLE"`.
 *
 * Se asume que existe como máximo una `Evaluation` por criterio en el
 * arreglo recibido (invariante garantizada por los mocks: cada `Criterion`
 * siempre tiene su `Evaluation`, aunque sea `PENDING`) — por eso
 * `totalCriteria` se toma como `evaluations.length`, sin necesitar además
 * la lista de `Criterion`.
 *
 * Función pura: no muta `evaluations`, no accede a RTK Query ni a mockDb.
 */
export function calculateCompliance(evaluations: readonly Evaluation[]): ComplianceResult {
  let compliantCount = 0
  let nonCompliantCount = 0
  let notApplicableCount = 0
  let pendingCount = 0

  for (const evaluation of evaluations) {
    switch (evaluation.status) {
      case 'C':
        compliantCount++
        break
      case 'NC':
        nonCompliantCount++
        break
      case 'NA':
        notApplicableCount++
        break
      case 'PENDING':
        pendingCount++
        break
    }
  }

  const totalCriteria = evaluations.length
  const effectiveCriteria = compliantCount + nonCompliantCount

  if (effectiveCriteria === 0) {
    return {
      totalCriteria,
      effectiveCriteria,
      compliantCount,
      nonCompliantCount,
      notApplicableCount,
      pendingCount,
      compliancePercentage: null,
      status: 'NOT_EVALUABLE',
    }
  }

  return {
    totalCriteria,
    effectiveCriteria,
    compliantCount,
    nonCompliantCount,
    notApplicableCount,
    pendingCount,
    compliancePercentage: compliantCount / effectiveCriteria,
    status: pendingCount > 0 ? 'PARTIAL' : 'EVALUATED',
  }
}
