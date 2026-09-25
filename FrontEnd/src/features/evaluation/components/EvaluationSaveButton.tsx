import styles from './EvaluationSaveButton.module.css'

interface EvaluationSaveButtonProps {
  isSaving: boolean
  disabled: boolean
  justSaved: boolean
  onClick: () => void
}

/**
 * Botón de guardado con su propio feedback (Fase 7, punto 8; copy exacto y
 * `aria-live` — Fase 11 §8, §22): se deshabilita mientras guarda (evita
 * envíos duplicados, §9) y muestra una confirmación discreta y temporal tras
 * un guardado exitoso, sin bloquear al usuario.
 *
 * El estado se anuncia por DOS vías separadas a propósito:
 * - `.confirmation` (visible, condicional) — el "✓ Evaluación guardada" que
 *   ya existía, solo para usuarios videntes.
 * - Un `<span class="sr-only" role="status" aria-live="polite">` SIEMPRE
 *   presente en el DOM (nunca se monta/desmonta) — algunos lectores de
 *   pantalla no anuncian el contenido de una región `aria-live` que recién
 *   aparece, solo los cambios de texto dentro de una que ya estaba ahí. Va
 *   aparte del span visible para no duplicar "Guardando…" en pantalla (el
 *   propio botón ya lo muestra).
 */
export function EvaluationSaveButton({
  isSaving,
  disabled,
  justSaved,
  onClick,
}: EvaluationSaveButtonProps) {
  return (
    <div className={styles.row}>
      <button
        type="button"
        className={styles.button}
        disabled={disabled || isSaving}
        aria-busy={isSaving}
        onClick={onClick}
      >
        {isSaving && <span className={styles.spinner} aria-hidden="true" />}
        {isSaving ? 'Guardando…' : 'Guardar evaluación'}
      </button>
      {justSaved && !isSaving && <span className={styles.confirmation}>✓ Evaluación guardada</span>}
      <span className="sr-only" role="status" aria-live="polite">
        {isSaving ? 'Guardando evaluación' : justSaved ? 'Evaluación guardada' : ''}
      </span>
    </div>
  )
}
