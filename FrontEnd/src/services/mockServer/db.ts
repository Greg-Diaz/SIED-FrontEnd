import conditionsJson from '@/mocks/conditions.json'
import criteriaJson from '@/mocks/criteria.json'
import criterionGroupsJson from '@/mocks/criterionGroups.json'
import evaluationsJson from '@/mocks/evaluations.json'
import objectivesJson from '@/mocks/objectives.json'
import scenariosJson from '@/mocks/scenarios.json'
import subConditionsJson from '@/mocks/subConditions.json'
import { cloneMockValue } from './clone'
import type {
  Condition,
  Criterion,
  CriterionGroup,
  Evaluation,
  Objective,
  Scenario,
  SubCondition,
} from '@/types'

/**
 * Store de desarrollo en memoria del Mock API (docs/PROMPT.md §8, Fase 5).
 *
 * Los 7 archivos de `src/mocks/*.json` (validados en la Fase 4) se cargan UNA
 * SOLA VEZ al iniciar la aplicación y se clonan profundamente hacia este
 * objeto mutable. Ningún endpoint debe mutar los módulos JSON importados
 * directamente — siempre a través de `mockDb`.
 *
 * IMPORTANTE: las mutaciones (p. ej. `evaluationsApi.updateEvaluation`) SOLO
 * modifican esta copia en memoria del proceso del navegador. Nunca escriben en
 * los archivos `.json` en disco (JavaScript no tiene forma de hacerlo desde el
 * navegador) y se pierden al recargar la página — es un comportamiento de
 * "servidor de desarrollo sin persistencia", equivalente a una base de datos
 * en memoria, hasta que exista un backend real.
 */
export const mockDb = {
  scenarios: cloneMockValue(scenariosJson) as Scenario[],
  conditions: cloneMockValue(conditionsJson) as Condition[],
  subConditions: cloneMockValue(subConditionsJson) as SubCondition[],
  criterionGroups: cloneMockValue(criterionGroupsJson) as CriterionGroup[],
  criteria: cloneMockValue(criteriaJson) as Criterion[],
  evaluations: cloneMockValue(evaluationsJson) as Evaluation[],
  objectives: cloneMockValue(objectivesJson) as Objective[],
}
