import type { ProgressResult } from '@/domain/compliance'
import type {
  ChartData,
  ComplianceResult,
  Condition,
  Objective,
  ObjectiveResult,
  Scenario,
  SubCondition,
} from '@/types'

/**
 * Modelos de vista de Fase 9 — combinan una entidad estructural (`SubCondition`
 * /`Condition`/`Scenario`) con su resultado YA CALCULADO por
 * `src/domain/compliance/`. Viven en `features/dashboard/` (no en
 * `src/types/`) porque son específicos de cómo la UI presenta el resumen, no
 * parte del modelo de dominio aprobado en Fase 3.
 */

export interface SubConditionResultEntry {
  subCondition: SubCondition
  /** No es un `ObjectiveResult`: no existe ningún `Objective` a nivel de subcondición en los mocks. */
  result: ComplianceResult
}

export interface ConditionResultEntry {
  condition: Condition
  objective: Objective
  objectiveResult: ObjectiveResult
  progress: ProgressResult
  /** 1 elemento para las 6 condiciones simples; exactamente 2 para Capacidad Instalada (2.1 y 2.2). */
  subConditionResults: SubConditionResultEntry[]
}

export interface ScenarioSummary {
  scenario: Scenario
  conditionResults: ConditionResultEntry[]
  globalObjective: Objective
  globalResult: ObjectiveResult
  globalProgress: ProgressResult
}

/**
 * Datos de un `ScenarioSummary` YA CALCULADO, reformateados para las
 * gráficas del Dashboard (Fase 10, `buildChartData()`). Ninguno de estos 3
 * campos recalcula compliance/progress/value/judgement/status — solo
 * reordena/convierte a la forma que necesita cada gráfica.
 */
export interface DashboardChartData {
  /**
   * 7 puntos (uno por condición, mismo orden que `conditionResults`) — Fase
   * 10 "Gráfico 1". `value` es el porcentaje 0-100 (convertido SOLO para
   * presentación desde la fracción 0-1 de `compliancePercentage`) o `null` +
   * `isNotEvaluable: true` cuando la condición es `NOT_EVALUABLE` — nunca se
   * dibuja `null` como `0`.
   */
  complianceByCondition: ChartData
  /**
   * 4 puntos (C, NC, NA, PENDING) con los conteos YA agregados en
   * `globalResult` (suma sobre las 7 condiciones) — Fase 10 "Gráfico 2".
   * Se mantienen incluso si `globalResult.status === 'NOT_EVALUABLE'`: los
   * conteos son un roll-up estructural, independiente del cumplimiento.
   */
  distribution: ChartData
  /**
   * Progreso global (`globalProgress`) TAL CUAL — Fase 10 "Gráfico 3". Nunca
   * se confunde con `complianceByCondition`/`distribution`: progreso mide
   * diligenciamiento, no cumplimiento.
   */
  progress: ProgressResult
}
