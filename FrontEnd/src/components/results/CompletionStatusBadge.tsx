import type { CompletionStatus } from '@/utils/getCompletionStatus'
import styles from './CompletionStatusBadge.module.css'

const COMPLETION_META: Record<CompletionStatus, { label: string; symbol: string }> = {
  COMPLETED: { label: 'Completada', symbol: '✓' },
  PENDING: { label: 'Pendiente', symbol: '◐' },
  NOT_EVALUABLE: { label: 'No evaluable', symbol: '—' },
}

interface CompletionStatusBadgeProps {
  completionStatus: CompletionStatus
}

/**
 * Insignia de COMPLETITUD (Fase 11 §3) — distinta de `ComplianceStatusBadge`
 * (que muestra EVALUATED/PARTIAL/NOT_EVALUABLE, cumplimiento). Esta responde
 * "¿qué le falta al usuario?", no "¿cuánto cumple?". Combina símbolo, texto y
 * color para no depender únicamente del color (Fase 11 §22).
 */
export function CompletionStatusBadge({ completionStatus }: CompletionStatusBadgeProps) {
  const meta = COMPLETION_META[completionStatus]
  return (
    <span className={styles.badge} data-completion={completionStatus}>
      <span className={styles.symbol} aria-hidden="true">
        {meta.symbol}
      </span>
      {meta.label}
    </span>
  )
}
