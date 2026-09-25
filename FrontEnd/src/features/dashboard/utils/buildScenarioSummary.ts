import {
  calculateCompliance,
  calculateConditionSummary,
  calculateGlobalSummary,
  calculateObjectiveResult,
  calculateProgress,
} from '@/domain/compliance'
import type {
  Condition,
  Criterion,
  Evaluation,
  Objective,
  Scenario,
  SubCondition,
} from '@/types'
import type { ConditionResultEntry, ScenarioSummary, SubConditionResultEntry } from '../types'

/**
 * Capa "features" (Fase 9, docs/PROMPT.md — arquitectura
 * services/api → features → domain/compliance → UI): recibe datos YA
 * OBTENIDOS por RTK Query (nunca hace fetch ni conoce mockDb) y los combina
 * con las funciones puras del dominio para producir un modelo listo para
 * presentación. Ninguna fórmula de cumplimiento vive aquí — solo se hace el
 * "join" relacional (qué criterios pertenecen a qué subcondición/condición)
 * y se delega el cálculo real a `src/domain/compliance/`.
 *
 * Función pura: no muta ninguno de sus argumentos.
 */
export interface BuildScenarioSummaryInput {
  scenario: Scenario
  conditions: readonly Condition[]
  subConditions: readonly SubCondition[]
  criteria: readonly Criterion[]
  evaluations: readonly Evaluation[]
  objectives: readonly Objective[]
}

function buildSubConditionResult(
  subCondition: SubCondition,
  criteriaBySubConditionId: ReadonlyMap<string, Criterion[]>,
  evaluationsByCriterionId: ReadonlyMap<string, Evaluation>,
): SubConditionResultEntry {
  const criteria = criteriaBySubConditionId.get(subCondition.id) ?? []
  const evaluations = criteria
    .map((criterion) => evaluationsByCriterionId.get(criterion.id))
    .filter((evaluation): evaluation is Evaluation => evaluation !== undefined)

  return { subCondition, result: calculateCompliance(evaluations) }
}

function buildConditionResult(
  condition: Condition,
  subConditions: readonly SubCondition[],
  criteriaBySubConditionId: ReadonlyMap<string, Criterion[]>,
  evaluationsByCriterionId: ReadonlyMap<string, Evaluation>,
  objective: Objective,
): ConditionResultEntry {
  const ownSubConditions = subConditions
    .filter((sc) => sc.conditionId === condition.id)
    .slice()
    .sort((a, b) => a.order - b.order)

  const subConditionResults = ownSubConditions.map((sc) =>
    buildSubConditionResult(sc, criteriaBySubConditionId, evaluationsByCriterionId),
  )

  // CI (2 subcondiciones) y las 6 condiciones de 1 sola subcondición
  // comparten el MISMO algoritmo de agregación (docs/PROMPT.md §14, §17,
  // domain/compliance/aggregateComplianceResults.ts) — ninguna rama especial
  // para CI aquí tampoco.
  const conditionComplianceResult = calculateConditionSummary(
    subConditionResults.map((entry) => entry.result),
  )

  // El progreso NO se promedia por subcondición (eso sería mezclar conceptos
  // distintos, docs/PROMPT.md Fase 9): se calcula de forma plana sobre TODOS
  // los criterios de la condición combinados.
  const conditionCriteria = ownSubConditions.flatMap(
    (sc) => criteriaBySubConditionId.get(sc.id) ?? [],
  )
  const conditionEvaluations = conditionCriteria
    .map((criterion) => evaluationsByCriterionId.get(criterion.id))
    .filter((evaluation): evaluation is Evaluation => evaluation !== undefined)
  const progress = calculateProgress(conditionEvaluations)

  return {
    condition,
    objective,
    objectiveResult: calculateObjectiveResult(objective, conditionComplianceResult),
    progress,
    subConditionResults,
  }
}

export function buildScenarioSummary({
  scenario,
  conditions,
  subConditions,
  criteria,
  evaluations,
  objectives,
}: BuildScenarioSummaryInput): ScenarioSummary {
  const evaluationsByCriterionId = new Map(evaluations.map((e) => [e.criterionId, e]))

  const criteriaBySubConditionId = new Map<string, Criterion[]>()
  for (const criterion of criteria) {
    const existing = criteriaBySubConditionId.get(criterion.subConditionId)
    if (existing) {
      existing.push(criterion)
    } else {
      criteriaBySubConditionId.set(criterion.subConditionId, [criterion])
    }
  }

  const conditionResults = conditions
    .slice()
    .sort((a, b) => a.order - b.order)
    .map((condition) => {
      const objective = objectives.find((o) => o.conditionId === condition.id)
      if (!objective) {
        throw new Error(
          `No existe un Objective definido para la condición "${condition.id}" — revisar mocks/objectives.json.`,
        )
      }
      return buildConditionResult(
        condition,
        subConditions,
        criteriaBySubConditionId,
        evaluationsByCriterionId,
        objective,
      )
    })

  // Global = mismo algoritmo de agregación aplicado a las 7 condiciones
  // (ObjectiveResult extiende ComplianceResult, así que se reutiliza tal cual).
  const globalComplianceResult = calculateGlobalSummary(
    conditionResults.map((entry) => entry.objectiveResult),
  )
  // Progreso global: plano sobre las 43 evaluaciones del escenario, sin promediar por condición.
  const globalProgress = calculateProgress(evaluations)

  const globalObjective = objectives.find((o) => o.conditionId === null)
  if (!globalObjective) {
    throw new Error('No existe un Objective global (conditionId: null) — revisar mocks/objectives.json.')
  }

  return {
    scenario,
    conditionResults,
    globalObjective,
    globalResult: calculateObjectiveResult(globalObjective, globalComplianceResult),
    globalProgress,
  }
}
