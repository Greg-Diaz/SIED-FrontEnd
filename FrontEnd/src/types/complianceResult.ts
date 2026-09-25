import type { ObjectiveResultStatus } from './objectiveResultStatus'

/**
 * Resultado de cumplimiento de UN nivel de la jerarquía (subcondición,
 * condición o global) — Fase 8 (docs/PROMPT.md §13, §40.1).
 *
 * Es el tipo base sobre el que se construye `ObjectiveResult`: los niveles
 * intermedios (p. ej. una `SubCondition`, o la propia `Condition` Capacidad
 * Instalada antes de asociarla a su `Objective`) no necesitan un
 * `objectiveId` — solo lo necesita el resultado final que se liga
 * explícitamente a un `Objective` (ver `ObjectiveResult`).
 *
 * `compliancePercentage` se representa como **fracción decimal (0 a 1)**,
 * NUNCA como número 0-100: evita reconversiones entre funciones y coincide
 * con la precisión exigida para decidir el juicio A-E sin ambigüedad en los
 * límites (docs/PROMPT.md Fase 8 §9) — p. ej. `0.8996`, no `89.96`.
 * `value = compliancePercentage * 5` es, por lo tanto, numéricamente
 * equivalente a la fórmula original `(porcentaje/100) * 5` de PROMPT.md §16;
 * solo cambia la unidad interna, nunca el resultado final.
 */
export interface ComplianceResult {
  totalCriteria: number
  effectiveCriteria: number
  compliantCount: number
  nonCompliantCount: number
  notApplicableCount: number
  pendingCount: number
  compliancePercentage: number | null
  status: ObjectiveResultStatus
}
