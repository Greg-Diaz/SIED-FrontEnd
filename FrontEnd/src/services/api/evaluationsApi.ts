import { baseApi } from './baseApi'
import { cloneMockValue } from '@/services/mockServer/clone'
import { MockApiError } from '@/services/mockServer/errors'
import { mockDb } from '@/services/mockServer/db'
import type { Evaluation, EvaluationStatus } from '@/types'

export interface EvaluationKey {
  scenarioId: string
  criterionId: string
}

/**
 * `status`/`comments` son opcionales: se admite actualizar solo el estado, solo
 * los comentarios, o ambos a la vez.
 */
export interface UpdateEvaluationArgs extends EvaluationKey {
  status?: EvaluationStatus
  comments?: string
}

function findEvaluation({ scenarioId, criterionId }: EvaluationKey): Evaluation | undefined {
  return mockDb.evaluations.find(
    (e) => e.scenarioId === scenarioId && e.criterionId === criterionId,
  )
}

export const evaluationsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getEvaluationsByScenario: builder.query<Evaluation[], string>({
      query: (scenarioId) => () =>
        cloneMockValue(mockDb.evaluations.filter((e) => e.scenarioId === scenarioId)),
      providesTags: (result, _error, scenarioId) =>
        result
          ? [
              ...result.map((e) => ({
                type: 'Evaluation' as const,
                id: `${e.scenarioId}:${e.criterionId}`,
              })),
              { type: 'Evaluation' as const, id: `LIST:${scenarioId}` },
            ]
          : [{ type: 'Evaluation' as const, id: `LIST:${scenarioId}` }],
    }),

    getEvaluation: builder.query<Evaluation, EvaluationKey>({
      query: (key) => () => {
        const evaluation = findEvaluation(key)
        if (!evaluation) {
          throw new MockApiError(
            404,
            `Evaluation no encontrada para escenario "${key.scenarioId}" y criterio "${key.criterionId}".`,
          )
        }
        return cloneMockValue(evaluation)
      },
      providesTags: (_result, _error, key) => [
        { type: 'Evaluation', id: `${key.scenarioId}:${key.criterionId}` },
      ],
    }),

    /**
     * Actualiza el estado y/o los comentarios de UNA evaluación ya existente
     * (no crea evaluaciones nuevas: los 43 criterios de cada escenario ya
     * tienen un registro en los mocks, aunque sea `PENDING`).
     *
     * IMPORTANTE (alcance de la Fase 5, vigente en Fase 7): esta mutación SOLO
     * reemplaza los campos crudos (`status`, `comments`, `updatedAt`) del
     * registro en memoria (`services/mockServer/db.ts`). NO recalcula ningún
     * porcentaje, valor, juicio, ni el dashboard — esa lógica
     * (`calculateCompliance()`, `calculateObjectiveResult()`, etc.) es
     * responsabilidad de una fase posterior y vive fuera de esta capa de
     * infraestructura.
     *
     * `updatedAt` (Fase 7) lo estampa el propio Mock API con la hora del
     * servidor en cada guardado exitoso — el cliente NUNCA lo envía como
     * argumento (igual que haría un backend real; confiar en el reloj del
     * cliente para esto sería incorrecto).
     */
    updateEvaluation: builder.mutation<Evaluation, UpdateEvaluationArgs>({
      query: (args) => () => {
        const evaluation = findEvaluation(args)
        if (!evaluation) {
          throw new MockApiError(
            404,
            `No existe una evaluación para actualizar en escenario "${args.scenarioId}" y criterio "${args.criterionId}".`,
          )
        }
        if (args.status !== undefined) {
          evaluation.status = args.status
        }
        if (args.comments !== undefined) {
          evaluation.comments = args.comments
        }
        evaluation.updatedAt = new Date().toISOString()
        return cloneMockValue(evaluation)
      },
      invalidatesTags: (_result, _error, args) => [
        { type: 'Evaluation', id: `${args.scenarioId}:${args.criterionId}` },
        { type: 'Evaluation', id: `LIST:${args.scenarioId}` },
      ],
    }),
  }),
})

export const {
  useGetEvaluationsByScenarioQuery,
  useGetEvaluationQuery,
  useUpdateEvaluationMutation,
} = evaluationsApi
