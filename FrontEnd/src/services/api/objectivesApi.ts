import { baseApi } from './baseApi'
import { cloneMockValue } from '@/services/mockServer/clone'
import { MockApiError } from '@/services/mockServer/errors'
import { mockDb } from '@/services/mockServer/db'
import type { ConditionCode, Objective } from '@/types'

export const objectivesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getObjectives: builder.query<Objective[], void>({
      query: () => () => cloneMockValue(mockDb.objectives),
      providesTags: (result) =>
        result
          ? [
              ...result.map((objective) => ({ type: 'Objective' as const, id: objective.id })),
              { type: 'Objective' as const, id: 'LIST' },
            ]
          : [{ type: 'Objective' as const, id: 'LIST' }],
    }),

    /** `conditionId: null` obtiene el/los objetivo(s) globales del escenario (docs/PROMPT.md §13). */
    getObjectivesByCondition: builder.query<Objective[], ConditionCode | null>({
      query: (conditionId) => () =>
        cloneMockValue(
          mockDb.objectives.filter((objective) => objective.conditionId === conditionId),
        ),
      providesTags: (result, _error, conditionId) =>
        result
          ? [
              ...result.map((objective) => ({ type: 'Objective' as const, id: objective.id })),
              { type: 'Objective' as const, id: `LIST:${conditionId ?? 'GLOBAL'}` },
            ]
          : [{ type: 'Objective' as const, id: `LIST:${conditionId ?? 'GLOBAL'}` }],
    }),

    getObjectiveById: builder.query<Objective, string>({
      query: (objectiveId) => () => {
        const objective = mockDb.objectives.find((o) => o.id === objectiveId)
        if (!objective) {
          throw new MockApiError(404, `Objective "${objectiveId}" no encontrado.`)
        }
        return cloneMockValue(objective)
      },
      providesTags: (_result, _error, objectiveId) => [{ type: 'Objective', id: objectiveId }],
    }),
  }),
})

export const {
  useGetObjectivesQuery,
  useGetObjectivesByConditionQuery,
  useGetObjectiveByIdQuery,
} = objectivesApi
