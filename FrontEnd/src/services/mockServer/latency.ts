/**
 * Latencia artificial del Mock API (PROMPT.md §8): permite que la UI (en fases
 * posteriores) pueda ejercitar y verificar sus estados `loading` en vez de que
 * toda respuesta se resuelva de forma instantánea.
 */
const MIN_DELAY_MS = 300
const MAX_DELAY_MS = 700

export function simulateNetworkDelay(): Promise<void> {
  const delayMs = MIN_DELAY_MS + Math.random() * (MAX_DELAY_MS - MIN_DELAY_MS)
  return new Promise((resolve) => setTimeout(resolve, delayMs))
}
