import { createApi } from '@reduxjs/toolkit/query/react'

import { mockBaseQuery } from './mockBaseQuery'

/**
 * baseApi — configuración central de RTK Query (docs/PROMPT.md §7).
 *
 * Estado actual (Fase 5): `baseQuery` es `mockBaseQuery` (./mockBaseQuery.ts),
 * que resuelve cada endpoint contra el store en memoria de
 * `services/mockServer/db.ts` (clonado de `src/mocks/*.json`), con latencia
 * artificial y errores controlados — ver docs/PROMPT.md §8.
 *
 * Los endpoints concretos se agregan vía `baseApi.injectEndpoints` en archivos
 * separados por recurso: scenariosApi.ts, conditionsApi.ts, subConditionsApi.ts,
 * criterionGroupsApi.ts, criteriaApi.ts, evaluationsApi.ts, objectivesApi.ts y
 * dashboardApi.ts (este último solo reserva el contrato futuro, sin cálculos —
 * ver el comentario en dashboardApi.ts).
 *
 * REEMPLAZO FUTURO POR BACKEND REAL: ver el comentario en mockBaseQuery.ts —
 * el cambio se limita a esta configuración; los *Api.ts y los componentes que
 * los consuman no deberían requerir modificaciones adicionales.
 */
export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: mockBaseQuery,
  tagTypes: [
    'Scenario',
    'Condition',
    'SubCondition',
    'CriterionGroup',
    'Criterion',
    'Evaluation',
    'Objective',
    'Dashboard',
  ],
  endpoints: () => ({}),
})
