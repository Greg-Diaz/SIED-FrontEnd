import { describe, expect, it } from 'vitest'

import type { Condition } from '@/types'
import { getAdjacentConditions } from './getAdjacentConditions'

// Deliberadamente en un orden distinto del `order` real y NO alfabético
// (CMC antes que AG) — demuestra que la función ordena por `Condition.order`,
// nunca por la posición en el arreglo ni por código (Fase 11 §4).
const CONDITIONS: Condition[] = [
  { id: 'CMC', name: 'Cultura del Mejoramiento Continuo', order: 7 },
  { id: 'AG', name: 'Aspectos Generales', order: 1 },
  { id: 'PF', name: 'Prácticas Formativas', order: 6 },
  { id: 'CI', name: 'Capacidad Instalada', order: 2 },
  { id: 'SPyB', name: 'Seguridad, Protección y Bienestar', order: 3 },
  { id: 'OADS', name: 'Organización Administrativa para la Docencia Servicio', order: 4 },
  { id: 'PD', name: 'Personal Docente', order: 5 },
]

describe('getAdjacentConditions', () => {
  it('la primera condición (AG, order 1) no tiene anterior, y su siguiente es CI (order 2)', () => {
    const result = getAdjacentConditions(CONDITIONS, 'AG')
    expect(result.isKnownCondition).toBe(true)
    expect(result.previous).toBeUndefined()
    expect(result.next?.id).toBe('CI')
  })

  it('la última condición (CMC, order 7) no tiene siguiente, y su anterior es PF (order 6)', () => {
    const result = getAdjacentConditions(CONDITIONS, 'CMC')
    expect(result.isKnownCondition).toBe(true)
    expect(result.previous?.id).toBe('PF')
    expect(result.next).toBeUndefined()
  })

  it('una condición intermedia (SPyB, order 3) tiene anterior CI y siguiente OADS', () => {
    const result = getAdjacentConditions(CONDITIONS, 'SPyB')
    expect(result.previous?.id).toBe('CI')
    expect(result.next?.id).toBe('OADS')
  })

  it('respeta Condition.order y no el orden alfabético ni el del arreglo de entrada', () => {
    // Si usara orden alfabético, el anterior de CI ("C") sería "AG" igual
    // (coincide por casualidad); se prueba con PD (order 5), cuyo anterior
    // alfabético sería "OADS" pero cuyo anterior por `order` es OADS también
    // — se usa PF (order 6) en su lugar, donde alfabético ("PD") difiere del
    // real por order (PD, order 5).
    const result = getAdjacentConditions(CONDITIONS, 'PF')
    expect(result.previous?.id).toBe('PD')
    expect(result.next?.id).toBe('CMC')
  })

  it('conditionId desconocido: isKnownCondition = false, sin previous/next', () => {
    const result = getAdjacentConditions(CONDITIONS, 'NO-EXISTE')
    expect(result.isKnownCondition).toBe(false)
    expect(result.previous).toBeUndefined()
    expect(result.next).toBeUndefined()
  })
})
