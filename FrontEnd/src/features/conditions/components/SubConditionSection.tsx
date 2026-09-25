import { EmptyState } from '@/components/feedback/EmptyState'
import { ErrorState } from '@/components/feedback/ErrorState'
import { LoadingState } from '@/components/feedback/LoadingState'
import {
  useGetCriteriaBySubConditionQuery,
  useGetCriterionGroupsBySubConditionQuery,
} from '@/services/api'
import type { Criterion, CriterionGroup, Evaluation, SubCondition } from '@/types'
import { CriterionGroupSection } from './CriterionGroupSection'
import styles from './SubConditionSection.module.css'

interface SubConditionSectionProps {
  subCondition: SubCondition
  scenarioId: string
  evaluationsByCriterionId: ReadonlyMap<string, Evaluation>
}

/**
 * Renderiza una subcondición completa: sus `CriterionGroup` (cuando existen,
 * solo en 2.1 y 2.2 de Capacidad Instalada) y los criterios de cada uno, cada
 * uno evaluable (Fase 7). Las evaluaciones llegan ya resueltas desde
 * `ConditionPage` (una sola consulta por escenario) — esta sección solo
 * obtiene la ESTRUCTURA (`Criterion`/`CriterionGroup`) propia de su
 * subcondición vía RTK Query, igual que en la Fase 6.
 */
export function SubConditionSection({
  subCondition,
  scenarioId,
  evaluationsByCriterionId,
}: SubConditionSectionProps) {
  const criteriaQuery = useGetCriteriaBySubConditionQuery(subCondition.id)
  const groupsQuery = useGetCriterionGroupsBySubConditionQuery(subCondition.id)

  const isLoading = criteriaQuery.isLoading || groupsQuery.isLoading
  const error = criteriaQuery.error ?? groupsQuery.error

  return (
    <section className={styles.section} aria-labelledby={`subcondition-${subCondition.id}`}>
      <div className={styles.heading}>
        <span className={styles.code}>{subCondition.code}</span>
        <h3 id={`subcondition-${subCondition.id}`} className={styles.title}>
          {subCondition.name}
        </h3>
      </div>

      {isLoading && <LoadingState label="Cargando criterios…" />}
      {!isLoading && error && <ErrorState error={error} title="No se pudieron cargar los criterios" />}
      {!isLoading && !error && criteriaQuery.data && (
        <SubConditionCriteria
          criteria={criteriaQuery.data}
          groups={groupsQuery.data ?? []}
          scenarioId={scenarioId}
          evaluationsByCriterionId={evaluationsByCriterionId}
        />
      )}
    </section>
  )
}

function SubConditionCriteria({
  criteria,
  groups,
  scenarioId,
  evaluationsByCriterionId,
}: {
  criteria: Criterion[]
  groups: CriterionGroup[]
  scenarioId: string
  evaluationsByCriterionId: ReadonlyMap<string, Evaluation>
}) {
  if (criteria.length === 0) {
    return <EmptyState message="Esta subcondición todavía no tiene criterios definidos." />
  }

  const sortedGroups = [...groups].sort((a, b) => a.order - b.order)
  const ungroupedCriteria = criteria
    .filter((c) => !c.groupId)
    .sort((a, b) => a.order - b.order)

  return (
    <div className={styles.groups}>
      {ungroupedCriteria.length > 0 && (
        <CriterionGroupSection
          criteria={ungroupedCriteria}
          scenarioId={scenarioId}
          evaluationsByCriterionId={evaluationsByCriterionId}
        />
      )}
      {sortedGroups.map((group) => {
        const groupCriteria = criteria
          .filter((c) => c.groupId === group.id)
          .sort((a, b) => a.order - b.order)
        if (groupCriteria.length === 0) return null
        return (
          <CriterionGroupSection
            key={group.id}
            groupName={group.name}
            criteria={groupCriteria}
            scenarioId={scenarioId}
            evaluationsByCriterionId={evaluationsByCriterionId}
          />
        )
      })}
    </div>
  )
}
