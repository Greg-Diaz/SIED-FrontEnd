import { baseApi } from './baseApi'
import { cloneMockValue } from '@/services/mockServer/clone'
import { MockApiError } from '@/services/mockServer/errors'
import { mockDb } from '@/services/mockServer/db'
import type { Condition, ConditionCode } from '@/types'

export const conditionsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getConditions: builder.query<Condition[], void>({
      query: () => () => cloneMockValue(mockDb.conditions),
      providesTags: (result) =>
        result
          ? [
              ...result.map((condition) => ({ type: 'Condition' as const, id: condition.id })),
              { type: 'Condition' as const, id: 'LIST' },
            ]
          : [{ type: 'Condition' as const, id: 'LIST' }],
    }),

    getConditionById: builder.query<Condition, ConditionCode>({
      query: (conditionId) => () => {
        const condition = mockDb.conditions.find((c) => c.id === conditionId)
        if (!condition) {
          throw new MockApiError(404, `Condition "${conditionId}" no encontrada.`)
        }
        return cloneMockValue(condition)
      },
      providesTags: (_result, _error, conditionId) => [{ type: 'Condition', id: conditionId }],
    }),
  }),
})

export const { useGetConditionsQuery, useGetConditionByIdQuery } = conditionsApi
