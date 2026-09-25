/**
 * Utilidades de PRESENTACIÓN puras (Fase 9) — formatean números que el
 * dominio (`src/domain/compliance/`) ya calculó. No implementan ninguna
 * fórmula de negocio, solo redondeo/formato para mostrar en pantalla
 * (docs/PROMPT.md Fase 8 §25: "presentación puede redondear a 2 decimales").
 */

/**
 * `percentage` es la fracción decimal (0 a 1) de `ComplianceResult`. `null`
 * (caso `NOT_EVALUABLE`) se muestra como "N/A" — NUNCA como "0%".
 */
export function formatPercentage(percentage: number | null, fractionDigits = 2): string {
  if (percentage === null) return 'N/A'
  return `${(percentage * 100).toFixed(fractionDigits)}%`
}

/** `value` (0-5). `null` (caso `NOT_EVALUABLE`) se muestra como "N/A" — nunca como "0.00". */
export function formatComplianceValue(value: number | null, fractionDigits = 2): string {
  if (value === null) return 'N/A'
  return value.toFixed(fractionDigits)
}

/**
 * Texto explicativo para el caso `NOT_EVALUABLE` (Fase 11, "NOT_EVALUABLE"
 * §16). Describe únicamente el HECHO mecánico que el dominio sí garantiza
 * (`effectiveCriteria === 0`: no hay criterios C/NC sobre los cuales calcular
 * un porcentaje) — deliberadamente NO inventa una causa normativa que el
 * dominio no provee (p. ej. no afirma "el escenario no presta ese servicio").
 * Único punto de esta frase en toda la app — reutilizar esta constante en vez
 * de repetirla como texto literal en cada componente que muestre este caso.
 */
export const NOT_EVALUABLE_EXPLANATION =
  'No existen criterios aplicables suficientes para calcular el cumplimiento.'
