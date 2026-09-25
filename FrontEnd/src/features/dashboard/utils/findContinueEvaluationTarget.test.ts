import { describe, expect, it } from 'vitest'

import conditionsJson from '@/mocks/conditions.json'
import criteriaJson from '@/mocks/criteria.json'
import evaluationsJson from '@/mocks/evaluations.json'
import objectivesJson from '@/mocks/objectives.json'
import scenariosJson from '@/mocks/scenarios.json'
import subConditionsJson from '@/mocks/subConditions.json'
import type {
  Condition,
  ConditionCode,
  Criterion,
  Evaluation,
  Objective,
  Scenario,
  SubCondition,
} from '@/types'
import { buildScenarioSummary } from './buildScenarioSummary'
import { findContinueEvaluationTarget } from './findContinueEvaluationTarget'
import type { ConditionResultEntry } from '../types'

const scenarios = scenariosJson as Scenario[]
const conditions = conditionsJson as Condition[]
const subConditions = subConditionsJson as SubCondition[]
const criteria = criteriaJson as Criterion[]
const evaluations = evaluationsJson as Evaluation[]
const objectives = objectivesJson as Objective[]

function conditionResultsFor(scenarioId: string): ConditionResultEntry[] {
  const scenario = scenarios.find((s) => s.id === scenarioId)
  if (!scenario) throw new Error(`Escenario de prueba "${scenarioId}" no encontrado en los mocks.`)

  return buildScenarioSummary({
    scenario,
    conditions,
    subConditions,
    criteria,
    evaluations: evaluations.filter((e) => e.scenarioId === scenarioId),
    objectives,
  }).conditionResults
}

/** Fixture sintética mínima — solo `condition.order` y `progress.pendingCount` importan a la función bajo prueba. */
function makeEntry(conditionId: ConditionCode, order: number, pendingCount: number): ConditionResultEntry {
  return {
    condition: { id: conditionId, name: conditionId, order },
    objective: { id: `obj-${conditionId}`, conditionId, title: '', description: '' },
    objectiveResult: {
      totalCriteria: 1,
      effectiveCriteria: 1,
      compliantCount: 1,
      nonCompliantCount: 0,
      notApplicableCount: 0,
      pendingCount,
      compliancePercentage: 1,
      status: pendingCount > 0 ? 'PARTIAL' : 'EVALUATED',
      objectiveId: `obj-${conditionId}`,
      value: 5,
      judgement: null,
    },
    progress: {
      totalCriteria: 1,
      evaluatedCount: pendingCount > 0 ? 0 : 1,
      pendingCount,
      progressPercentage: pendingCount > 0 ? 0 : 1,
    },
    subConditionResults: [],
  }
}

describe('findContinueEvaluationTarget — datos reales', () => {
  it('scenario-hospital-central: PD (order 5) es la primera condición con criterios PENDING', () => {
    const target = findContinueEvaluationTarget(conditionResultsFor('scenario-hospital-central'))
    expect(target).toEqual({ type: 'condition', conditionId: 'PD' })
  })

  it('scenario-centro-comunitario: AG (order 1) es la primera condición con criterios PENDING', () => {
    const target = findContinueEvaluationTarget(conditionResultsFor('scenario-centro-comunitario'))
    expect(target).toEqual({ type: 'condition', conditionId: 'AG' })
  })
})

describe('findContinueEvaluationTarget — casos sintéticos', () => {
  it('ninguna condición con PENDING → destino "summary" ("Ver consolidado")', () => {
    const entries = [makeEntry('AG', 1, 0), makeEntry('CI', 2, 0), makeEntry('CMC', 7, 0)]
    expect(findContinueEvaluationTarget(entries)).toEqual({ type: 'summary' })
  })

  it('respeta Condition.order, no el orden del arreglo de entrada', () => {
    // CMC (order 7) aparece primero en el arreglo pero PD (order 5) debe ganar.
    const entries = [makeEntry('CMC', 7, 1), makeEntry('PD', 5, 1), makeEntry('AG', 1, 0)]
    expect(findContinueEvaluationTarget(entries)).toEqual({ type: 'condition', conditionId: 'PD' })
  })

  it('una condición NOT_EVALUABLE con un criterio PENDING sigue apareciendo como destino (§3: no confundir PENDIENTE con NO EVALUABLE)', () => {
    const notEvaluableButPending: ConditionResultEntry = {
      ...makeEntry('CMC', 7, 1),
      objectiveResult: {
        ...makeEntry('CMC', 7, 1).objectiveResult,
        status: 'NOT_EVALUABLE',
        compliancePercentage: null,
        value: null,
      },
    }
    const target = findContinueEvaluationTarget([notEvaluableButPending])
    expect(target).toEqual({ type: 'condition', conditionId: 'CMC' })
  })
})
