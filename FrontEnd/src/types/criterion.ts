import type { VerificationMechanism } from './verificationMechanism'

/**
 * Criterio evaluable individual (docs/PROMPT.md §5, §9, §40.1 regla 2).
 *
 * Deben existir exactamente 43 instancias de `Criterion` en el dominio completo
 * (8 AG + 4 CI-2.1 + 9 CI-2.2 + 6 SPyB + 6 OADS + 4 PD + 4 PF + 2 CMC).
 *
 * `groupId` es opcional: `null`/`undefined` cuando el criterio no pertenece a
 * ningún `CriterionGroup` (la mayoría de los casos); solo se usa dentro de las
 * subcondiciones 2.1 y 2.2 de Capacidad Instalada.
 */
export interface Criterion {
  id: string
  subConditionId: string
  groupId?: string | null
  order: number
  title: string
  verificationMechanisms: VerificationMechanism
}
