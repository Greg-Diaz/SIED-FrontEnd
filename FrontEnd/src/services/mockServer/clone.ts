/**
 * Clona profundamente valores 100% serializables como JSON (nuestros mocks lo son).
 *
 * Se usa en dos lugares:
 *   1. Al cargar `src/mocks/*.json` en `mockDb` (./db.ts), para desacoplar el
 *      store en memoria de los módulos JSON importados.
 *   2. En CADA handler de los `*Api.ts` que lee de `mockDb`, para que el valor
 *      devuelto a RTK Query sea una copia independiente y nunca la referencia
 *      mutable que vive dentro de `mockDb`.
 *
 * El segundo uso no es opcional: Redux Toolkit congela (`Object.freeze`, vía
 * Immer `autoFreeze`, activo por defecto en desarrollo con `configureStore`)
 * cualquier valor que termine en el cache de RTK Query. Si un handler
 * devolviera la referencia original de `mockDb`, esa congelación recaería
 * sobre el propio registro del store y una mutación posterior (p. ej.
 * `updateEvaluation`) fallaría con "Cannot assign to read only property".
 */
export function cloneMockValue<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T
}
