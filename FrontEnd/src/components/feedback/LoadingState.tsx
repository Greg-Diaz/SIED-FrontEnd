import styles from './LoadingState.module.css'

interface LoadingStateProps {
  label?: string
}

/** Estado de carga reutilizable (docs/PROMPT.md §23, Fase 6 punto 7). */
export function LoadingState({ label = 'Cargando información…' }: LoadingStateProps) {
  return (
    <div className={styles.wrapper} role="status" aria-live="polite">
      <span className={styles.spinner} aria-hidden="true" />
      <span>{label}</span>
    </div>
  )
}
