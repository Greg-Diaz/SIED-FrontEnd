import { Link } from 'react-router-dom'

import styles from './StatePanel.module.css'

interface NotFoundStateProps {
  resourceLabel: string
  backTo: string
  backLabel: string
  message?: string
}

/**
 * Estado "no encontrado" reutilizable — usado tanto por la ruta comodín
 * (página inexistente) como por recursos de dominio inválidos (p. ej. un
 * `conditionId` en la URL que no corresponde a ninguna de las 7 condiciones).
 */
export function NotFoundState({ resourceLabel, backTo, backLabel, message }: NotFoundStateProps) {
  return (
    <div className={styles.wrapper} data-variant="not-found">
      <span className={styles.icon} aria-hidden="true">
        🔍
      </span>
      <p className={styles.title}>No encontramos {resourceLabel} solicitada</p>
      <p className={styles.message}>
        {message ?? 'Verifica el enlace o vuelve a un punto conocido de la aplicación.'}
      </p>
      <div className={styles.actions}>
        <Link className={styles.link} to={backTo}>
          ← {backLabel}
        </Link>
      </div>
    </div>
  )
}
