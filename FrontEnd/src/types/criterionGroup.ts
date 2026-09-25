/**
 * Agrupador visual dentro de una subcondición (docs/PROMPT.md §9, §40.1 regla 4).
 *
 * Representa las filas de subtítulo del Excel que NO son criterios evaluables
 * (p. ej. "2.1.1. Escenario de Práctica Clínicos", "2.2.2. Escenario de Práctica
 * con servicios de Baja Complejidad"). No tienen estado, ni comentarios, ni
 * mecanismos de verificación propios — son puramente organizativos.
 *
 * `CriterionGroup` es OPCIONAL: `Criterion.groupId` puede ser `null`/`undefined`.
 * Solo existen grupos dentro de las 2 subcondiciones de Capacidad Instalada
 * (2.1 y 2.2); el resto de subcondiciones no tiene ningún `CriterionGroup`.
 */
export interface CriterionGroup {
  id: string
  subConditionId: string
  name: string
  order: number
}
