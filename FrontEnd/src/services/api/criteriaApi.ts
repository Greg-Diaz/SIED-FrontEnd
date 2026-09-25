import { baseApi } from './baseApi'
import { cloneMockValue } from '@/services/mockServer/clone'
import { MockApiError } from '@/services/mockServer/errors'
import { mockDb } from '@/services/mockServer/db'
import type { Criterion } from '@/types'

export const criteriaApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCriteria: builder.query<Criterion[], void>({
      query: () => () => cloneMockValue(mockDb.criteria),
      providesTags: (result) =>
        result
          ? [
              ...result.map((criterion) => ({ type: 'Criterion' as const, id: criterion.id })),
              { type: 'Criterion' as const, id: 'LIST' },
            ]
          : [{ type: 'Criterion' as const, id: 'LIST' }],
    }),

    getCriteriaBySubCondition: builder.query<Criterion[], string>({
      query: (subConditionId) => () =>
        cloneMockValue(
          mockDb.criteria.filter((criterion) => criterion.subConditionId === subConditionId),
        ),
      providesTags: (result, _error, subConditionId) =>
        result
          ? [
              ...result.map((criterion) => ({ type: 'Criterion' as const, id: criterion.id })),
              { type: 'Criterion' as const, id: `LIST:${subConditionId}` },
            ]
          : [{ type: 'Criterion' as const, id: `LIST:${subConditionId}` }],
    }),

    getCriterionById: builder.query<Criterion, string>({
      query: (criterionId) => () => {
        const criterion = mockDb.criteria.find((c) => c.id === criterionId)
        if (!criterion) {
          throw new MockApiError(404, `Criterion "${criterionId}" no encontrado.`)
        }
        return cloneMockValue(criterion)
      },
      providesTags: (_result, _error, criterionId) => [{ type: 'Criterion', id: criterionId }],
    }),
  }),
})

export const { useGetCriteriaQuery, useGetCriteriaBySubConditionQuery, useGetCriterionByIdQuery } =
  criteriaApi
