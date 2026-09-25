/**
 * Estado de evaluación de un criterio (docs/PROMPT.md §10, §40.1 reglas 5 y 6).
 *
 * - `C`, `NC`, `NA`: los TRES ÚNICOS estados que existen en el Excel original
 *   (columna "Estado", validación de datos `list: "C,NC,NA"`).
 * - `PENDING`: extensión EXCLUSIVA de esta aplicación web. NO EXISTE EN EL EXCEL.
 *   En el Excel, un criterio sin diligenciar es simplemente una celda vacía que
 *   no se cuenta en ningún `COUNTIF` (ni C, ni NC, ni NA) — no es un cuarto
 *   estado formal. `PENDING` se agrega aquí únicamente para que la interfaz
 *   pueda distinguir visualmente "criterio aún sin evaluar" de "evaluado como
 *   No Aplica". No debe asumirse que proviene del Excel.
 */
export type EvaluationStatus = 'C' | 'NC' | 'NA' | 'PENDING'
