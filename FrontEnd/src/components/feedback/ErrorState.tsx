import { getApiErrorMessage } from '@/utils/getApiErrorMessage'
import styles from './StatePanel.module.css'

interface ErrorStateProps {
  error?: unknown
  title?: string
  /**
   * Mensaje fijo que reemplaza el derivado de `error` (Fase 11 §8, "GUARDADO":
   * el mensaje de error debe ser útil pero NUNCA exponer detalles internos —
   * `getApiErrorMessage` a veces refleja el texto interno del Mock API, p. ej.
   * "No existe una evaluación para actualizar en escenario…"). Cuando se pasa
   * `message`, tampoco se agrega el código de estado HTTP.
   */
  message?: string
}

/**
 * Estado de error reutilizable para respuestas de RTK Query distintas de 404
 * (docs/PROMPT.md §23). Para "no encontrado" usar `NotFoundState`.
 */
export function ErrorState({ error, title = 'No se pudo cargar la información', message }: ErrorStateProps) {
  const info = getApiErrorMessage(error)
  const displayMessage = message ?? info.message

  return (
    <div className={styles.wrapper} data-variant="error" role="alert">
      <span className={styles.icon} aria-hidden="true">
        ⚠️
      </span>
      <p className={styles.title}>{title}</p>
      <p className={styles.message}>
        {displayMessage}
        {!message && info.status ? ` (código ${info.status})` : ''}
      </p>
    </div>
  )
}
