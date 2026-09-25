import type { ConditionCode } from './conditionCode'

/**
 * Una de las 7 condiciones principales del modelo (docs/PROMPT.md §9, §40.1 regla 1).
 * Nunca debe haber más ni menos de 7 instancias de `Condition` en el dominio.
 */
export interface Condition {
  id: ConditionCode
  name: string
  order: number
}
