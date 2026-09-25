import type { SerializedError } from '@reduxjs/toolkit'
import { useMemo } from 'react'

import {
  useGetConditionsQuery,
  useGetCriteriaQuery,
  useGetEvaluationsByScenarioQuery,
  useGetObjectivesQuery,
  useGetSubConditionsQuery,
} from '@/services/api'
import { buildScenarioSummary } from '../utils/buildScenarioSummary'
import type { MockQueryError } from '@/services/api'
import type { Scenario } from '@/types'
import type { ScenarioSummary } from '../types'

/**
 * Mismo tipo de error "renderizable" que ya usan el resto de hooks de RTK
 * Query (`MockQueryError | SerializedError`), más `Error` para el caso —
 * defensivo, no debería ocurrir con los mocks aprobados — de un `Objective`
 * faltante detectado por `buildScenarioSummary`. Se evita `unknown` a
 * propósito: ensancharía a `unknown` el `??` que las páginas hacen entre
 * varias fuentes de error, rompiendo `{error && <ErrorState .../>}`.
 */
type ScenarioSummaryError = MockQueryError | SerializedError | Error

interface UseScenarioSummaryResult {
  data: ScenarioSummary | undefined
  isLoading: boolean
  error: ScenarioSummaryError | null
}

/**
 * Hook de integración (Fase 9): obtiene TODO lo necesario mediante los hooks
 * de RTK Query existentes (una sola consulta por recurso — nunca 43
 * consultas individuales, ver `getEvaluationsByScenario`) y delega el
 * cálculo real a `buildScenarioSummary()` (features) → `domain/compliance`
 * (dominio). No contiene ninguna fórmula de negocio.
 *
 * Sirve por igual a `ConditionPage`, `SummaryPage` y `DashboardPage`: las
 * tres consumen el MISMO modelo de resumen en vez de tener cada una su
 * propia lógica de agregación (evita duplicar fórmulas entre páginas).
 */
export function useScenarioSummary(scenario: Scenario | undefined): UseScenarioSummaryResult {
  const scenarioId = scenario?.id

  const conditionsQuery = useGetConditionsQuery()
  const subConditionsQuery = useGetSubConditionsQuery()
  const criteriaQuery = useGetCriteriaQuery()
  const objectivesQuery = useGetObjectivesQuery()
  const evaluationsQuery = useGetEvaluationsByScenarioQuery(scenarioId ?? '', {
    skip: !scenarioId,
  })

  const isLoading =
    conditionsQuery.isLoading ||
    subConditionsQuery.isLoading ||
    criteriaQuery.isLoading ||
    objectivesQuery.isLoading ||
    evaluationsQuery.isLoading

  const queryError =
    conditionsQuery.error ??
    subConditionsQuery.error ??
    criteriaQuery.error ??
    objectivesQuery.error ??
    evaluationsQuery.error

  const computed = useMemo(() => {
    if (
      !scenario ||
      !conditionsQuery.data ||
      !subConditionsQuery.data ||
      !criteriaQuery.data ||
      !objectivesQuery.data ||
      !evaluationsQuery.data
    ) {
      return null
    }
    try {
      return {
        data: buildScenarioSummary({
          scenario,
          conditions: conditionsQuery.data,
          subConditions: subConditionsQuery.data,
          criteria: criteriaQuery.data,
          evaluations: evaluationsQuery.data,
          objectives: objectivesQuery.data,
        }),
        buildError: null as unknown,
      }
    } catch (buildError) {
      return { data: undefined, buildError }
    }
  }, [
    scenario,
    conditionsQuery.data,
    subConditionsQuery.data,
    criteriaQuery.data,
    objectivesQuery.data,
    evaluationsQuery.data,
  ])

  // `buildError` viene de un `catch` (siempre `unknown` en TypeScript); se
  // normaliza a `Error` para que el tipo de retorno de este hook siga siendo
  // el mismo tipo de error "renderizable" que ya usan el resto de hooks de
  // RTK Query en las páginas (evita ensanchar a `unknown` el `??` que las
  // páginas hacen entre varias fuentes de error).
  const normalizedBuildError =
    computed?.buildError !== undefined && computed.buildError !== null
      ? computed.buildError instanceof Error
        ? computed.buildError
        : new Error(String(computed.buildError))
      : null

  return {
    data: computed?.data,
    isLoading,
    error: queryError ?? normalizedBuildError,
  }
}
