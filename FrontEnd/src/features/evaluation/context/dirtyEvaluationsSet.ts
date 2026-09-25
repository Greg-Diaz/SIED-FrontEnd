/**
 * Actualización inmutable del conjunto de criterios con cambios sin guardar
 * (Fase 11 §10, "CAMBIOS NO GUARDADOS"). Extraída como función pura —sin
 * React— para poder probarla sin montar componentes (§37, "dirty state si se
 * implementa"). No es lógica de negocio del dominio: es puro estado de UI
 * (qué formularios tienen ediciones locales todavía no persistidas).
 *
 * Devuelve la MISMA referencia (`current`) cuando el cambio es un no-op
 * (`isDirty` ya coincide con la membresía actual), para que
 * `EvaluationDirtyContext` no dispare un re-render innecesario.
 */
export function withDirtyEvaluation(
  current: ReadonlySet<string>,
  criterionId: string,
  isDirty: boolean,
): ReadonlySet<string> {
  const alreadyDirty = current.has(criterionId)
  if (isDirty === alreadyDirty) return current

  const next = new Set(current)
  if (isDirty) {
    next.add(criterionId)
  } else {
    next.delete(criterionId)
  }
  return next
}
