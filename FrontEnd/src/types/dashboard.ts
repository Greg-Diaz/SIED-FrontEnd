import type { ConditionCode } from './conditionCode'
import type { ObjectiveResult } from './objectiveResult'

/**
 * Resultado de una condición tal como lo consume el dashboard (docs/PROMPT.md §5, §17).
 * Envuelve el `ObjectiveResult` de la condición junto con su identidad, para que los
 * componentes de gráficas no dependan de resolver `conditionId` contra otra colección.
 */
export interface DashboardCondition {
  conditionId: ConditionCode
  conditionName: string
  result: ObjectiveResult
}

/**
 * Resumen completo del dashboard de un escenario (docs/PROMPT.md §5, §14, §17).
 *
 * `global` y cada entrada de `byCondition` se calculan SIEMPRE dinámicamente a
 * partir de `evaluations.json` (docs/PROMPT.md §40.1 regla 14) — nunca se
 * almacenan como mock estático. Esta Fase 3 solo define la forma del tipo.
 */
export interface DashboardSummary {
  scenarioId: string
  global: ObjectiveResult
  byCondition: DashboardCondition[]
}
