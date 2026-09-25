import type { ComplianceJudgement } from './complianceJudgement'
import type { ComplianceResult } from './complianceResult'

export type { ObjectiveResultStatus } from './objectiveResultStatus'

/**
 * Resultado calculado de un `Objective` (docs/PROMPT.md §13, §40.1 reglas 7, 8, 12, 15).
 *
 * SIEMPRE se deriva dinámicamente de las evaluaciones reales (funciones puras
 * de `domain/compliance/`, Fase 8). NUNCA se mockea a mano ni se guarda como
 * JSON estático.
 *
 * Extiende `ComplianceResult` (Fase 8) — es exactamente ese resultado de
 * cumplimiento, más el `objectiveId` que lo liga a la definición del
 * objetivo, `value` (0-5) y `judgement` (A-E). Cuando `status ===
 * "NOT_EVALUABLE"`, `compliancePercentage`, `value` y `judgement` deben ser
 * `null` (nunca `0` ni un juicio A-E forzado).
 */
export interface ObjectiveResult extends ComplianceResult {
  objectiveId: string
  value: number | null
  judgement: ComplianceJudgement | null
}
