/**
 * Código de cada una de las 7 condiciones del modelo (docs/PROMPT.md §9, §40.1 regla 1).
 *
 * Se modela como unión de literales (en vez de `string`) a propósito: así el compilador
 * impide construir una octava condición o escribir un código inexistente en cualquier
 * lugar del dominio (mocks, componentes, cálculos futuros).
 *
 * - AG    Aspectos Generales
 * - CI    Capacidad Instalada (única condición con 2 subcomponentes: 2.1 y 2.2)
 * - SPyB  Seguridad, Protección y Bienestar
 * - OADS  Organización Administrativa para la Docencia Servicio
 * - PD    Personal Docente
 * - PF    Prácticas Formativas
 * - CMC   Cultura del Mejoramiento Continuo
 */
export type ConditionCode = 'AG' | 'CI' | 'SPyB' | 'OADS' | 'PD' | 'PF' | 'CMC'
