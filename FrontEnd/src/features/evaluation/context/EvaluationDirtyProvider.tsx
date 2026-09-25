import { useCallback, useMemo, useState, type ReactNode } from 'react'

import { EvaluationDirtyContext, type EvaluationDirtyContextValue } from './evaluationDirtyContext'
import { withDirtyEvaluation } from './dirtyEvaluationsSet'

/**
 * Agrega el "¿tiene cambios sin guardar?" de TODOS los `EvaluationForm`
 * visibles en la página actual (Fase 11 §10, "CAMBIOS NO GUARDADOS").
 *
 * Cada `EvaluationForm` ya calcula su propio `isDirty` (Fase 7); este
 * contexto —acotado a la página que lo monta (`ConditionPage`), no un store
 * global— solo lo suma, para que la página sepa si CUALQUIER criterio tiene
 * ediciones locales sin persistir, sin necesidad de un sistema de dirty
 * state complejo (§10: "no implementar un sistema global complejo si no es
 * necesario").
 */
export function EvaluationDirtyProvider({ children }: { children: ReactNode }) {
  const [dirtyIds, setDirtyIds] = useState<ReadonlySet<string>>(() => new Set())

  const reportDirty = useCallback((criterionId: string, isDirty: boolean) => {
    setDirtyIds((prev) => withDirtyEvaluation(prev, criterionId, isDirty))
  }, [])

  const value = useMemo<EvaluationDirtyContextValue>(
    () => ({ reportDirty, hasUnsavedChanges: dirtyIds.size > 0 }),
    [reportDirty, dirtyIds],
  )

  return <EvaluationDirtyContext.Provider value={value}>{children}</EvaluationDirtyContext.Provider>
}
