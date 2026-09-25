/**
 * Matriz de transiciones de estado (Fase 12 §3). Verifica, para cada
 * transición exigida, el efecto exacto sobre `ComplianceResult` (conteos,
 * `effectiveCriteria`, `compliancePercentage`, `status`), `ProgressResult` y
 * `ObjectiveResult` (`value`/`judgement`).
 *
 * `calculateCompliance()`/`calculateProgress()` son funciones puras SIN
 * memoria de "transición": una transición X→Y se modela como dos snapshots
 * independientes (el conjunto de evaluaciones ANTES, con el criterio en X, y
 * el mismo conjunto DESPUÉS, con ese único criterio en Y) — es exactamente
 * equivalente a "guardar un cambio de estado" en la aplicación real, sin
 * necesitar el Mock API ni latencia artificial para cada uno de los 9 casos
 * (el flujo real de guardado YA se verifica de punta a punta en
 * `features/dashboard/utils/evaluationFlow.integration.test.ts`, Fase 11).
 *
 * Fixture fija de 4 criterios en cada snapshot: 1 C + 1 NC + 1 NA (siempre
 * iguales) + el criterio bajo prueba (`from` → `to`) — así cada transición es
 * fácil de verificar a mano y `effectiveCriteria` nunca cae a 0 (los casos
 * NOT_EVALUABLE se cubren aparte en `calculateCompliance.test.ts` §6).
 */
import { describe, expect, it } from 'vitest'

import type { EvaluationStatus, Objective } from '@/types'
import { calculateCompliance } from './calculateCompliance'
import { calculateObjectiveResult } from './calculateObjectiveResult'
import { calculateProgress } from './calculateProgress'
import { makeEvaluations } from './complianceTestHelpers'

const objective: Objective = {
  id: 'objective-test',
  conditionId: 'AG',
  title: 'Objetivo de prueba',
  description: '',
}

function snapshot(targetStatus: EvaluationStatus) {
  const evaluations = makeEvaluations(['C', 'NC', 'NA', targetStatus])
  const compliance = calculateCompliance(evaluations)
  const progress = calculateProgress(evaluations)
  const objectiveResult = calculateObjectiveResult(objective, compliance)
  return { compliance, progress, objectiveResult }
}

interface TransitionCase {
  from: EvaluationStatus
  to: EvaluationStatus
  before: { effectiveCriteria: number; compliance: number | null; status: string; progressPct: number }
  after: { effectiveCriteria: number; compliance: number | null; status: string; progressPct: number }
}

// Fixture fija: C=1, NC=1, NA=1 + el criterio bajo prueba.
const CASES: TransitionCase[] = [
  {
    from: 'PENDING',
    to: 'C',
    before: { effectiveCriteria: 2, compliance: 1 / 2, status: 'PARTIAL', progressPct: 3 / 4 },
    after: { effectiveCriteria: 3, compliance: 2 / 3, status: 'EVALUATED', progressPct: 1 },
  },
  {
    from: 'PENDING',
    to: 'NC',
    before: { effectiveCriteria: 2, compliance: 1 / 2, status: 'PARTIAL', progressPct: 3 / 4 },
    after: { effectiveCriteria: 3, compliance: 1 / 3, status: 'EVALUATED', progressPct: 1 },
  },
  {
    from: 'PENDING',
    to: 'NA',
    before: { effectiveCriteria: 2, compliance: 1 / 2, status: 'PARTIAL', progressPct: 3 / 4 },
    after: { effectiveCriteria: 2, compliance: 1 / 2, status: 'EVALUATED', progressPct: 1 },
  },
  {
    from: 'C',
    to: 'NC',
    before: { effectiveCriteria: 3, compliance: 2 / 3, status: 'EVALUATED', progressPct: 1 },
    after: { effectiveCriteria: 3, compliance: 1 / 3, status: 'EVALUATED', progressPct: 1 },
  },
  {
    from: 'C',
    to: 'NA',
    before: { effectiveCriteria: 3, compliance: 2 / 3, status: 'EVALUATED', progressPct: 1 },
    after: { effectiveCriteria: 2, compliance: 1 / 2, status: 'EVALUATED', progressPct: 1 },
  },
  {
    from: 'NC',
    to: 'C',
    before: { effectiveCriteria: 3, compliance: 1 / 3, status: 'EVALUATED', progressPct: 1 },
    after: { effectiveCriteria: 3, compliance: 2 / 3, status: 'EVALUATED', progressPct: 1 },
  },
  {
    from: 'NC',
    to: 'NA',
    before: { effectiveCriteria: 3, compliance: 1 / 3, status: 'EVALUATED', progressPct: 1 },
    after: { effectiveCriteria: 2, compliance: 1 / 2, status: 'EVALUATED', progressPct: 1 },
  },
  {
    from: 'NA',
    to: 'C',
    before: { effectiveCriteria: 2, compliance: 1 / 2, status: 'EVALUATED', progressPct: 1 },
    after: { effectiveCriteria: 3, compliance: 2 / 3, status: 'EVALUATED', progressPct: 1 },
  },
  {
    from: 'NA',
    to: 'NC',
    before: { effectiveCriteria: 2, compliance: 1 / 2, status: 'EVALUATED', progressPct: 1 },
    after: { effectiveCriteria: 3, compliance: 1 / 3, status: 'EVALUATED', progressPct: 1 },
  },
]

describe('Matriz de transiciones de estado (Fase 12 §3)', () => {
  it.each(CASES)('$from → $to', ({ from, to, before, after }) => {
    const beforeSnapshot = snapshot(from)
    expect(beforeSnapshot.compliance.effectiveCriteria).toBe(before.effectiveCriteria)
    if (before.compliance === null) {
      expect(beforeSnapshot.compliance.compliancePercentage).toBeNull()
    } else {
      expect(beforeSnapshot.compliance.compliancePercentage).toBeCloseTo(before.compliance, 10)
    }
    expect(beforeSnapshot.compliance.status).toBe(before.status)
    expect(beforeSnapshot.progress.progressPercentage).toBeCloseTo(before.progressPct, 10)

    const afterSnapshot = snapshot(to)
    expect(afterSnapshot.compliance.effectiveCriteria).toBe(after.effectiveCriteria)
    expect(afterSnapshot.compliance.compliancePercentage).toBeCloseTo(after.compliance as number, 10)
    expect(afterSnapshot.compliance.status).toBe(after.status)
    expect(afterSnapshot.progress.progressPercentage).toBeCloseTo(after.progressPct, 10)

    // value/judgement (ObjectiveResult) reflejan el NUEVO porcentaje, nunca el anterior.
    expect(afterSnapshot.objectiveResult.value).toBeCloseTo((after.compliance as number) * 5, 10)
    expect(afterSnapshot.objectiveResult.judgement).not.toBeNull()

    // pendingCount: 1 antes de cualquier transición que parte de PENDING, 0 en cualquier otro caso.
    expect(beforeSnapshot.compliance.pendingCount).toBe(from === 'PENDING' ? 1 : 0)
    expect(afterSnapshot.compliance.pendingCount).toBe(to === 'PENDING' ? 1 : 0)
  })

  it('los conteos C/NC/NA se mueven exactamente 1 unidad entre "from" y "to", sin afectar a los otros 3 criterios fijos', () => {
    for (const { from, to } of CASES) {
      const before = snapshot(from).compliance
      const after = snapshot(to).compliance

      const countOf = (status: EvaluationStatus, result: typeof before) =>
        ({ C: result.compliantCount, NC: result.nonCompliantCount, NA: result.notApplicableCount, PENDING: result.pendingCount })[
          status
        ]

      if (from !== to) {
        expect(countOf(from, after)).toBe(countOf(from, before) - 1)
        expect(countOf(to, after)).toBe(countOf(to, before) + 1)
      }
      expect(before.totalCriteria).toBe(4)
      expect(after.totalCriteria).toBe(4)
    }
  })
})
