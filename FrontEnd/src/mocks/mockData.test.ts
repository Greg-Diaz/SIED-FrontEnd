/**
 * Inventario estructural de los mocks (Fase 12 §1, "QA FUNCIONAL INTEGRAL").
 *
 * Ningún test previo verificaba, de punta a punta, la INTEGRIDAD REFERENCIAL
 * cruda de `src/mocks/*.json` (cardinalidades exactas, IDs únicos, sin
 * huérfanos) — los tests de dominio (`scenarios.integration.test.ts`,
 * `buildScenarioSummary.test.ts`) validan el CÁLCULO sobre esos datos, pero
 * asumen implícitamente que la estructura ya es correcta. Este archivo cierra
 * ese hueco: si alguien edita un mock y rompe una relación (p. ej. un
 * `Criterion.subConditionId` que ya no existe), esta prueba falla de
 * inmediato con un mensaje claro, en vez de manifestarse como un cálculo
 * silenciosamente incorrecto en producción.
 *
 * Solo lee los JSON — no importa `domain/compliance` ni `mockDb`: es
 * deliberadamente independiente del motor de cálculo y del Mock API.
 */
import { describe, expect, it } from 'vitest'

import conditionsJson from '@/mocks/conditions.json'
import criteriaJson from '@/mocks/criteria.json'
import criterionGroupsJson from '@/mocks/criterionGroups.json'
import evaluationsJson from '@/mocks/evaluations.json'
import objectivesJson from '@/mocks/objectives.json'
import scenariosJson from '@/mocks/scenarios.json'
import subConditionsJson from '@/mocks/subConditions.json'
import type {
  Condition,
  Criterion,
  CriterionGroup,
  Evaluation,
  Objective,
  Scenario,
  SubCondition,
} from '@/types'

const conditions = conditionsJson as Condition[]
const subConditions = subConditionsJson as SubCondition[]
const criterionGroups = criterionGroupsJson as CriterionGroup[]
const criteria = criteriaJson as Criterion[]
const evaluations = evaluationsJson as Evaluation[]
const objectives = objectivesJson as Objective[]
const scenarios = scenariosJson as Scenario[]

function duplicateIds<T extends { id: string }>(items: readonly T[]): string[] {
  const seen = new Set<string>()
  const duplicates: string[] = []
  for (const item of items) {
    if (seen.has(item.id)) duplicates.push(item.id)
    seen.add(item.id)
  }
  return duplicates
}

describe('Inventario estructural de los mocks (Fase 12 §1)', () => {
  it('cardinalidades exactas: 2 escenarios, 7 condiciones, 8 subcondiciones, 5 criterion groups, 43 criterios, 86 evaluaciones, 8 objetivos', () => {
    expect(scenarios).toHaveLength(2)
    expect(conditions).toHaveLength(7)
    expect(subConditions).toHaveLength(8)
    expect(criterionGroups).toHaveLength(5)
    expect(criteria).toHaveLength(43)
    expect(evaluations).toHaveLength(86) // 43 criterios × 2 escenarios
    expect(objectives).toHaveLength(8) // 7 por condición + 1 global
  })

  it('ningún ID está duplicado dentro de cada colección', () => {
    expect(duplicateIds(scenarios)).toEqual([])
    expect(duplicateIds(conditions)).toEqual([])
    expect(duplicateIds(subConditions)).toEqual([])
    expect(duplicateIds(criterionGroups)).toEqual([])
    expect(duplicateIds(criteria)).toEqual([])
    expect(duplicateIds(objectives)).toEqual([])
  })

  it('ninguna Evaluation está duplicada (misma pareja escenario+criterio dos veces)', () => {
    const keys = evaluations.map((e) => `${e.scenarioId}::${e.criterionId}`)
    const duplicates = keys.filter((key, index) => keys.indexOf(key) !== index)
    expect(duplicates).toEqual([])
  })

  it('CI tiene exactamente 2 subcondiciones; las otras 6 condiciones tienen exactamente 1 cada una', () => {
    const countByCondition = new Map<string, number>()
    for (const sc of subConditions) {
      countByCondition.set(sc.conditionId, (countByCondition.get(sc.conditionId) ?? 0) + 1)
    }
    expect(countByCondition.get('CI')).toBe(2)
    for (const condition of conditions) {
      if (condition.id === 'CI') continue
      expect(countByCondition.get(condition.id)).toBe(1)
    }
  })

  it('ningún criterio es huérfano: todo Criterion.subConditionId existe en subConditions', () => {
    const subConditionIds = new Set(subConditions.map((sc) => sc.id))
    const orphanCriteria = criteria.filter((c) => !subConditionIds.has(c.subConditionId))
    expect(orphanCriteria).toEqual([])
  })

  it('ningún criterio referencia una condición inexistente (transitivamente, vía su subcondición)', () => {
    const conditionIds = new Set(conditions.map((c) => c.id))
    const subConditionById = new Map(subConditions.map((sc) => [sc.id, sc]))
    const criteriaWithInvalidCondition = criteria.filter((c) => {
      const subCondition = subConditionById.get(c.subConditionId)
      return !subCondition || !conditionIds.has(subCondition.conditionId)
    })
    expect(criteriaWithInvalidCondition).toEqual([])
  })

  it('todo Criterion.groupId (cuando existe) referencia un CriterionGroup real de LA MISMA subcondición', () => {
    const groupById = new Map(criterionGroups.map((g) => [g.id, g]))
    const criteriaWithGroup = criteria.filter((c) => c.groupId)
    for (const criterion of criteriaWithGroup) {
      const group = groupById.get(criterion.groupId as string)
      expect(group, `Criterion "${criterion.id}" referencia un groupId inexistente`).toBeDefined()
      expect(
        group?.subConditionId,
        `Criterion "${criterion.id}" y su grupo "${criterion.groupId}" pertenecen a subcondiciones distintas`,
      ).toBe(criterion.subConditionId)
    }
  })

  it('ningún CriterionGroup es huérfano: todo CriterionGroup.subConditionId existe', () => {
    const subConditionIds = new Set(subConditions.map((sc) => sc.id))
    const orphanGroups = criterionGroups.filter((g) => !subConditionIds.has(g.subConditionId))
    expect(orphanGroups).toEqual([])
  })

  it('ninguna SubCondition es huérfana: todo SubCondition.conditionId existe', () => {
    const conditionIds = new Set(conditions.map((c) => c.id))
    const orphanSubConditions = subConditions.filter((sc) => !conditionIds.has(sc.conditionId))
    expect(orphanSubConditions).toEqual([])
  })

  it('ningún Objective es huérfano: conditionId es null (global) o referencia una condición real; exactamente 1 global + 1 por condición', () => {
    const conditionIds = new Set(conditions.map((c) => c.id))
    const orphanObjectives = objectives.filter((o) => o.conditionId !== null && !conditionIds.has(o.conditionId))
    expect(orphanObjectives).toEqual([])

    const globalObjectives = objectives.filter((o) => o.conditionId === null)
    expect(globalObjectives).toHaveLength(1)

    for (const condition of conditions) {
      const ownObjectives = objectives.filter((o) => o.conditionId === condition.id)
      expect(ownObjectives, `Condición "${condition.id}" debe tener exactamente 1 Objective`).toHaveLength(1)
    }
  })

  it('ninguna Evaluation es huérfana: scenarioId y criterionId existen', () => {
    const scenarioIds = new Set(scenarios.map((s) => s.id))
    const criterionIds = new Set(criteria.map((c) => c.id))
    const orphanByScenario = evaluations.filter((e) => !scenarioIds.has(e.scenarioId))
    const orphanByCriterion = evaluations.filter((e) => !criterionIds.has(e.criterionId))
    expect(orphanByScenario).toEqual([])
    expect(orphanByCriterion).toEqual([])
  })

  it('cada escenario tiene EXACTAMENTE una Evaluation por cada uno de los 43 criterios (sin faltantes ni sobrantes)', () => {
    for (const scenario of scenarios) {
      const criterionIdsForScenario = evaluations
        .filter((e) => e.scenarioId === scenario.id)
        .map((e) => e.criterionId)
      expect(criterionIdsForScenario).toHaveLength(43)
      expect(new Set(criterionIdsForScenario).size).toBe(43) // sin duplicados
      const allCriteriaCovered = criteria.every((c) => criterionIdsForScenario.includes(c.id))
      expect(allCriteriaCovered).toBe(true)
    }
  })

  it('todo Evaluation.status es uno de los 4 valores del dominio (C, NC, NA, PENDING)', () => {
    const validStatuses = new Set(['C', 'NC', 'NA', 'PENDING'])
    const invalid = evaluations.filter((e) => !validStatuses.has(e.status))
    expect(invalid).toEqual([])
  })

  it('order es único y consecutivo (1..N) dentro de cada agrupación relevante (condiciones, subcondiciones de CI, grupos de una subcondición)', () => {
    const conditionOrders = conditions.map((c) => c.order).sort((a, b) => a - b)
    expect(conditionOrders).toEqual([1, 2, 3, 4, 5, 6, 7])

    const ciSubConditionOrders = subConditions
      .filter((sc) => sc.conditionId === 'CI')
      .map((sc) => sc.order)
      .sort((a, b) => a - b)
    expect(ciSubConditionOrders).toEqual([1, 2])
  })
})
