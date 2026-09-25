/**
 * Valoración 0-5 a partir del porcentaje de cumplimiento (docs/PROMPT.md §16,
 * confirmada en el Excel: `Consolidado!H = 5*G`).
 *
 * `percentage` es la fracción decimal (0 a 1) de `ComplianceResult.compliancePercentage`
 * — por eso la fórmula es `percentage * 5` y no `(percentage/100) * 5`: son
 * numéricamente equivalentes, solo cambia la unidad interna (ver
 * `types/complianceResult.ts`).
 *
 * `null` (caso `NOT_EVALUABLE`) se propaga como `null` — NUNCA como `0`.
 *
 * Sin redondeo: se conserva precisión completa; el redondeo para
 * presentación (p. ej. 2 decimales) es responsabilidad de la capa de UI que
 * lo muestre, no de esta función de dominio (docs/PROMPT.md Fase 8 §25).
 */
export function getComplianceValue(percentage: number | null): number | null {
  if (percentage === null) return null
  return percentage * 5
}
