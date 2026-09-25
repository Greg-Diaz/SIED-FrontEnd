import type { ComplianceResult, Objective, ObjectiveResult } from '@/types'
import { getComplianceJudgement } from './getComplianceJudgement'
import { getComplianceValue } from './getComplianceValue'

/**
 * Combina un `Objective` (definición) con un `ComplianceResult` YA CALCULADO
 * (subcondición, condición o global) para producir el `ObjectiveResult`
 * final — docs/PROMPT.md §13: `Objective` y `ObjectiveResult` permanecen
 * entidades separadas; esta función es la única que las une, y solo produce
 * el resultado, nunca modifica la definición del objetivo.
 *
 * DECISIÓN DE DISEÑO (ver reporte de Fase 8): recibe un `ComplianceResult`
 * ya resuelto en vez de `(criteria, evaluations)` crudos, para poder
 * reutilizarse sin cambios en los 3 niveles (subcondición vía
 * `calculateCompliance()`, condición vía `calculateConditionSummary()` —
 * incluida Capacidad Instalada, que promedia 2.1 y 2.2 — y global vía
 * `calculateGlobalSummary()`). Si tomara evaluaciones crudas directamente,
 * no podría representar correctamente el caso de Capacidad Instalada (cuyo
 * resultado NO sale de un único conteo de evaluaciones, sino del promedio de
 * dos resultados de subcondición ya calculados).
 *
 * No inventa métricas adicionales: expone exactamente
 * totalCriteria/effectiveCriteria/compliantCount/nonCompliantCount/
 * notApplicableCount/pendingCount/compliancePercentage/value/judgement/status.
 */
export function calculateObjectiveResult(
  objective: Objective,
  complianceResult: ComplianceResult,
): ObjectiveResult {
  return {
    ...complianceResult,
    objectiveId: objective.id,
    value: getComplianceValue(complianceResult.compliancePercentage),
    judgement: getComplianceJudgement(complianceResult.compliancePercentage),
  }
}
