import type { ObjectiveResultStatus } from '@/types'
import styles from './ComplianceStatusBadge.module.css'

const STATUS_META: Record<ObjectiveResultStatus, { label: string; symbol: string }> = {
  EVALUATED: { label: 'Evaluado', symbol: '✓' },
  PARTIAL: { label: 'Parcial', symbol: '◐' },
  NOT_EVALUABLE: { label: 'No evaluable', symbol: '—' },
}

interface ComplianceStatusBadgeProps {
  status: ObjectiveResultStatus
}

/**
 * Insignia de estado (`EVALUATED`/`PARTIAL`/`NOT_EVALUABLE`) — combina color,
 * símbolo y texto para no depender únicamente del color (Fase 9,
 * "INDICADORES VISUALES").
 */
export function ComplianceStatusBadge({ status }: ComplianceStatusBadgeProps) {
  const meta = STATUS_META[status]
  return (
    <span className={styles.badge} data-status={status}>
      <span className={styles.symbol} aria-hidden="true">
        {meta.symbol}
      </span>
      {meta.label}
    </span>
  )
}
