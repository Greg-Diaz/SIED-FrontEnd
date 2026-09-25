/**
 * Estado de un resultado de cumplimiento — usado tanto por `ComplianceResult`
 * (resultados intermedios: subcondición, condición) como por `ObjectiveResult`
 * (resultado final ligado a un `Objective`). Ver docs/PROMPT.md §13, §14,
 * §40.1 reglas 10, 12 y 13.
 *
 * - `EVALUATED`: todos los criterios aplicables fueron diligenciados (C o NC);
 *   `compliancePercentage` (y, en `ObjectiveResult`, `value`/`judgement`) son
 *   valores no nulos.
 * - `PARTIAL`: existen criterios aún en `PENDING` (extensión de la app,
 *   docs/PROMPT.md §10), pero también existen criterios efectivos (C/NC); el
 *   porcentaje se calcula igualmente sobre lo ya evaluado.
 * - `NOT_EVALUABLE`: no existen criterios efectivos en este nivel (todos los
 *   aplicables están en NA), o — para una condición/el global — alguno de
 *   sus componentes es `NOT_EVALUABLE` y esa condición se propaga hacia
 *   arriba (docs/PROMPT.md §14 reglas 1 y 3). Reemplaza el `#DIV/0!` del
 *   Excel: nunca debe traducirse en `0%`.
 */
export type ObjectiveResultStatus = 'EVALUATED' | 'PARTIAL' | 'NOT_EVALUABLE'
