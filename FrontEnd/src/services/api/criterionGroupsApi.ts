import { baseApi } from './baseApi'
import { cloneMockValue } from '@/services/mockServer/clone'
import { mockDb } from '@/services/mockServer/db'
import type { CriterionGroup } from '@/types'

/**
 * `CriterionGroup` es opcional por diseño (docs/PROMPT.md §9, §40.1 regla 4):
 * solo existen grupos dentro de las subcondiciones 2.1 y 2.2 de Capacidad
 * Instalada. Por eso no se expone un `getCriterionGroupById` obligatorio para
 * cada criterio — los consumidores deben tratar la ausencia de grupos como un
 * caso normal, no como un error.
 */
export const criterionGroupsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCriterionGroups: builder.query<CriterionGroup[], void>({
      query: () => () => cloneMockValue(mockDb.criterionGroups),
      providesTags: (result) =>
        result
          ? [
              ...result.map((group) => ({ type: 'CriterionGroup' as const, id: group.id })),
              { type: 'CriterionGroup' as const, id: 'LIST' },
            ]
          : [{ type: 'CriterionGroup' as const, id: 'LIST' }],
    }),

    getCriterionGroupsBySubCondition: builder.query<CriterionGroup[], string>({
      query: (subConditionId) => () =>
        cloneMockValue(
          mockDb.criterionGroups.filter((group) => group.subConditionId === subConditionId),
        ),
      providesTags: (result, _error, subConditionId) =>
        result
          ? [
              ...result.map((group) => ({ type: 'CriterionGroup' as const, id: group.id })),
              { type: 'CriterionGroup' as const, id: `LIST:${subConditionId}` },
            ]
          : [{ type: 'CriterionGroup' as const, id: `LIST:${subConditionId}` }],
    }),
  }),
})

export const { useGetCriterionGroupsQuery, useGetCriterionGroupsBySubConditionQuery } =
  criterionGroupsApi
