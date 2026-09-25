import { createContext, useContext, useEffect } from 'react'

export interface EvaluationDirtyContextValue {
  reportDirty: (criterionId: string, isDirty: boolean) => void
  hasUnsavedChanges: boolean
}

/**
 * Contexto + hooks de consumo (Fase 11 §10, "CAMBIOS NO GUARDADOS"). Separado
 * de `EvaluationDirtyProvider.tsx` (el componente) para que ese archivo solo
 * exporte un componente — este, en cambio, no exporta ningún componente, así
 * que ninguno de los dos dispara la advertencia de Fast Refresh de
 * `react-refresh/only-export-components`.
 */
export const EvaluationDirtyContext = createContext<EvaluationDirtyContextValue | null>(null)

/**
 * Registra el `isDirty` de UN criterio en el `EvaluationDirtyProvider` más
 * cercano (si existe) — se desregistra automáticamente al desmontar. Fuera
 * de un `EvaluationDirtyProvider` (p. ej. en un test unitario de
 * `EvaluationForm` aislado) no hace nada: el contexto es una mejora
 * progresiva, no un requisito para que el formulario funcione.
 */
export function useReportEvaluationDirty(criterionId: string, isDirty: boolean) {
  // Se desestructura `reportDirty` (estable vía `useCallback` en el
  // provider) en vez de depender del objeto `context` completo: `context`
  // cambia de identidad cada vez que CUALQUIER criterio de la página cambia
  // su estado sucio (el `useMemo` del provider depende de `dirtyIds`), lo que
  // dispararía este efecto para criterios que no cambiaron.
  const reportDirty = useContext(EvaluationDirtyContext)?.reportDirty

  useEffect(() => {
    if (!reportDirty) return
    reportDirty(criterionId, isDirty)
    return () => reportDirty(criterionId, false)
  }, [reportDirty, criterionId, isDirty])
}

/** `true` si algún criterio de la página tiene cambios sin guardar. */
export function useHasUnsavedEvaluations(): boolean {
  const context = useContext(EvaluationDirtyContext)
  return context?.hasUnsavedChanges ?? false
}
