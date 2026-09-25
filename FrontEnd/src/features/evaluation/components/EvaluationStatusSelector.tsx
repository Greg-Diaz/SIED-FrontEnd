import type { EvaluationStatus } from '@/types'
import styles from './EvaluationStatusSelector.module.css'

/**
 * Estados que el usuario puede seleccionar en el formulario. `PENDING` queda
 * deliberadamente excluido: es una extensión de la aplicación que representa
 * "todavía sin evaluar", no una cuarta opción de evaluación (docs/PROMPT.md
 * §10; Fase 7, punto 3).
 */
export type SelectableEvaluationStatus = Exclude<EvaluationStatus, 'PENDING'>

const OPTIONS: { value: SelectableEvaluationStatus; label: string; symbol: string }[] = [
  { value: 'C', label: 'Cumple', symbol: '✓' },
  { value: 'NC', label: 'No cumple', symbol: '✕' },
  { value: 'NA', label: 'No aplica', symbol: '—' },
]

interface EvaluationStatusSelectorProps {
  /** Identificador único del criterio — se usa para agrupar los 3 radios (`name`) y sus `id`. */
  name: string
  /** `null` cuando el criterio todavía no tiene una evaluación C/NC/NA guardada (estado PENDING). */
  value: SelectableEvaluationStatus | null
  onChange: (status: SelectableEvaluationStatus) => void
  disabled?: boolean
}

/**
 * Selector de estado C/NC/NA — grupo de radios nativos (navegación por
 * teclado y semántica de accesibilidad gratuitas). Cada opción combina texto,
 * un símbolo y color, para no depender únicamente del color (Fase 7, punto 9).
 */
export function EvaluationStatusSelector({
  name,
  value,
  onChange,
  disabled = false,
}: EvaluationStatusSelectorProps) {
  return (
    <fieldset className={styles.fieldset}>
      <div className={styles.legendRow}>
        <legend className={styles.legend}>Estado de evaluación</legend>
        {value === null && <span className={styles.pendingBadge}>Pendiente de evaluación</span>}
      </div>
      <div className={styles.options}>
        {OPTIONS.map((option) => {
          const isSelected = value === option.value
          const optionId = `${name}-${option.value}`
          return (
            <label
              key={option.value}
              htmlFor={optionId}
              data-status={option.value}
              className={[
                styles.option,
                isSelected ? styles.optionSelected : '',
                disabled ? styles.optionDisabled : '',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              <input
                id={optionId}
                className={styles.radio}
                type="radio"
                name={name}
                value={option.value}
                checked={isSelected}
                disabled={disabled}
                onChange={() => onChange(option.value)}
              />
              <span className={styles.symbol} aria-hidden="true">
                {option.symbol}
              </span>
              <span>{option.label}</span>
              <span className="sr-only">({option.value})</span>
            </label>
          )
        })}
      </div>
    </fieldset>
  )
}
