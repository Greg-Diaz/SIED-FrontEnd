import type { Criterion, Evaluation } from '@/types'
import { CriterionListItem } from './CriterionListItem'
import styles from './CriterionGroupSection.module.css'

interface CriterionGroupSectionProps {
  /** `undefined` cuando los criterios no pertenecen a ningún `CriterionGroup` (caso normal fuera de CI). */
  groupName?: string
  criteria: Criterion[]
  scenarioId: string
  evaluationsByCriterionId: ReadonlyMap<string, Evaluation>
}

/**
 * Agrupa visualmente los criterios que comparten un `CriterionGroup` del
 * Excel (p. ej. "2.1.1. Escenario de Práctica Clínicos"). Estos encabezados
 * NUNCA son criterios evaluables (docs/PROMPT.md §9, §40.1 regla 4).
 */
export function CriterionGroupSection({
  groupName,
  criteria,
  scenarioId,
  evaluationsByCriterionId,
}: CriterionGroupSectionProps) {
  return (
    <div className={styles.group}>
      {groupName && <h4 className={styles.groupTitle}>{groupName}</h4>}
      <ul className={styles.list}>
        {criteria.map((criterion) => (
          <CriterionListItem
            key={criterion.id}
            criterion={criterion}
            scenarioId={scenarioId}
            evaluation={evaluationsByCriterionId.get(criterion.id)}
          />
        ))}
      </ul>
    </div>
  )
}
