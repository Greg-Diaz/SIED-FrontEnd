/**
 * Escenario de práctica formativa evaluado.
 *
 * En el Excel, estos datos viven en un único bloque de texto libre
 * (`Tabla de contenido!A4`). Aquí se representan como campos estructurados
 * independientes — decisión explícita del usuario (docs/PROMPT.md §9, §40.1 regla 16),
 * NO una conversión literal del Excel.
 */
export interface Scenario {
  id: string
  practiceName: string
  municipality: string
  servicesToProvide: string
  preparedBy: string
}
