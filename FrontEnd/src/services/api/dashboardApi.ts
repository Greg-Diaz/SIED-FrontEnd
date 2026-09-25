import { baseApi } from './baseApi'
import { MockApiError } from '@/services/mockServer/errors'
import type { DashboardSummary } from '@/types'

/**
 * dashboardApi — RESERVA el contrato futuro del dashboard/consolidado para
 * un backend REST real (docs/PROMPT.md §14, §17).
 *
 * ACTUALIZACIÓN (Fase 9): el motor de cálculo (`domain/compliance/`, Fase 8)
 * y su integración con la UI (`features/dashboard/hooks/useScenarioSummary`,
 * Fase 9) YA EXISTEN, pero deliberadamente NO usan este endpoint. La
 * agregación (RTK Query → features → domain/compliance) ocurre del lado del
 * cliente, en la capa de features — exactamente como describe la
 * arquitectura de Fase 9 — en vez de dentro del Mock API. Hacerlo aquí
 * mezclaría lógica de negocio con la capa de acceso a datos, algo que
 * docs/PROMPT.md prohíbe explícitamente.
 *
 * Este endpoint queda reservado ÚNICAMENTE como contrato para cuando exista
 * un backend real (que sí calcularía server-side); mientras tanto sigue
 * respondiendo SIEMPRE con un error controlado 501 ("Not Implemented") — el
 * frontend actual (`DashboardPage`/`SummaryPage`) no lo consume.
 */
export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardSummary: builder.query<DashboardSummary, string>({
      query: (scenarioId) => () => {
        throw new MockApiError(
          501,
          `El resumen de dashboard para el escenario "${scenarioId}" aún no está implementado: depende del cálculo de cumplimiento de una fase posterior.`,
        )
      },
      providesTags: (_result, _error, scenarioId) => [{ type: 'Dashboard', id: scenarioId }],
    }),
  }),
})

export const { useGetDashboardSummaryQuery } = dashboardApi
