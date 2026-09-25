import type { ComplianceResult } from '@/types'
import { aggregateComplianceResults } from './aggregateComplianceResults'

/**
 * Resultado de UNA condición a partir de los resultados YA CALCULADOS de sus
 * subcondiciones (docs/PROMPT.md §13, §14 regla 1, §40.1 regla 10).
 *
 * - AG, SPyB, OADS, PD, PF, CMC: reciben un arreglo de 1 elemento → el
 *   resultado de la condición es exactamente el de su única subcondición
 *   ("Condition result = SubCondition result", sin ponderación adicional).
 * - CI: recibe un arreglo de 2 elementos (2.1 y 2.2) → promedio simple de
 *   ambos porcentajes; si cualquiera de los dos es `NOT_EVALUABLE`, CI
 *   completo es `NOT_EVALUABLE` (sin promediar solo el disponible ni
 *   cambiar el denominador de 2 a 1 — decisión defensiva aprobada,
 *   docs/PROMPT.md §14 regla 1, §40.1 regla 10).
 *
 * Ambos casos usan el MISMO algoritmo (`aggregateComplianceResults`): no
 * existe una rama especial para CI en este archivo.
 *
 * Recibe resultados ya calculados (no evaluaciones crudas) para permitir que
 * el llamador construya cada resultado de subcondición con
 * `calculateCompliance()` a partir de las evaluaciones que correspondan —
 * esta función no conoce `Evaluation` ni `Criterion`, solo compone
 * resultados.
 */
export function calculateConditionSummary(
  subConditionResults: readonly ComplianceResult[],
): ComplianceResult {
  return aggregateComplianceResults(subConditionResults)
}
