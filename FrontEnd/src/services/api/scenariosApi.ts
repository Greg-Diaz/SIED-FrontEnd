import { baseApi } from './baseApi'
import { cloneMockValue } from '@/services/mockServer/clone'
import { MockApiError } from '@/services/mockServer/errors'
import { mockDb } from '@/services/mockServer/db'
import type { Scenario } from '@/types'

export const scenariosApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getScenarios: builder.query<Scenario[], void>({
      query: () => () => cloneMockValue(mockDb.scenarios),
      providesTags: (result) =>
        result
          ? [
              ...result.map((scenario) => ({ type: 'Scenario' as const, id: scenario.id })),
              { type: 'Scenario' as const, id: 'LIST' },
            ]
          : [{ type: 'Scenario' as const, id: 'LIST' }],
    }),

    getScenarioById: builder.query<Scenario, string>({
      query: (scenarioId) => () => {
        const scenario = mockDb.scenarios.find((s) => s.id === scenarioId)
        if (!scenario) {
          throw new MockApiError(404, `Scenario "${scenarioId}" no encontrado.`)
        }
        return cloneMockValue(scenario)
      },
      providesTags: (_result, _error, scenarioId) => [{ type: 'Scenario', id: scenarioId }],
    }),
  }),
})

export const { useGetScenariosQuery, useGetScenarioByIdQuery } = scenariosApi
