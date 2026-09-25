import { baseApi } from './baseApi'
import { cloneMockValue } from '@/services/mockServer/clone'
import { MockApiError } from '@/services/mockServer/errors'
import { mockDb } from '@/services/mockServer/db'
import type { ConditionCode, SubCondition } from '@/types'

export const subConditionsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSubConditions: builder.query<SubCondition[], void>({
      query: () => () => cloneMockValue(mockDb.subConditions),
      providesTags: (result) =>
        result
          ? [
              ...result.map((sc) => ({ type: 'SubCondition' as const, id: sc.id })),
              { type: 'SubCondition' as const, id: 'LIST' },
            ]
          : [{ type: 'SubCondition' as const, id: 'LIST' }],
    }),

    getSubConditionsByCondition: builder.query<SubCondition[], ConditionCode>({
      query: (conditionId) => () =>
        cloneMockValue(mockDb.subConditions.filter((sc) => sc.conditionId === conditionId)),
      providesTags: (result, _error, conditionId) =>
        result
          ? [
              ...result.map((sc) => ({ type: 'SubCondition' as const, id: sc.id })),
              { type: 'SubCondition' as const, id: `LIST:${conditionId}` },
            ]
          : [{ type: 'SubCondition' as const, id: `LIST:${conditionId}` }],
    }),

    getSubConditionById: builder.query<SubCondition, string>({
      query: (subConditionId) => () => {
        const subCondition = mockDb.subConditions.find((sc) => sc.id === subConditionId)
        if (!subCondition) {
          throw new MockApiError(404, `SubCondition "${subConditionId}" no encontrada.`)
        }
        return cloneMockValue(subCondition)
      },
      providesTags: (_result, _error, subConditionId) => [
        { type: 'SubCondition', id: subConditionId },
      ],
    }),
  }),
})

export const {
  useGetSubConditionsQuery,
  useGetSubConditionsByConditionQuery,
  useGetSubConditionByIdQuery,
} = subConditionsApi
