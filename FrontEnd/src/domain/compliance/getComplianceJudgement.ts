import type { ComplianceJudgement } from '@/types'

/**
 * Escala de juicio A-E, confirmada en el Excel (`Consolidado!B138:F143`).
 * `min`/`max` se expresan como enteros 0-100 (igual que el ejemplo original
 * ya aprobado en docs/PROMPT.md §15) — son solo la descripción textual de la
 * banda; la comparación real ocurre en `getComplianceJudgement()` usando la
 * fracción decimal de cada límite (`min / 100`), nunca el entero directamente.
 */
const JUDGEMENT_SCALE: readonly ComplianceJudgement[] = [
  { code: 'A', label: 'Se Cumple Plenamente', min: 90, max: 100 },
  { code: 'B', label: 'Se Cumple en Alto Grado', min: 80, max: 89 },
  { code: 'C', label: 'Se Cumple Aceptablemente', min: 70, max: 79 },
  { code: 'D', label: 'Se Cumple Insatisfactoriamente', min: 30, max: 69 },
  { code: 'E', label: 'No Se Cumple', min: 0, max: 29 },
]

/**
 * Juicio A-E a partir del porcentaje de cumplimiento (docs/PROMPT.md §15,
 * Fase 8 §9).
 *
 * `percentage` es la fracción decimal (0 a 1) de
 * `ComplianceResult.compliancePercentage` — se compara TAL CUAL contra cada
 * límite (`entry.min / 100`), sin redondear antes de decidir. Esto evita que
 * un valor como `0.8996` ("89.96%") se lea erróneamente como `90%` y se
 * asigne el juicio A en vez de B: `0.8996 >= 0.90` es `false`, por lo que
 * cae correctamente en B.
 *
 * `null` (caso `NOT_EVALUABLE`) se propaga como `null` — nunca se fuerza un
 * juicio A-E cuando no hay nada que evaluar.
 */
export function getComplianceJudgement(percentage: number | null): ComplianceJudgement | null {
  if (percentage === null) return null

  for (const entry of JUDGEMENT_SCALE) {
    if (percentage >= entry.min / 100) {
      return entry
    }
  }

  // Inalcanzable: el último tramo (`min: 0`) siempre coincide para cualquier
  // `percentage >= 0`. Se conserva como red de seguridad explícita en vez de
  // dejar un `return` implícito de `undefined`.
  return JUDGEMENT_SCALE[JUDGEMENT_SCALE.length - 1] ?? null
}
