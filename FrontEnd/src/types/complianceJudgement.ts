/**
 * Juicio cualitativo de cumplimiento, escala A-E (docs/PROMPT.md §15, §40.1 regla 9).
 * Confirmada en el Excel (`Consolidado!B138:F143`):
 *
 *   A  90% - 100%  Se Cumple Plenamente
 *   B  80% - 89%   Se Cumple en Alto Grado
 *   C  70% - 79%   Se Cumple Aceptablemente
 *   D  30% - 69%   Se Cumple Insatisfactoriamente
 *   E  0%  - 29%   No Se Cumple
 *
 * Solo tiene sentido cuando existe un porcentaje numérico. Cuando el resultado
 * es `NOT_EVALUABLE`, no se asigna ningún `ComplianceJudgement` (ver `ObjectiveResult`).
 */
export interface ComplianceJudgement {
  code: 'A' | 'B' | 'C' | 'D' | 'E'
  label: string
  min: number
  max: number
}
