import type { ConditionCode } from './conditionCode'

/**
 * Subdivisión de una condición (docs/PROMPT.md §9, §40.1 regla 3).
 *
 * Todas las condiciones tienen exactamente 1 subcondición, EXCEPTO Capacidad Instalada
 * (CI), que tiene exactamente 2: "2.1 Análisis de la Capacidad Instalada" (4 criterios)
 * y "2.2 Infraestructura y Medios Educativos" (9 criterios).
 *
 * Modelar `SubCondition` como nivel explícito para TODAS las condiciones (no solo CI)
 * es una decisión de diseño deliberada: evita tratar a Capacidad Instalada como caso
 * especial en el código (jerarquía simétrica Condition → SubCondition → ... → Criterion).
 */
export interface SubCondition {
  id: string
  conditionId: ConditionCode
  code: string
  name: string
  order: number
}
