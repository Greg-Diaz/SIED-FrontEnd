import { useEffect, useState } from 'react'

import { ErrorState } from '@/components/feedback/ErrorState'
import { useUpdateEvaluationMutation } from '@/services/api'
import type { Criterion, Evaluation } from '@/types'
import { useReportEvaluationDirty } from '../context/evaluationDirtyContext'
import { EvaluationComments } from './EvaluationComments'
import { EvaluationSaveButton } from './EvaluationSaveButton'
import { EvaluationStatusSelector, type SelectableEvaluationStatus } from './EvaluationStatusSelector'
import styles from './EvaluationForm.module.css'

interface EvaluationFormProps {
  scenarioId: string
  criterion: Criterion
  /** `undefined` solo si, de forma anómala, no existiera ningún registro para este par (escenario, criterio). */
  evaluation: Evaluation | undefined
}

function toSelectable(evaluation: Evaluation | undefined): SelectableEvaluationStatus | null {
  if (!evaluation || evaluation.status === 'PENDING') return null
  return evaluation.status
}

/**
 * Captura y persiste la evaluación de UN criterio (Fase 7): selector C/NC/NA,
 * comentarios y guardado vía `updateEvaluation`. NO calcula ni muestra
 * ningún porcentaje/valor/juicio — solo lee y escribe el `Evaluation` crudo.
 *
 * El valor inicial del borrador se toma de `evaluation` en el momento del
 * montaje (los datos ya llegaron resueltos desde `ConditionPage`, que
 * solo renderiza este árbol una vez que `getEvaluationsByScenario` terminó
 * de cargar) — así se evita perder ediciones en curso si la lista se
 * revalida en segundo plano tras un guardado.
 */
export function EvaluationForm({ scenarioId, criterion, evaluation }: EvaluationFormProps) {
  const [status, setStatus] = useState<SelectableEvaluationStatus | null>(() =>
    toSelectable(evaluation),
  )
  const [comments, setComments] = useState<string>(() => evaluation?.comments ?? '')
  const [justSaved, setJustSaved] = useState(false)

  const [updateEvaluation, { isLoading: isSaving, error: saveError }] = useUpdateEvaluationMutation()

  const savedStatus = toSelectable(evaluation)
  const savedComments = evaluation?.comments ?? ''
  const isDirty = status !== savedStatus || comments !== savedComments

  // Fase 11 §10: expone este `isDirty` al `EvaluationDirtyProvider` más
  // cercano (montado por `ConditionPage`) para que la página sepa si
  // CUALQUIER criterio tiene cambios sin guardar, sin recalcular nada aquí.
  useReportEvaluationDirty(criterion.id, isDirty)

  // Si el usuario vuelve a editar después de guardar, la confirmación deja de aplicar.
  useEffect(() => {
    if (isDirty) setJustSaved(false)
  }, [isDirty])

  // La confirmación "✓ Evaluación guardada" es discreta y temporal (Fase 7, punto 8).
  useEffect(() => {
    if (!justSaved) return
    const timer = setTimeout(() => setJustSaved(false), 2500)
    return () => clearTimeout(timer)
  }, [justSaved])

  async function handleSave() {
    try {
      await updateEvaluation({
        scenarioId,
        criterionId: criterion.id,
        comments,
        ...(status !== null ? { status } : {}),
      }).unwrap()
      setJustSaved(true)
    } catch {
      // El error queda expuesto vía `saveError` de la mutación (se renderiza abajo);
      // los valores del borrador (status/comments) se conservan sin cambios.
    }
  }

  return (
    <div className={styles.form}>
      <EvaluationStatusSelector
        name={`evaluation-status-${criterion.id}`}
        value={status}
        onChange={setStatus}
        disabled={isSaving}
      />
      <EvaluationComments
        id={`evaluation-comments-${criterion.id}`}
        value={comments}
        onChange={setComments}
        disabled={isSaving}
      />
      {saveError && (
        <ErrorState
          error={saveError}
          title="No fue posible guardar la evaluación."
          message="Verifica tu conexión e inténtalo nuevamente. Tus respuestas no se perdieron."
        />
      )}
      <EvaluationSaveButton
        isSaving={isSaving}
        disabled={!isDirty}
        justSaved={justSaved}
        onClick={handleSave}
      />
    </div>
  )
}
