import type { ConditionCode } from '@/types'
import type { ConditionResultEntry } from '../types'

export type ContinueEvaluationTarget =
  | { type: 'condition'; conditionId: ConditionCode }
  | { type: 'summary' }

/**
 * Destino de la acción "Continuar evaluación" (Fase 11 §19, §20,
 * "TABLE OF CONTENTS"): la primera condición, en `Condition.order` (nunca
 * alfabético ni hardcodeado), que todavía tiene algún criterio `PENDING`; si
 * ninguna lo tiene, el destino es `/summary` ("Ver consolidado", Fase 13 §26).
 *
 * Usa `progress.pendingCount` de `ConditionResultEntry` (ya calculado por
 * `calculateProgress()`, Fase 8, vía `buildScenarioSummary`) — NO
 * `objectiveResult.status`: una condición puede ser `NOT_EVALUABLE` (todos
 * sus criterios aplicables en NA) y aun así tener un criterio `PENDING` sin
 * diligenciar todavía (§3, "no confundir PENDIENTE con NO EVALUABLE") — ese
 * caso debe seguir apareciendo como destino de "continuar", nunca ocultarse.
 *
 * No pincha un `SubCondition`/`Criterion` específico a propósito: la
 * granularidad de navegación de la app es por condición
 * (`/conditions/:conditionId`) — dentro de esa página, las subcondiciones y
 * criterios ya se listan en su propio orden (`SubCondition.order`,
 * `Criterion.order`), así que no hace falta un algoritmo más fino para
 * "aterrizar" al usuario en el lugar correcto (§19: "no crear un algoritmo
 * complejo").
 *
 * Función pura: ordena defensivamente por `condition.order` en vez de asumir
 * que `conditionResults` ya llega ordenado.
 */
export function findContinueEvaluationTarget(
  conditionResults: readonly ConditionResultEntry[],
): ContinueEvaluationTarget {
  const sorted = [...conditionResults].sort((a, b) => a.condition.order - b.condition.order)
  const firstPending = sorted.find((entry) => entry.progress.pendingCount > 0)

  return firstPending
    ? { type: 'condition', conditionId: firstPending.condition.id }
    : { type: 'summary' }
}
