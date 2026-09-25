import type { ReactNode } from 'react'
import { Provider } from 'react-redux'

import { store } from '@/app/store'

interface AppProvidersProps {
  children: ReactNode
}

/**
 * Punto único de composición de providers globales (Redux por ahora).
 * Futuras fases pueden agregar aquí, por ejemplo, un ThemeProvider.
 */
export function AppProviders({ children }: AppProvidersProps) {
  return <Provider store={store}>{children}</Provider>
}
