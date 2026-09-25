import { EvaluationForm } from '@/features/evaluation/components/EvaluationForm'
import type { Criterion, Evaluation } from '@/types'
import { VerificationMechanisms } from './VerificationMechanisms'
import styles from './CriterionListItem.module.css'

interface CriterionListItemProps {
  criterion: Criterion
  scenarioId: string
  /** `undefined` solo si, de forma anómala, no existiera evaluación para este criterio en el escenario. */
  evaluation: Evaluation | undefined
}

/**
 * Un criterio evaluable completo (Fase 7): datos del `Criterion` (qué se
 * evalúa) + `EvaluationForm` (qué respondió el usuario, desde `Evaluation`).
 * Ambas fuentes se mantienen conceptualmente separadas — este componente solo
 * las compone visualmente, no las mezcla en un mismo estado.
 */
export function CriterionListItem({ criterion, scenarioId, evaluation }: CriterionListItemProps) {
  return (
    <li className={styles.item}>
      <span className={styles.order} aria-hidden="true">
        {criterion.order}
      </span>
      <div className={styles.body}>
        <p className={styles.title}>{criterion.title}</p>
        <VerificationMechanisms mechanisms={criterion.verificationMechanisms} />
        <div className={styles.evaluationSection}>
          <EvaluationForm scenarioId={scenarioId} criterion={criterion} evaluation={evaluation} />
        </div>
      </div>
    </li>
  )
}
