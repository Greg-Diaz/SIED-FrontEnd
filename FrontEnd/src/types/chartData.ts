/**
 * Punto de dato genérico para alimentar las gráficas del dashboard (docs/PROMPT.md
 * §5, §17). Es deliberadamente agnóstico de la librería de gráficas concreta
 * (Recharts u otra) — se construye a partir de `ObjectiveResult`/`DashboardSummary`
 * mediante la futura función pura `buildChartData()` (Fase 9/11).
 *
 * `value: null` + `isNotEvaluable: true` representa una condición `NOT_EVALUABLE`:
 * las gráficas deben distinguirla visualmente (p. ej. barra vacía con "N/A"),
 * nunca dibujarla como un valor de 0 (docs/PROMPT.md §17).
 */
export interface ChartDataPoint {
  label: string
  value: number | null
  isNotEvaluable?: boolean
}

export type ChartData = ChartDataPoint[]
