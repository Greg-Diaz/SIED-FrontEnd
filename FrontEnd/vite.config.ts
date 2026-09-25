import { fileURLToPath, URL } from 'node:url'

import react from '@vitejs/plugin-react'
// `defineConfig` de `vitest/config` reexporta el de Vite con el campo `test`
// tipado — permite mantener un único archivo de configuración (Fase 8).
import { defineConfig } from 'vitest/config'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    // Solo funciones puras de dominio por ahora — sin componentes React que
    // requieran DOM, así que no se agrega jsdom/happy-dom (evita
    // dependencias innecesarias, docs/PROMPT.md §3, Fase 8 §34).
    environment: 'node',
    include: ['src/**/*.{test,spec}.ts'],
  },
})
