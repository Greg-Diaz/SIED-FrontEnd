import type { VerificationMechanism } from '@/types'
import styles from './VerificationMechanisms.module.css'

interface VerificationMechanismsProps {
  mechanisms: VerificationMechanism
}

/**
 * Muestra los mecanismos de verificación de un criterio (docs/PROMPT.md §1,
 * §11 — Fase 7, punto 5): documental, visita/inspección ocular y entrevista
 * con sus roles. Cada uno es independiente y opcional — nunca se inventa un
 * mecanismo que el criterio no tenga en los mocks, y si ninguno aplica no se
 * renderiza ninguna sección vacía. Extraído de `CriterionListItem` (antes
 * inline) para poder reutilizarse sin duplicar su representación.
 */
export function VerificationMechanisms({ mechanisms }: VerificationMechanismsProps) {
  const { documentary, onSiteVisit, interviewRoles } = mechanisms

  if (!documentary && !onSiteVisit && !(interviewRoles && interviewRoles.length > 0)) {
    return null
  }

  return (
    <div className={styles.mechanisms}>
      {documentary && (
        <div className={styles.mechanismRow}>
          <span className={styles.mechanismLabel}>Documental</span>
          <span className={styles.mechanismValue}>{documentary}</span>
        </div>
      )}
      {onSiteVisit && (
        <div className={styles.mechanismRow}>
          <span className={styles.mechanismLabel}>Visita ocular</span>
          <span className={styles.mechanismValue}>{onSiteVisit}</span>
        </div>
      )}
      {interviewRoles && interviewRoles.length > 0 && (
        <div className={styles.mechanismRow}>
          <span className={styles.mechanismLabel}>Entrevista</span>
          <span className={styles.roles}>
            {interviewRoles.map((role) => (
              <span key={role} className={styles.roleBadge}>
                {role}
              </span>
            ))}
          </span>
        </div>
      )}
    </div>
  )
}
