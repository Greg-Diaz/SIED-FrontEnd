import styles from './StatePanel.module.css'

interface EmptyStateProps {
  title?: string
  message: string
}

/** Estado "sin datos" reutilizable — la petición fue exitosa pero la lista vino vacía. */
export function EmptyState({ title = 'Sin información disponible', message }: EmptyStateProps) {
  return (
    <div className={styles.wrapper} data-variant="empty">
      <span className={styles.icon} aria-hidden="true">
        🗂️
      </span>
      <p className={styles.title}>{title}</p>
      <p className={styles.message}>{message}</p>
    </div>
  )
}
