# Análisis Funcional

**Archivo:** `docs/Autoevaluacion escenarios práctica_Nuevo modelo (2) (1).xlsx`
**Autor original (metadato del archivo):** Elizabeth Ruiz Castaño
**Creado:** 2020-01-07
**Tipo:** Libro de Excel (.xlsx), sin contraseña ni protección de hojas/libro
**Herramientas usadas para el análisis:** Python 3.12 + `openpyxl` (lectura de celdas, fórmulas, validaciones de datos y formato condicional)

---

## 1. Propósito del instrumento

El archivo es un **instrumento de autoevaluación** para calificar el cumplimiento de las condiciones de calidad exigidas a un **escenario de práctica formativa** (institución prestadora de servicios de salud – IPS, o escenario no clínico) en el marco de una **relación docencia-servicio** con instituciones de educación superior (IES). Corresponde al modelo normativo colombiano (Decreto 780 de 2016, Resolución 2003 de 2014/REPS, Resolución 1052 de 2020, Ley 1917 de 2018, lineamientos de la CITHS).

El usuario diligencia, para cada criterio, un **Estado** (`C` = Cumple, `NC` = No Cumple, `NA` = No Aplica) y comentarios; el libro calcula automáticamente **porcentajes de cumplimiento**, una **valoración numérica (escala 0-5)** y un **juicio cualitativo** (de "No Se Cumple" a "Se Cumple Plenamente"), tanto por condición como de forma consolidada para todo el escenario.

---

## 2. Estructura general del libro

10 hojas, todas visibles, sin protección:

| # | Hoja | Función | Filas usadas (aprox.) |
|---|------|---------|------------------------|
| 1 | `Tabla de contenido` | Portada + índice de navegación + datos generales del escenario | 1-15 |
| 2 | `Consolidado` | Tablero de resultados: agrega el conteo de cada hoja de criterios y calcula el resultado final | 1-143 |
| 3 | `1. AG` | Criterios – **1. Aspectos Generales** | 1-19 |
| 4 | `2.1. CI` | Criterios – **2. Capacidad Instalada** (subcomponente "Análisis de la capacidad instalada") | 1-14 |
| 5 | `2.2. IyME` | Criterios – **2. Capacidad Instalada** (subcomponente "Infraestructura y Medios Educativos") | 1-21 |
| 6 | `3, SPyB` | Criterios – **3. Seguridad, Protección y Bienestar** | 1-14 |
| 7 | `4. OADS` | Criterios – **4. Organización Administrativa de la Docencia Servicio** | 1-14 |
| 8 | `5. PDOCENTE` | Criterios – **5. Personal Docente** | 1-12 |
| 9 | `6. PF` | Criterios – **6. Prácticas Formativas** | 1-12 |
| 10 | `7.CMC` | Criterios – **7. Cultura del Mejoramiento Continuo** | 1-10 |

Las 8 hojas de condiciones (3 a 10) comparten un mismo patrón funcional (ver sección 4). La hoja `Consolidado` no recibe entrada manual: todas sus celdas de resultado son fórmulas que leen de las 8 hojas de criterios.

---

## 3. Hoja `Tabla de contenido`

- **B1**: Título del instrumento ("AUTOEVALUACIÓN PARA LOS ESCENARIOS DE PRÁCTICA FORMATIVA...").
- **A4**: Campos de encabezado en texto libre para diligenciar a mano dentro de una sola celda (no son celdas independientes): Escenario de práctica, Municipio, Servicios a prestar, Elaborado por.
- **A7:C15**: Tabla índice con las 7 condiciones normativas (una de ellas, "Capacidad Instalada", se divide en dos sub-hojas → 8 enlaces en total). La columna **B** contiene **hipervínculos internos** (`location`, sin URL externa) que llevan a la celda `A1` de cada hoja de criterios. La columna **C** referencia el rango de páginas del documento normativo impreso del que se derivó el modelo (dato estático, no calculado).
- Cada hoja de criterios tiene en su celda `B1` el enlace inverso **"VOLVER A TABLA DE CONTENIDO"**, que apunta a `'Tabla de contenido'!A1`. Esto forma una navegación bidireccional simple tipo "menú".

---

## 4. Patrón funcional de las hojas de criterios (AG, CI, IyME, SPyB, OADS, PDOCENTE, PF, CMC)

Todas siguen la misma plantilla de columnas (con variaciones menores de una hoja a otra):

| Columna | Encabezado típico | Contenido |
|---|---|---|
| A | Condición / Estándar | Código corto de la condición (AG, CI, SPyB, OADS, PD, PF, CMC) — texto fijo, repetido en cada fila de criterio |
| B | Criterios | Texto (a veces extenso, con saltos de línea) que describe el criterio de calidad a evaluar. Algunas filas son **subtítulos de agrupación** (p. ej. "2.1.1. Escenario de Práctica Clínicos") que **no tienen validación de datos ni se cuentan** — son solo texto organizador |
| C | Estado | **Única columna de captura de datos real.** Lista desplegable restringida a `C`, `NC`, `NA` mediante *Data Validation* de tipo `list` (fórmula `"C,NC,NA"`) |
| D | Valor / Comentarios | En `1. AG` es un campo "Valor"; en el resto de hojas es directamente "Comentarios" (texto libre) |
| E/F | Mecanismo de Verificación – Documental | Texto descriptivo (no editable por el usuario evaluador, es contenido fijo del formulario) que indica qué evidencia documental sustenta el criterio |
| F/G | Mecanismo de Verificación – Visita de inspección ocular | Igual, para verificación visual en sitio |
| H/I | Mecanismo de Verificación – Entrevista para verificación | Lista de roles a entrevistar (Personal IPS, Estudiantes, Docentes, Coordinador de práctica formativa) |

> Nota: el desplazamiento de columnas (E vs F, G vs H) varía entre hojas porque algunas tienen una columna "Valor" adicional y otras no; el contenido funcional es equivalente.

### 4.1 Validación de datos (dropdown)

Cada hoja restringe la columna "Estado" únicamente a las filas de criterios reales (excluye subtítulos y encabezados):

| Hoja | Rango con lista desplegable | Nº de criterios evaluables |
|---|---|---|
| `1. AG` | C4:C11 | 8 |
| `2.1. CI` | C6:C8, C10 | 4 |
| `2.2. IyME` | C6:C10, C12:C13, C15:C16 | 9 |
| `3, SPyB` | C4:C9 | 6 |
| `4. OADS` | C4:C9 | 6 |
| `5. PDOCENTE` | C4:C7 | 4 |
| `6. PF` | C4:C7 | 4 |
| `7.CMC` | C4:C5 | 2 |
| **Total** | | **43 criterios** |

### 4.2 Formato condicional (retroalimentación visual)

En la columna "Estado" de cada hoja hay 3 reglas de formato condicional (`beginsWith`) que colorean la celda según el valor escrito:

- `C` → relleno **verde** (`#B7E1CD`)
- `NC` → relleno **rojo** (`#EA9999`)
- `NA` → relleno **gris claro** (`#F3F3F3`)

### 4.3 Conteo automático (pie de cada hoja)

Debajo de la tabla de criterios, tres filas usan `COUNTIF` sobre la columna Estado para contar cuántos criterios quedaron en cada categoría:

```
CUMPLE     = COUNTIF(rango_estado, "C")
NO CUMPLE  = COUNTIF(rango_estado, "NC")
NO APLICA  = COUNTIF(rango_estado, "NA")
```

Estas tres celdas (p. ej. `C13`, `C14`, `C15` en `1. AG`) son las que consulta la hoja `Consolidado`.

**Inconsistencia detectada:** en 4 de las 8 hojas (`4. OADS`, `5. PDOCENTE`, `6. PF`, `7.CMC`) el rango del `COUNTIF` es un poco más ancho que el rango con validación de datos (incluye la fila de encabezado "Estado" o subtítulos). Esto no produce un conteo incorrecto porque esas celdas extra nunca contienen exactamente "C", "NC" o "NA", pero refleja falta de uniformidad en el mantenimiento de fórmulas y podría producir errores si alguien reutiliza esas filas.

---

## 5. Hoja `Consolidado` — motor de cálculo

Esta hoja no tiene entrada manual: es 100 % fórmulas que leen los conteos de las 8 hojas de criterios y los transforman en indicadores.

### 5.1 Bloques por condición (filas 1-95)

Para cada una de las 7 condiciones (una de ellas, Capacidad Instalada, con 2 filas de subcomponente) se repite el mismo bloque de columnas:

| Columna | Significado | Fórmula tipo |
|---|---|---|
| C | Total de criterios de la condición (constante, tecleada a mano, p. ej. `8`, `4`, `9`, `6`...) | valor fijo |
| D | Nº de "Cumple" | `='1. AG'!C13` (referencia directa a la celda CUMPLE de la hoja de criterios) |
| E | Nº de "No Cumple" | `='1. AG'!C14` |
| F | Nº de "No Aplica" | `='1. AG'!C15` |
| G | % Cumplimiento | `=D/(C-F)` → cumple / (total − no aplica). Los criterios marcados NA se excluyen del denominador |
| H | Valor (escala 0-5) | `=5*G` |
| I | Juicio de Cumplimiento | Cascada de `IF` anidados sobre `G` (ver escala en 5.3) |

Cuando una condición tiene dos subcomponentes (Capacidad Instalada: filas 16 y 17), hay además una fila **"CUMPLIMIENTO CONDICIÓN"** (fila 18) que promedia los `%Cumplimiento` de los subcomponentes con `AVERAGE(G16:G17)`.

### 5.2 Bloque `CONSOLIDADO CONDICIONES` (filas 108-116)

Resume las 7 condiciones en una sola tabla:

- **C109:C115** — reutilizan el `%Cumplimiento` ya calculado de cada bloque (`=G2`, `=G18`, `=G33`, `=G47`, `=G65`, `=G80`, `=G95`).
- **D109:D115** — valor en escala 0-5 (`=5*C`).
- **F109:F115** — juicio de cumplimiento (misma cascada de `IF`).
- **Fila 116 "CUMPLIMIENTO TOTAL"** — promedio simple de las 7 condiciones: `=AVERAGE(C109:C115)`, con su propio valor (0-5) y juicio. Este es el **indicador final del escenario de práctica**.

> Importante: el total no pondera por número de criterios de cada condición; cada condición pesa igual (1/7) sin importar si tiene 2 u 8 criterios.

### 5.3 Escala de juicios (filas 136-143)

Tabla de referencia usada por todas las fórmulas `IF` del libro:

| Juicio | Código | Intervalo de cumplimiento | Valoración (0-5) |
|---|---|---|---|
| Se Cumple Plenamente | A | 90% - 100% | 4,50 - 5,00 |
| Se Cumple en Alto Grado | B | 80% - 89% | 4,00 - 4,49 |
| Se Cumple Aceptablemente | C | 70% - 79% | 3,50 - 3,99 |
| Se Cumple Insatisfactoriamente | D | 30% - 69% | 1,50 - 3,49 |
| No Se Cumple | E | 0% - 29% | 0,00 - 1,49 |

Estas celdas (`$B$139`...`$B$143`) están **ancladas con referencia absoluta** y son citadas por todas las fórmulas `IF` anidadas del libro (tanto en las 7 hojas por condición como en el consolidado), es decir, esta tabla funciona como un catálogo/lookup centralizado.

### 5.4 Riesgo funcional: división por cero

Si en una condición **todos** los criterios se marcan `NA`, entonces `C - F = 0` y la fórmula `G = D/(C-F)` produce `#DIV/0!`, lo que se propagaría a `H`, a `I` (el `IF` fallaría) y al promedio general de la hoja Consolidado. El libro no contempla una protección (`IFERROR`) para este caso.

---

## 6. Flujo de uso end-to-end

1. El evaluador abre `Tabla de contenido`, diligencia los datos generales del escenario (texto libre en A4) y navega a cada condición mediante los hipervínculos de la columna B.
2. En cada hoja de condición, selecciona `C`/`NC`/`NA` en la columna "Estado" para cada criterio (con retroalimentación visual por color) y opcionalmente añade comentarios/observaciones.
3. Al fondo de cada hoja, tres celdas `COUNTIF` resumen el conteo de C/NC/NA de esa hoja automáticamente.
4. La hoja `Consolidado` recalcula en cascada: conteos → % cumplimiento → valor 0-5 → juicio cualitativo, primero por condición/subcomponente y luego el promedio general del escenario (fila 116).
5. El resultado final entregable es el bloque `CONSOLIDADO CONDICIONES` con el juicio global de cumplimiento del escenario de práctica.

---

## 7. Contenido normativo/temático por condición (resumen)

| Condición | Código | Criterios clave evaluados |
|---|---|---|
| 1. Aspectos Generales | AG | Naturaleza jurídica, código REPS, servicios habilitados (Res. 2003/2014), estructura orgánica, estadísticas de atención/población, vocación docente, caracterización poblacional, recursos para la relación docencia-servicio |
| 2. Capacidad Instalada – Análisis | CI | Diagnóstico de capacidad instalada/utilizada, cupos máximos de estudiantes (clínicos), ocupación simultánea, capacidad de espacios (no clínicos) |
| 2. Capacidad Instalada – Infraestructura y Medios Educativos | CI | Auditorios, salones dotados, biblioteca, equipos/dispositivos, cómputo/internet, espacios de reunión, insumos, según tipo de escenario (clínico, baja complejidad, no clínico) |
| 3. Seguridad, Protección y Bienestar | SPyB | Pólizas de responsabilidad civil, afiliación a SGSSS, elementos de protección personal, protocolos de bioseguridad, guías clínicas, condiciones de bienestar (alimentación, descanso) |
| 4. Organización Administrativa de la Docencia Servicio | OADS | Reglamento de prácticas, contratos especiales (Res. 1052/2020), responsables de supervisión, comité docencia-servicio, inducción, sistema de gestión documental |
| 5. Personal Docente | PD | Idoneidad de profesores, plan de formación continua, suficiencia de docentes, función docente en contratos |
| 6. Prácticas Formativas | PF | Registro calificado, convenios docencia-servicio, mecanismos de evaluación y delegación progresiva de responsabilidades |
| 7. Cultura del Mejoramiento Continuo | CMC | Modelo de autoevaluación de la relación docencia-servicio, planes de mejoramiento y evidencias de implementación |

---

## 8. Observaciones y hallazgos funcionales

1. **Sin protección de hoja/libro**: cualquier usuario puede modificar por error las fórmulas, los textos de criterios o las constantes de "Total criterios" en `Consolidado`, rompiendo el cálculo sin advertencia.
2. **Rangos `COUNTIF` inconsistentes** respecto a los rangos de validación de datos en 4 hojas (ver 4.3) — riesgo bajo pero indicativo de copy-paste sin ajuste fino.
3. **Sin manejo de `#DIV/0!`** cuando todos los criterios de una condición son `NA` (ver 5.4).
4. **Peso igualitario entre condiciones** en el cálculo del "CUMPLIMIENTO TOTAL", independientemente de su número de criterios (2 vs 9) — es una decisión de diseño válida, pero relevante si se espera un promedio ponderado por criterio.
5. **Encabezados de columna no estandarizados** entre hojas (algunas usan "Condición", otras "Estandar"; posiciones de columnas E-I varían), lo que dificultaría automatizar la lectura del archivo con una plantilla genérica sin mapeo por hoja.
6. **Datos generales del escenario en una sola celda de texto libre** (`Tabla de contenido!A4`) en vez de campos separados, lo que impide extraer esos datos de forma estructurada (p. ej. para un reporte o base de datos).
7. **Navegación por hipervínculos internos** funciona correctamente en ambos sentidos (índice ↔ hoja de criterio), buena práctica de usabilidad para un formulario de Excel extenso.

---

## 9. Resumen ejecutivo

Es una **plantilla de evaluación de cumplimiento normativo** (tipo checklist ponderado) implementada íntegramente con fórmulas nativas de Excel (`COUNTIF`, `IF` anidado, `AVERAGE`, referencias entre hojas), sin macros ni VBA. El diseño es funcional y autocontenido (43 criterios distribuidos en 7 condiciones normativas, con salida automática de un puntaje 0-5 y un juicio cualitativo de 5 niveles), pero carece de validaciones defensivas (protección de celdas, manejo de división por cero) y de estandarización de estructura entre hojas, lo que lo hace robusto para uso manual pero frágil si se intenta automatizar su lectura o edición programática sin un mapeo cuidadoso por hoja.
