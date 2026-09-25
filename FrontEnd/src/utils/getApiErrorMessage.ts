/**
 * Traduce el `error` de un hook de RTK Query (forma `MockQueryError`, ver
 * services/api/mockBaseQuery.ts) a un mensaje legible. Es una utilidad de
 * presentación pura — no interpreta reglas de negocio ni calcula nada.
 */
export interface ApiErrorInfo {
  status?: number
  message: string
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

export function getApiErrorMessage(error: unknown): ApiErrorInfo {
  if (isRecord(error) && typeof error.status === 'number') {
    const data = isRecord(error.data) ? error.data : undefined
    const message = typeof data?.message === 'string' ? data.message : undefined
    return { status: error.status, message: message ?? 'Ocurrió un error al consultar la información.' }
  }
  return { message: 'Ocurrió un error inesperado al consultar la información.' }
}
