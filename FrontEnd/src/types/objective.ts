import type { ConditionCode } from './conditionCode'

/**
 * Definición/configuración de qué se está midiendo (docs/PROMPT.md §13, §40.1 regla 15).
 *
 * `Objective` es un concepto EXCLUSIVO de esta aplicación — el Excel no tiene la
 * noción de "objetivo" ni de meta. Es metadata descriptiva, sin ningún valor
 * calculado (eso es responsabilidad exclusiva de `ObjectiveResult`).
 *
 * `conditionId: null` representa el objetivo global del escenario completo;
 * cualquier otro valor liga el objetivo a una condición específica.
 */
export interface Objective {
  id: string
  conditionId: ConditionCode | null
  title: string
  description: string
}
