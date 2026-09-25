import type { EvaluationStatus } from './evaluationStatus'

/**
 * Evaluación de un criterio concreto dentro de un escenario (docs/PROMPT.md §5).
 * Es la única entidad "dinámica" del dominio: todo lo demás (Scenario, Condition,
 * SubCondition, CriterionGroup, Criterion) es estructura/configuración estable.
 *
 * `updatedAt` (Fase 7): campo agregado — NO estaba en la interfaz original de
 * la Fase 3. Es opcional y estampado por el propio Mock API (nunca enviado
 * por el cliente) al guardar una evaluación, para saber cuándo fue la última
 * vez que se modificó. Ver el reporte de la Fase 7 para la justificación
 * completa de este cambio sobre un modelo ya aprobado.
 */
export interface Evaluation {
  scenarioId: string
  criterionId: string
  status: EvaluationStatus
  comments: string
  updatedAt?: string
}
