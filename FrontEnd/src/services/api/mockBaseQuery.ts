import type { BaseQueryFn } from '@reduxjs/toolkit/query/react'

import { MockApiError } from '@/services/mockServer/errors'
import { simulateNetworkDelay } from '@/services/mockServer/latency'

/**
 * Payload de error del Mock API, con la misma forma `{ success, message }`
 * que PROMPT.md §30 define para las respuestas reales de la futura API REST.
 */
export interface MockErrorPayload {
  success: false
  message: string
}

export interface MockQueryError {
  status: number
  data: MockErrorPayload
}

/**
 * Cada endpoint del Mock API define su lógica como un `MockHandler`: una
 * función sin argumentos que lee (y, en el caso de mutaciones, escribe) el
 * store en memoria de `services/mockServer/db.ts` y retorna el resultado, o
 * lanza `MockApiError` para simular un error HTTP controlado.
 */
export type MockHandler<T> = () => Promise<T> | T

/**
 * mockBaseQuery — reemplaza temporalmente a `fetchBaseQuery` (docs/PROMPT.md §7, §8)
 * mientras no existe un backend real. Es la ÚNICA pieza de esta capa que sabe
 * simular latencia de red y traducir errores; no contiene ninguna regla de
 * negocio del dominio (eso vive, cuando exista, en `domain/compliance/`).
 *
 * Responsabilidades, en orden:
 *   1. Esperar una latencia artificial (`simulateNetworkDelay`) — permite que
 *      la UI (fases posteriores) ejercite sus estados `loading`.
 *   2. Ejecutar el `MockHandler` del endpoint.
 *   3. Envolver el resultado como `{ data }`, o como `{ error }` con la misma
 *      forma `{ status, data }` que produce `fetchBaseQuery`, si el handler
 *      lanzó un `MockApiError` (o cualquier otro error inesperado).
 *
 * REEMPLAZO FUTURO POR BACKEND REAL: cambiar, en `baseApi.ts`, la línea
 * `baseQuery: mockBaseQuery` por
 *   `baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_API_BASE_URL ?? '/api' })`
 * y hacer que cada `query()` de los *Api.ts devuelva una URL/config de fetch
 * en vez de un `MockHandler`. ningún componente consumidor cambia.
 */
export const mockBaseQuery: BaseQueryFn<MockHandler<unknown>, unknown, MockQueryError> = async (
  handler,
) => {
  await simulateNetworkDelay()

  try {
    const data = await handler()
    return { data }
  } catch (error) {
    if (error instanceof MockApiError) {
      return {
        error: {
          status: error.status,
          data: { success: false, message: error.message },
        },
      }
    }

    const message = error instanceof Error ? error.message : 'Error inesperado del Mock API.'
    return { error: { status: 500, data: { success: false, message } } }
  }
}
