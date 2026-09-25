/**
 * Tests de `buildChartData` (Fase 10) contra los DATOS REALES de
 * `src/mocks/` — mismo patrón que `buildScenarioSummary.test.ts` (Fase 9):
 * construye el `ScenarioSummary` real vía `buildScenarioSummary()` y verifica
 * que `buildChartData()` solo reformatea ese resultado, sin recalcular nada.
 */
import { describe, expect, it } from 'vitest'

import conditionsJson from '@/mocks/conditions.json'
import criteriaJson from '@/mocks/criteria.json'
import evaluationsJson from '@/mocks/evaluations.json'
import objectivesJson from '@/mocks/objectives.json'
import scenariosJson from '@/mocks/scenarios.json'
import subConditionsJson from '@/mocks/subConditions.json'
import type {
  Condition,
  Criterion,
  Evaluation,
  Objective,
  Scenario,
  SubCondition,
} from '@/types'
import { buildScenarioSummary } from './buildScenarioSummary'
import { buildChartData } from './buildChartData'

const scenarios = scenariosJson as Scenario[]
const conditions = conditionsJson as Condition[]
const subConditions = subConditionsJson as SubCondition[]
const criteria = criteriaJson as Criterion[]
const evaluations = evaluationsJson as Evaluation[]
const objectives = objectivesJson as Objective[]

function chartDataFor(scenarioId: string) {
  const scenario = scenarios.find((s) => s.id === scenarioId)
  if (!scenario) throw new Error(`Escenario de prueba "${scenarioId}" no encontrado en los mocks.`)

  const summary = buildScenarioSummary({
    scenario,
    conditions,
    subConditions,
    criteria,
    evaluations: evaluations.filter((e) => e.scenarioId === scenarioId),
    objectives,
  })

  return { summary, chartData: buildChartData(summary) }
}

describe('buildChartData — scenario-hospital-central', () => {
  const { summary, chartData } = chartDataFor('scenario-hospital-central')

  it('complianceByCondition: transforma las 7 condiciones, en el mismo orden que conditionResults', () => {
    expect(chartData.complianceByCondition).toHaveLength(7)
    expect(chartData.complianceByCondition.map((p) => p.label)).toEqual([
      'AG',
      'CI',
      'SPyB',
      'OADS',
      'PD',
      'PF',
      'CMC',
    ])
  })

  it('complianceByCondition: convierte compliancePercentage (fracción 0-1) a porcentaje (0-100) SOLO para presentación', () => {
    const ag = chartData.complianceByCondition.find((p) => p.label === 'AG')
    const agResult = summary.conditionResults.find((r) => r.condition.id === 'AG')

    expect(agResult?.objectiveResult.compliancePercentage).toBeCloseTo(6 / 7, 10)
    // El valor del dominio (fracción) nunca se modifica — buildChartData solo
    // produce un número NUEVO para la gráfica.
    expect(agResult?.objectiveResult.compliancePercentage).toBeLessThan(1)
    expect(ag?.value).toBeCloseTo((6 / 7) * 100, 10)
    expect(ag?.isNotEvaluable).toBe(false)
  })

  it('distribution: C/NC/NA/PENDING coinciden con los conteos agregados de globalResult', () => {
    const { compliantCount, nonCompliantCount, notApplicableCount, pendingCount } = summary.globalResult
    expect(chartData.distribution).toEqual([
      { label: 'C', value: compliantCount },
      { label: 'NC', value: nonCompliantCount },
      { label: 'NA', value: notApplicableCount },
      { label: 'PENDING', value: pendingCount },
    ])
    // Suma total = 43 criterios del escenario.
    const total = chartData.distribution.reduce((sum, p) => sum + (p.value ?? 0), 0)
    expect(total).toBe(43)
  })

  it('progress: es exactamente globalProgress (completed = evaluatedCount, pending = pendingCount), nunca compliancePercentage', () => {
    expect(chartData.progress).toBe(summary.globalProgress)
    expect(chartData.progress.progressPercentage).not.toBe(summary.globalResult.compliancePercentage)
    expect(chartData.progress.evaluatedCount + chartData.progress.pendingCount).toBe(
      chartData.progress.totalCriteria,
    )
  })
})

describe('buildChartData — scenario-centro-comunitario (NOT_EVALUABLE)', () => {
  const { summary, chartData } = chartDataFor('scenario-centro-comunitario')

  it('CI y CMC quedan con value=null e isNotEvaluable=true (nunca 0%)', () => {
    const ci = chartData.complianceByCondition.find((p) => p.label === 'CI')
    const cmc = chartData.complianceByCondition.find((p) => p.label === 'CMC')

    expect(ci?.value).toBeNull()
    expect(ci?.isNotEvaluable).toBe(true)
    expect(cmc?.value).toBeNull()
    expect(cmc?.isNotEvaluable).toBe(true)

    // Ninguna condición evaluable se confunde con NOT_EVALUABLE.
    const ag = chartData.complianceByCondition.find((p) => p.label === 'AG')
    expect(ag?.isNotEvaluable).toBe(false)
    expect(ag?.value).not.toBeNull()
  })

  it('distribution: los conteos NO se ponen en null ni en 0 pese al global NOT_EVALUABLE', () => {
    const total = chartData.distribution.reduce((sum, p) => sum + (p.value ?? 0), 0)
    expect(total).toBe(43)
    expect(chartData.distribution.every((p) => p.value !== null)).toBe(true)
  })

  it('progress: sigue siendo un número normal (>0) aunque el cumplimiento global sea NOT_EVALUABLE', () => {
    expect(summary.globalResult.status).toBe('NOT_EVALUABLE')
    expect(summary.globalResult.compliancePercentage).toBeNull()
    expect(chartData.progress.progressPercentage).toBeGreaterThan(0)
    expect(Number.isFinite(chartData.progress.progressPercentage)).toBe(true)
  })
})
