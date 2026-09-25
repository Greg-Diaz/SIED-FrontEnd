import { useEffect } from 'react'
import { useBlocker } from 'react-router-dom'

/**
 * Confirmación antes de navegar con cambios sin guardar (Fase 11 §10). Cubre
 * las dos formas de "perder" una edición en curso en una SPA:
 *
 * - Navegación DENTRO de la app (otro `Link`/`NavLink`, atrás del navegador)
 *   → `useBlocker` (React Router, requiere el Data Router que ya usa esta
 *   app vía `createBrowserRouter`): intercepta la navegación y deja que
 *   quien llama decida (`blocker.state === 'blocked'`) si confirma o cancela.
 * - Recargar/cerrar la pestaña → `beforeunload` nativo del navegador, que
 *   `useBlocker` NO cubre (documentado explícitamente por React Router).
 *
 * Solo bloquea cuando `hasUnsavedChanges` es `true` Y la navegación cambia de
 * ruta (§10: "no bloquear innecesariamente cuando no existen cambios").
 */
export function useUnsavedChangesGuard(hasUnsavedChanges: boolean) {
  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      hasUnsavedChanges && currentLocation.pathname !== nextLocation.pathname,
  )

  useEffect(() => {
    if (!hasUnsavedChanges) return

    function handleBeforeUnload(event: BeforeUnloadEvent) {
      event.preventDefault()
      // Requerido por algunos navegadores (p. ej. Chrome) para mostrar el diálogo nativo.
      event.returnValue = ''
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [hasUnsavedChanges])

  return blocker
}
