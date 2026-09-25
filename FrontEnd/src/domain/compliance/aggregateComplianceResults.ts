import type { ComplianceResult } from '@/types'

/**
 * Agrega N resultados de cumplimiento del nivel inmediatamente inferior
 * (subcondiciones → condición, o condiciones → global) mediante **promedio
 * simple de sus porcentajes**, con propagación defensiva de
 * `NOT_EVALUABLE`. Es la lógica compartida detrás de
 * `calculateConditionSummary()` y `calculateGlobalSummary()` — docs/PROMPT.md
 * §14 (reglas 1, 2, 3), §17, §18, §40.1 (reglas 10, 11, 13).
 *
 * Deliberadamente NO distingue "1 elemento" de "N elementos": promediar 1
 * solo resultado da ese mismo resultado (Condition result = SubCondition
 * result, docs/PROMPT.md §13 de esta fase), así que las 6 condiciones de una
 * sola subcondición y Capacidad Instalada (2 subcondiciones) comparten
 * exactamente el mismo algoritmo, sin una rama especial para CI.
 *
 * Reglas:
 * 1. Si CUALQUIER resultado de entrada es `NOT_EVALUABLE`, el agregado
 *    completo es `NOT_EVALUABLE` — NUNCA se reduce el denominador (de N a
 *    N-1) ni se promedian solo los disponibles.
 * 2. En caso contrario, `compliancePercentage` es el promedio aritmético
 *    simple de los porcentajes de entrada — NUNCA se recalcula sumando los
 *    conteos crudos (eso mezclaría los denominadores de cada subnivel,
 *    prohibido explícitamente para CI en docs/PROMPT.md §14).
 * 3. Ningún subnivel pesa más que otro por tener más criterios (§17, §40.1
 *    regla 11): se promedia por cantidad de elementos de `results`, no por
 *    criterios.
 * 4. Los conteos (`totalCriteria`, `compliantCount`, etc.) SÍ se suman —
 *    son solo un roll-up informativo para mostrar (p. ej. "13 criterios en
 *    Capacidad Instalada"), independiente de cómo se calculó el porcentaje.
 * 5. `status` es `PARTIAL` si algún criterio subyacente sigue `PENDING`
 *    (reflejado en el conteo agregado), y `EVALUATED` en otro caso.
 */
export function aggregateComplianceResults(
  results: readonly ComplianceResult[],
): ComplianceResult {
  if (results.length === 0) {
    throw new Error('aggregateComplianceResults requiere al menos un resultado de entrada.')
  }

  const totals = results.reduce(
    (acc, r) => ({
      totalCriteria: acc.totalCriteria + r.totalCriteria,
      compliantCount: acc.compliantCount + r.compliantCount,
      nonCompliantCount: acc.nonCompliantCount + r.nonCompliantCount,
      notApplicableCount: acc.notApplicableCount + r.notApplicableCount,
      pendingCount: acc.pendingCount + r.pendingCount,
    }),
    {
      totalCriteria: 0,
      compliantCount: 0,
      nonCompliantCount: 0,
      notApplicableCount: 0,
      pendingCount: 0,
    },
  )
  const effectiveCriteria = totals.compliantCount + totals.nonCompliantCount

  const hasNotEvaluable = results.some((r) => r.status === 'NOT_EVALUABLE')
  if (hasNotEvaluable) {
    return {
      ...totals,
      effectiveCriteria,
      compliancePercentage: null,
      status: 'NOT_EVALUABLE',
    }
  }

  const averagePercentage =
    results.reduce((sum, r) => sum + (r.compliancePercentage ?? 0), 0) / results.length

  return {
    ...totals,
    effectiveCriteria,
    compliancePercentage: averagePercentage,
    status: totals.pendingCount > 0 ? 'PARTIAL' : 'EVALUATED',
  }
}
