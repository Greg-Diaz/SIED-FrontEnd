import styles from './EvaluationComments.module.css'

interface EvaluationCommentsProps {
  id: string
  value: string
  onChange: (comments: string) => void
  disabled?: boolean
}

/** Comentarios de la evaluación — textarea controlado, sin validaciones de negocio (Fase 7, punto 4). */
export function EvaluationComments({ id, value, onChange, disabled = false }: EvaluationCommentsProps) {
  return (
    <div className={styles.wrapper}>
      <label className={styles.label} htmlFor={id}>
        Comentarios
      </label>
      <textarea
        id={id}
        className={styles.textarea}
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Observaciones sobre este criterio (opcional)…"
      />
    </div>
  )
}
