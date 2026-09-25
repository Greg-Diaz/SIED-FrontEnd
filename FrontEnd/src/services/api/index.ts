/**
 * Barrel de la capa de API (Fase 5). Importar desde aquí (en vez de cada
 * *Api.ts suelto) garantiza que todos los `injectEndpoints` se ejecuten antes
 * de usar cualquier hook, y es el único punto de entrada que deberían usar
 * features/componentes — nunca acceder a `services/mockServer/*` directamente.
 */
export { baseApi } from './baseApi'

export { conditionsApi, useGetConditionByIdQuery, useGetConditionsQuery } from './conditionsApi'

export {
  criteriaApi,
  useGetCriteriaBySubConditionQuery,
  useGetCriteriaQuery,
  useGetCriterionByIdQuery,
} from './criteriaApi'

export {
  criterionGroupsApi,
  useGetCriterionGroupsBySubConditionQuery,
  useGetCriterionGroupsQuery,
} from './criterionGroupsApi'

export { dashboardApi, useGetDashboardSummaryQuery } from './dashboardApi'

export type { EvaluationKey, UpdateEvaluationArgs } from './evaluationsApi'
export {
  evaluationsApi,
  useGetEvaluationQuery,
  useGetEvaluationsByScenarioQuery,
  useUpdateEvaluationMutation,
} from './evaluationsApi'

export type { MockErrorPayload, MockHandler, MockQueryError } from './mockBaseQuery'
export { mockBaseQuery } from './mockBaseQuery'

export {
  objectivesApi,
  useGetObjectiveByIdQuery,
  useGetObjectivesByConditionQuery,
  useGetObjectivesQuery,
} from './objectivesApi'

export { scenariosApi, useGetScenarioByIdQuery, useGetScenariosQuery } from './scenariosApi'

export {
  subConditionsApi,
  useGetSubConditionByIdQuery,
  useGetSubConditionsByConditionQuery,
  useGetSubConditionsQuery,
} from './subConditionsApi'
