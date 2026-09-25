/**
 * Verificación manual explícita de los casos A-D del encargo de Fase 8 (§32),
 * de punta a punta: calculateCompliance + calculateProgress + getComplianceValue
 * + getComplianceJudgement juntos, tal como se combinarían para un
 * `ObjectiveResult` real.
 */
import { describe, expect, it } from 'vitest'

import { calculateCompliance } from './calculateCompliance'
import { calculateProgress } from './calculateProgress'
import { makeEvaluations } from './complianceTestHelpers'
import { getComplianceJudgement } from './getComplianceJudgement'
import { getComplianceValue } from './getComplianceValue'

describe('Casos de verificación manual (Fase 8 §32)', () => {
  it('Caso A: 8C/2NC/0NA/0PENDING → Compliance 80%, Value 4.00, Judgement B, Progress 100%', () => {
    const evaluations = makeEvaluations(['C', 'C', 'C', 'C', 'C', 'C', 'C', 'C', 'NC', 'NC'])
    const compliance = calculateCompliance(evaluations)
    const progress = calculateProgress(evaluations)

    expect(compliance.compliancePercentage).toBeCloseTo(0.8, 10)
    expect(getComplianceValue(compliance.compliancePercentage)).toBeCloseTo(4.0, 10)
    expect(getComplianceJudgement(compliance.compliancePercentage)?.code).toBe('B')
    expect(progress.progressPercentage).toBe(1)
  })

  it('Caso B: 6C/2NC/2NA → Compliance 75%, Value 3.75, Judgement C, Progress 100%', () => {
    const evaluations = makeEvaluations(['C', 'C', 'C', 'C', 'C', 'C', 'NC', 'NC', 'NA', 'NA'])
    const compliance = calculateCompliance(evaluations)
    const progress = calculateProgress(evaluations)

    expect(compliance.compliancePercentage).toBeCloseTo(0.75, 10)
    expect(getComplianceValue(compliance.compliancePercentage)).toBeCloseTo(3.75, 10)
    expect(getComplianceJudgement(compliance.compliancePercentage)?.code).toBe('C')
    expect(progress.progressPercentage).toBe(1)
  })

  it('Caso C: 5C/2NC/1NA/2PENDING → Compliance ≈71.43%, Value ≈3.57, Judgement C, Progress 80%, status PARTIAL', () => {
    const evaluations = makeEvaluations(['C', 'C', 'C', 'C', 'C', 'NC', 'NC', 'NA', 'PENDING', 'PENDING'])
    const compliance = calculateCompliance(evaluations)
    const progress = calculateProgress(evaluations)

    expect(compliance.compliancePercentage).toBeCloseTo(5 / 7, 10)
    expect(getComplianceValue(compliance.compliancePercentage)).toBeCloseTo((5 / 7) * 5, 10)
    expect(getComplianceJudgement(compliance.compliancePercentage)?.code).toBe('C')
    expect(progress.progressPercentage).toBeCloseTo(0.8, 10)
    expect(compliance.status).toBe('PARTIAL')
  })

  it('Caso D: 0C/0NC/10NA → Compliance/Value/Judgement null, status NOT_EVALUABLE, Progress 100%', () => {
    const evaluations = makeEvaluations(Array.from({ length: 10 }, () => 'NA' as const))
    const compliance = calculateCompliance(evaluations)
    const progress = calculateProgress(evaluations)

    expect(compliance.compliancePercentage).toBeNull()
    expect(getComplianceValue(compliance.compliancePercentage)).toBeNull()
    expect(getComplianceJudgement(compliance.compliancePercentage)).toBeNull()
    expect(compliance.status).toBe('NOT_EVALUABLE')
    expect(progress.progressPercentage).toBe(1)
  })

  it('Caso E (Fase 12 §5): 3C/1NC/1NA/1PENDING de 6 → progress = 5/6 ≈83.33%, compliance = 3/4 = 75% — dos números DISTINTOS, ninguno sustituye al otro', () => {
    const evaluations = makeEvaluations(['C', 'C', 'C', 'NC', 'NA', 'PENDING'])
    const compliance = calculateCompliance(evaluations)
    const progress = calculateProgress(evaluations)

    expect(compliance.effectiveCriteria).toBe(4) // C+NC = 3+1, NA y PENDING quedan fuera
    expect(compliance.compliancePercentage).toBeCloseTo(0.75, 10)
    expect(compliance.status).toBe('PARTIAL') // pendingCount > 0 y sí hay criterios efectivos

    expect(progress.evaluatedCount).toBe(5) // C+NC+NA = 3+1+1
    expect(progress.pendingCount).toBe(1)
    expect(progress.progressPercentage).toBeCloseTo(5 / 6, 10)

    // La aserción central de esta fase: progreso y cumplimiento NUNCA deben
    // confundirse ni sustituirse entre sí en ningún componente de la UI.
    expect(progress.progressPercentage).not.toBeCloseTo(compliance.compliancePercentage ?? -1, 2)
  })
})
