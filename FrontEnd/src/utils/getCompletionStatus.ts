import type { ProgressResult } from '@/domain/compliance'
import type { ObjectiveResultStatus } from '@/types'

/**
 * Estado de COMPLETITUD — Fase 11 §3. Es un concepto distinto de
 * `ObjectiveResultStatus` (EVALUATED/PARTIAL/NOT_EVALUABLE, cumplimiento):
 * responde "¿qué le falta al usuario por diligenciar?", no "¿cuánto cumple?".
 *
 * - `COMPLETED`: no quedan criterios `PENDING` (progreso 100%) y el resultado
 *   de cumplimiento SÍ pudo calcularse (`EVALUATED`).
 * - `PENDING`: existe al menos un criterio `PENDING` — SIEMPRE tiene
 *   prioridad sobre `NOT_EVALUABLE` (ver más abajo), porque es lo único que
 *   requiere una acción del usuario.
 * - `NOT_EVALUABLE`: no quedan criterios `PENDING`, pero el cumplimiento no
 *   pudo calcularse (todos los criterios aplicables están en `NA`) — nada
 *   pendiente por diligenciar, pero tampoco hay un porcentaje que mostrar.
 */
export type CompletionStatus = 'COMPLETED' | 'PENDING' | 'NOT_EVALUABLE'

/**
 * Deriva el estado de completitud a partir de dos resultados YA CALCULADOS
 * (`domain/compliance`, Fase 8) — no recalcula nada, es pura decisión de
 * presentación (docs/PROMPT.md Fase 11 §3 y regla arquitectónica principal).
 *
 * IMPORTANTE (Fase 11 §3, "no confundir PENDIENTE con NO EVALUABLE"):
 * `ObjectiveResultStatus === 'NOT_EVALUABLE'` NO implica que no haya nada
 * pendiente — `calculateCompliance()` devuelve `NOT_EVALUABLE` en cuanto
 * `effectiveCriteria === 0`, sin importar si además quedan criterios
 * `PENDING` sin diligenciar (p. ej. algunos `NA` + uno todavía sin
 * responder). Por eso `progress.pendingCount` se revisa SIEMPRE primero: es
 * el único hecho que distingue "todavía hay algo por hacer" de "ya se
 * respondió todo, pero no se puede calcular un porcentaje".
 */
export function getCompletionStatus(
  status: ObjectiveResultStatus,
  progress: ProgressResult,
): CompletionStatus {
  if (progress.pendingCount > 0) return 'PENDING'
  if (status === 'NOT_EVALUABLE') return 'NOT_EVALUABLE'
  return 'COMPLETED'
}
