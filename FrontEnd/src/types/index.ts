/**
 * Barrel de tipos del dominio (Fase 3 — docs/PROMPT.md §5).
 * Todo lo exportado aquí es puramente estructural: ningún cálculo, mock data,
 * endpoint ni componente visual se implementa en esta fase.
 */
export type { ChartData, ChartDataPoint } from './chartData'
export type { ComplianceJudgement } from './complianceJudgement'
export type { ComplianceResult } from './complianceResult'
export type { Condition } from './condition'
export type { ConditionCode } from './conditionCode'
export type { Criterion } from './criterion'
export type { CriterionGroup } from './criterionGroup'
export type { DashboardCondition, DashboardSummary } from './dashboard'
export type { Evaluation } from './evaluation'
export type { EvaluationStatus } from './evaluationStatus'
export type { Objective } from './objective'
export type { ObjectiveResult, ObjectiveResultStatus } from './objectiveResult'
export type { Scenario } from './scenario'
export type { SubCondition } from './subCondition'
export type { InterviewRole, VerificationMechanism } from './verificationMechanism'
