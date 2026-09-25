import type { ComplianceResult } from '@/types'
import { aggregateComplianceResults } from './aggregateComplianceResults'

/**
 * Resultado global del escenario a partir de los resultados YA CALCULADOS de
 * las 7 condiciones (docs/PROMPT.md §17, §18, §40.1 reglas 11 y 13).
 *
 * `CUMPLIMIENTO TOTAL = promedio simple de las 7 condiciones` — cada
 * condición pesa exactamente 1/7 sin importar su número de criterios (AG con
 * 8 pesa igual que CI con 13). Si CUALQUIERA de las 7 condiciones es
 * `NOT_EVALUABLE`, el resultado global es `NOT_EVALUABLE` también, sin
 * excluirla del promedio ni reducir el denominador de 7 a 6 (decisión
 * defensiva aprobada — el Excel no define este caso).
 *
 * Reutiliza el mismo algoritmo que `calculateConditionSummary()`
 * (`aggregateComplianceResults`): agregar condiciones para obtener el global
 * es estructuralmente idéntico a agregar subcondiciones para obtener una
 * condición.
 */
export function calculateGlobalSummary(
  conditionResults: readonly ComplianceResult[],
): ComplianceResult {
  return aggregateComplianceResults(conditionResults)
}
