import { useGetScenariosQuery } from '@/services/api'

/**
 * Resuelve el "escenario activo" para el formulario de evaluación (Fase 7,
 * punto 11 de docs/PROMPT.md).
 *
 * Solución deliberadamente simple para esta V1: se usa el primer escenario
 * devuelto por el Mock API. NO hay selector de escenarios, ni histórico, ni
 * login/usuario — eso corresponde explícitamente a la Fase 18 ("Dashboard
 * Dinámico") de docs/PROMPT.md §18, que ya reserva ese trabajo.
 *
 * Centralizar esta decisión aquí (en un único hook) evita una segunda fuente
 * de verdad: cuando exista un selector real, solo este archivo cambia.
 */
export function useActiveScenario() {
  const { data: scenarios, isLoading, error } = useGetScenariosQuery()
  const scenario = scenarios?.[0]

  return {
    scenario,
    scenarioId: scenario?.id,
    isLoading,
    error,
  }
}
