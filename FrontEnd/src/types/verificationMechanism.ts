/**
 * Roles entrevistados para verificar un criterio (docs/PROMPT.md §11).
 * Conjunto cerrado de valores observados de forma consistente en las 8 hojas de
 * criterios del Excel (docs/FUNCTIONAL_ANALYSIS.md); se modela como unión de
 * literales, no como `string`, para mantener TypeScript estricto (§34).
 */
export type InterviewRole =
  | 'Personal IPS'
  | 'Estudiantes'
  | 'Docentes'
  | 'Coordinador de práctica formativa Unicorsalud'

/**
 * Mecanismos de verificación de un criterio (docs/PROMPT.md §1, §11).
 * Los tres son opcionales de forma independiente: en el Excel cada criterio
 * declara solo los mecanismos que le aplican (no todos los criterios tienen
 * los tres tipos).
 */
export interface VerificationMechanism {
  documentary?: string
  onSiteVisit?: string
  interviewRoles?: InterviewRole[]
}
