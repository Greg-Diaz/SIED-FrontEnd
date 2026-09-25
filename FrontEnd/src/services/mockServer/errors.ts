/**
 * Error controlado del Mock API (PROMPT.md §8, §33).
 * Cualquier handler de un endpoint puede lanzar `MockApiError` para simular
 * una respuesta de error HTTP realista (404, 501, etc.); `mockBaseQuery` la
 * traduce a la forma `{ error: { status, data } }` que RTK Query espera.
 */
export class MockApiError extends Error {
  readonly status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = 'MockApiError'
    this.status = status
  }
}
