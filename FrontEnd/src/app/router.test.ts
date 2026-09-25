/**
 * Validación de rutas (Fase 12 §9). `router.tsx` llama a `createBrowserRouter`,
 * que requiere `window`/`document` (historial del navegador) y por lo tanto
 * NO puede importarse en el entorno de test actual (`environment: 'node'`,
 * sin jsdom — ver `vite.config.ts` y el resto de fases: deliberadamente no se
 * agregó jsdom/Testing Library, ver `useScenarioSummary.integration.test.ts`).
 * Intentar `import { router } from './router'` aquí falla con
 * `ReferenceError: document is not defined` (confirmado manualmente).
 *
 * En su lugar, esta prueba valida la DECLARACIÓN de rutas leyendo el código
 * fuente como texto — una verificación más débil que montar el router real,
 * pero suficiente para detectar el error más probable de esta fase (una ruta
 * borrada, mal escrita o duplicada por accidente) sin agregar una
 * dependencia de testing de componentes solo para esto.
 */
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

const routerSource = readFileSync(fileURLToPath(new URL('./router.tsx', import.meta.url)), 'utf-8')

const EXPECTED_PATHS = [
  '/',
  'dashboard',
  'table-of-contents',
  'conditions/:conditionId',
  'conditions/:conditionId/criteria',
  'summary',
  '*',
]

describe('router — declaración de rutas (Fase 12 §9)', () => {
  it('declara exactamente las rutas requeridas por el encargo, sin duplicados', () => {
    const pathMatches = [...routerSource.matchAll(/path:\s*'([^']*)'/g)].map((m) => m[1])
    expect(pathMatches).toEqual(EXPECTED_PATHS)
  })

  it('la ruta índice ("/") redirige a /dashboard', () => {
    expect(routerSource).toMatch(/index:\s*true,\s*element:\s*<Navigate to="\/dashboard" replace \/>/)
  })

  it('todas las páginas están envueltas por AppLayout (un único elemento raíz)', () => {
    const rootElementMatches = [...routerSource.matchAll(/element:\s*<AppLayout/g)]
    expect(rootElementMatches).toHaveLength(1)
  })

  it('la ruta comodín ("*") usa NotFoundPage', () => {
    expect(routerSource).toMatch(/path:\s*'\*',\s*element:\s*<NotFoundPage \/>/)
  })
})
