/**
 * Motor de cálculo de cumplimiento (Fase 8 — docs/PROMPT.md §13, §14, §17,
 * §28, §40). Funciones puras: no hacen fetch, no importan RTK Query, no
 * acceden a mockDb ni al store de Redux, no mutan sus argumentos. Reciben
 * los datos como parámetros y devuelven objetos nuevos, para que funcionen
 * igual sin importar si los datos provienen del Mock API o de un backend
 * REST real en el futuro.
 *
 * `buildChartData()` (mencionado en la arquitectura original,
 * docs/PROMPT.md §4/§28) se implementó en Fase 10 en
 * `features/dashboard/utils/buildChartData.ts`, no aquí: consume
 * `ScenarioSummary` (un modelo de vista de Fase 9, definido en
 * `features/dashboard/types.ts`), y el dominio no debe depender de tipos de
 * `features/` — solo de las funciones puras de este módulo.
 */
export { aggregateComplianceResults } from './aggregateComplianceResults'
export { calculateCompliance } from './calculateCompliance'
export { calculateConditionSummary } from './calculateConditionSummary'
export { calculateGlobalSummary } from './calculateGlobalSummary'
export { calculateObjectiveResult } from './calculateObjectiveResult'
export { calculateProgress, type ProgressResult } from './calculateProgress'
export { getComplianceJudgement } from './getComplianceJudgement'
export { getComplianceValue } from './getComplianceValue'
