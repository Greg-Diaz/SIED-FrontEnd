import type { Condition } from '@/types'

export interface AdjacentConditions {
  /** `false` cuando `currentConditionId` no aparece en `conditions` (dato aún no cargado, o id inválido). */
  isKnownCondition: boolean
  previous?: Condition
  next?: Condition
}

/**
 * Condición anterior/siguiente respecto a `currentConditionId` (Fase 11 §4,
 * "NAVEGACIÓN ENTRE CONDICIONES"). Ordena SIEMPRE por `Condition.order` —
 * nunca por el orden en que llegó el arreglo ni alfabéticamente (§4: "no
 * hardcodear AG → CI → SPyB... si ya existe el orden en los datos") — así que
 * es seguro pasarle `conditions` en cualquier orden.
 *
 * Función pura, sin acceso a RTK Query ni al router: `ConditionPage` decide
 * qué hacer con el resultado (armar los `Link` de navegación).
 */
export function getAdjacentConditions(
  conditions: readonly Condition[],
  currentConditionId: string,
): AdjacentConditions {
  const sorted = [...conditions].sort((a, b) => a.order - b.order)
  const currentIndex = sorted.findIndex((condition) => condition.id === currentConditionId)

  if (currentIndex === -1) {
    return { isKnownCondition: false }
  }

  // Los `!` son seguros: los límites (`currentIndex > 0` / `< length - 1`)
  // ya garantizan que la posición indexada existe (`noUncheckedIndexedAccess`
  // no puede inferir eso de la comparación numérica por sí solo).
  const previous = currentIndex > 0 ? sorted[currentIndex - 1]! : undefined
  const next = currentIndex < sorted.length - 1 ? sorted[currentIndex + 1]! : undefined

  return {
    isKnownCondition: true,
    ...(previous ? { previous } : {}),
    ...(next ? { next } : {}),
  }
}
