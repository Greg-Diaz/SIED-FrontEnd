ctúa como un Senior Software Architect y Senior Full-Stack Developer especializado en React, TypeScript, .NET y diseño de aplicaciones empresariales.

Necesito desarrollar una solución web para la:

"AUTOEVALUACIÓN PARA LOS ESCENARIOS DE PRÁCTICA FORMATIVA EN EL MARCO DE LA RELACIÓN DOCENCIA SERVICIO"

La solución final tendrá Backend + Frontend.

IMPORTANTE:

En esta primera etapa SOLO debes desarrollar el FRONTEND.

El frontend debe quedar completamente preparado para que posteriormente se conecte a un backend REST real.

Durante esta primera etapa NO debes implementar un backend real.

En su lugar, utiliza MOCK DATA almacenada en archivos JSON.

Sin embargo, la arquitectura debe utilizar RTK Query desde el comienzo, de forma que posteriormente solo sea necesario cambiar el origen de los datos o el baseUrl de la API y no sea necesario reescribir los componentes.

==================================================
1. ARCHIVO DE REFERENCIA
==================================================

Existe un archivo Excel proporcionado como referencia funcional:

"Autoevaluacion escenarios práctica_Nuevo modelo (2) (1).xlsx"

Debes analizarlo y utilizarlo como fuente funcional para construir la interfaz.

Adicionalmente existe un análisis funcional ya validado del Excel:

docs/FUNCTIONAL_ANALYSIS.md

Ese documento es la fuente de verificación de toda regla de negocio (fórmulas, rangos, conteos, jerarquía de hojas). Ante cualquier duda, `FUNCTIONAL_ANALYSIS.md` prevalece sobre supuestos no verificados.

El Excel contiene principalmente:

- Tabla de contenido
- Consolidado
- 1. Aspectos Generales
- 2.1. Capacidad Instalada
- 2.2. Infraestructura y Medios Educativos
- 3. Seguridad, Protección y Bienestar
- 4. Organización Administrativa de la Docencia Servicio
- 5. Personal Docente
- 6. Prácticas Formativas
- 7. Cultura del Mejoramiento Continuo

IMPORTANTE — filas que NO son criterios:

Dentro de las hojas de criterios existen filas de agrupación/subtítulo (por ejemplo "2.1.1. Escenario de Práctica Clínicos", "2.2.2. Escenario de Práctica con servicios de Baja Complejidad"). Estas filas NO tienen estado evaluable (no tienen lista desplegable C/NC/NA en el Excel) y NO deben contarse como criterios. Son únicamente agrupadores visuales. El total real de criterios evaluables es 43 (ver sección 9).

NO debes intentar convertir visualmente el Excel en una aplicación.

Debes interpretar la información del Excel y transformarla en una aplicación web moderna, profesional, usable y responsive.

La aplicación debe conservar la lógica funcional y la información relevante del documento.

==================================================
2. OBJETIVO GENERAL DE LA APLICACIÓN
==================================================

La aplicación permitirá realizar una autoevaluación de un escenario de práctica formativa dentro del marco de la relación docencia-servicio.

El usuario debe poder:

1. Consultar la tabla de contenido.
2. Seleccionar una condición de evaluación.
3. Visualizar sus criterios.
4. Evaluar cada criterio.
5. Seleccionar el estado correspondiente.
6. Registrar comentarios.
7. Consultar los mecanismos de verificación.
8. Visualizar el avance de la evaluación.
9. Consultar el consolidado general.
10. Visualizar gráficas dinámicas.
11. Identificar las condiciones con mayor y menor cumplimiento.
12. Identificar criterios pendientes.
13. Obtener un juicio global de cumplimiento.

Nota: cuando una condición (o el resultado global) sea `NOT_EVALUABLE` (todos sus criterios aplicables en NA), la aplicación debe mostrar explícitamente "N/A", nunca un porcentaje, un juicio A-E o una valoración numérica (ver secciones 13, 14 y 40).

La aplicación debe sentirse como una plataforma empresarial de evaluación y no como una hoja de cálculo trasladada al navegador.

==================================================
3. STACK TECNOLÓGICO
==================================================

Utiliza:

- React
- TypeScript
- Vite
- React Router
- Redux Toolkit
- RTK Query
- JSON Mock Data
- CSS moderno / SCSS / CSS Modules o una estrategia limpia y mantenible
- Librería de componentes UI profesional si realmente aporta valor
- Librería de gráficas como Recharts, preferiblemente

Evita dependencias innecesarias.

No utilizar React Bootstrap.

La aplicación debe ser completamente responsive.

==================================================
4. ARQUITECTURA DEL FRONTEND
==================================================

Utiliza una arquitectura modular y escalable.

Propón una estructura similar a:

src/
├── app/
│   ├── store.ts
│   ├── router.tsx
│   └── providers/
│
├── assets/
│
├── components/
│   ├── common/
│   ├── layout/
│   ├── forms/
│   ├── tables/
│   ├── charts/
│   └── feedback/
│
├── features/
│   ├── evaluation/
│   ├── conditions/
│   ├── criteria/
│   ├── dashboard/
│   ├── objectives/
│   └── tableOfContents/
│
├── pages/
│   ├── Dashboard/
│   ├── TableOfContents/
│   ├── Condition/
│   └── NotFound/
│
├── services/
│   └── api/
│       ├── baseApi.ts
│       ├── scenariosApi.ts
│       ├── conditionsApi.ts
│       ├── criteriaApi.ts
│       ├── evaluationsApi.ts
│       └── dashboardApi.ts
│
├── domain/
│   └── compliance/
│       ├── calculateCompliance.ts
│       ├── calculateConditionSummary.ts
│       ├── calculateGlobalSummary.ts
│       ├── calculateObjectiveResult.ts
│       ├── getComplianceJudgement.ts
│       ├── getComplianceValue.ts
│       └── buildChartData.ts
│
├── mocks/
│   ├── scenarios.json
│   ├── conditions.json
│   ├── subConditions.json
│   ├── criterionGroups.json
│   ├── criteria.json
│   ├── evaluations.json
│   └── objectives.json
│
├── hooks/
│
├── types/
│
├── utils/
│
└── styles/

Notas sobre esta estructura (ver también sección 40):

- `domain/compliance/` concentra TODAS las funciones puras de cálculo (cumplimiento, valor, juicio, consolidado, objetivos). Son las únicas funciones autorizadas para calcular estos valores; ningún componente ni mock debe reimplementar esta lógica.
- `mocks/` NO incluye un `dashboard.json` con resultados precalculados. El dashboard se calcula siempre en tiempo de ejecución a partir de `evaluations.json` + `criteria.json` + `conditions.json` (ver secciones 8 y 17).
- `mocks/objectives.json` contiene únicamente la definición de `Objective` (título/descripción de lo que se mide), nunca resultados calculados (`ObjectiveResult` nunca se mockea a mano).

Puedes modificar esta estructura si encuentras una alternativa arquitectónicamente mejor.

Prioriza separación de responsabilidades, mantenibilidad y escalabilidad.

==================================================
5. TYPESCRIPT
==================================================

No utilizar "any" salvo que sea absolutamente inevitable.

Crear interfaces/types para:

Scenario
Condition
SubCondition
CriterionGroup
Criterion
Evaluation
EvaluationStatus
VerificationMechanism
DashboardSummary
DashboardCondition
ChartData
ComplianceJudgement
Objective
ObjectiveResult

Ejemplo conceptual:

interface Scenario {
    id: string;
    practiceName: string;
    municipality: string;
    servicesToProvide: string;
    preparedBy: string;
}

interface Criterion {
    id: string;
    subConditionId: string;
    groupId?: string | null;
    order: number;
    title: string;
    verificationMechanisms: VerificationMechanism;
}

type EvaluationStatus = "C" | "NC" | "NA" | "PENDING";

interface Evaluation {
    scenarioId: string;
    criterionId: string;
    status: EvaluationStatus;
    comments: string;
}

Nota: `C`, `NC` y `NA` son los códigos originales del Excel. `PENDING` es un estado exclusivo de la aplicación (ver sección 10).

`Scenario` reemplaza el bloque de texto libre único del Excel (`Tabla de contenido!A4`) por campos estructurados independientes (ver sección 9).

==================================================
6. MOCK DATA
==================================================

La mock data debe estar almacenada exclusivamente en archivos JSON.

NO hardcodear los criterios directamente dentro de los componentes React.

Ejemplo:

mocks/
    conditions.json
    subConditions.json
    criterionGroups.json
    criteria.json
    evaluations.json
    scenarios.json
    objectives.json

Los componentes deben consumir la información a través de RTK Query.

No hacer:

const criteria = [
   ...
];

dentro de los componentes.

Los datos deben simular respuestas de API.

IMPORTANTE: no debe existir un `dashboard.json` ni ningún otro archivo mock que contenga resultados de cumplimiento precalculados. Todo resultado (`ObjectiveResult`, resúmenes de dashboard, juicios, valoraciones) se calcula a partir de `evaluations.json` en el momento de la consulta (ver secciones 8, 13, 14 y 17).

==================================================
7. RTK QUERY
==================================================

Aunque inicialmente utilizamos JSON mock data, debemos diseñar el frontend como si existiera un backend real.

Crear un baseApi utilizando createApi.

Ejemplo conceptual:

baseApi = createApi({
    reducerPath: "api",
    baseQuery: ...
    endpoints: () => ({})
});

Después crear APIs específicas:

conditionsApi
evaluationApi
dashboardApi

Ejemplo conceptual:

getConditions
getConditionById
getCriteriaByCondition
getEvaluations
getEvaluationSummary
getDashboard

IMPORTANTE:

Los componentes NO deben leer directamente los archivos JSON.

La capa de RTK Query debe abstraer el origen de datos.

Actualmente:

Component
    ↓
RTK Query
    ↓
Mock API
    ↓
JSON

Posteriormente:

Component
    ↓
RTK Query
    ↓
REST API
    ↓
.NET Backend
    ↓
Database

La sustitución del mock por el backend real debe requerir cambios mínimos.

==================================================
8. MOCK API
==================================================

Como inicialmente no existe backend, crea una estrategia limpia para simular las respuestas.

Puedes utilizar:

- custom baseQuery
- mockBaseQuery
- funciones async
- delay artificial para simular latencia

La solución debe permitir posteriormente reemplazar:

mockBaseQuery

por:

fetchBaseQuery({
    baseUrl: "/api"
})

sin modificar los componentes.

Simular estados de:

loading
success
error

También debe existir un pequeño delay artificial para que la interfaz permita comprobar correctamente los estados de carga.

IMPORTANTE — `dashboardApi.getDashboard()`:

El endpoint mock de dashboard NO debe leer un archivo `dashboard.json` precalculado. Debe leer `evaluations.json` (+ `criteria.json` + `conditions.json` + `subConditions.json`) y calcular el resultado en el momento, reutilizando las funciones puras de `domain/compliance/`. Esto simula exactamente lo que hará el backend real (que tampoco almacenará resultados precalculados, sino que los calculará a partir de las evaluaciones persistidas) y garantiza que el dashboard nunca quede desincronizado de las evaluaciones.

==================================================
9. MODELO DE DATOS
==================================================

La aplicación debe manejar la siguiente jerarquía:

Scenario
    ↓
Condition (7)
    ↓
SubCondition (1 por condición, excepto Capacidad Instalada que tiene 2)
    ↓
CriterionGroup (opcional — solo donde el Excel tiene subtítulos de agrupación)
    ↓
Criterion (43 en total)
    ↓
Evaluation

Las 7 condiciones principales son:

1. Aspectos Generales (AG)
2. Capacidad Instalada (CI)
3. Seguridad, Protección y Bienestar (SPyB)
4. Organización Administrativa para la Docencia Servicio (OADS)
5. Personal Docente (PD)
6. Prácticas Formativas (PF)
7. Cultura del Mejoramiento Continuo (CMC)

Capacidad Instalada tiene EXACTAMENTE dos subcomponentes (no "al menos dos"):

2.1 Análisis de la Capacidad Instalada
2.2 Infraestructura y Medios Educativos

Todas las demás condiciones tienen una única subcondición implícita (para mantener un modelo simétrico y evitar tratar a Capacidad Instalada como caso especial en el código).

Total de criterios evaluables por condición/subcondición (confirmado en `FUNCTIONAL_ANALYSIS.md` §4.1):

| Condición | Subcondición | Criterios |
|---|---|---|
| Aspectos Generales (AG) | única | 8 |
| Capacidad Instalada (CI) | 2.1 Análisis de la Capacidad Instalada | 4 |
| Capacidad Instalada (CI) | 2.2 Infraestructura y Medios Educativos | 9 |
| Seguridad, Protección y Bienestar (SPyB) | única | 6 |
| Organización Administrativa (OADS) | única | 6 |
| Personal Docente (PD) | única | 4 |
| Prácticas Formativas (PF) | única | 4 |
| Cultura del Mejoramiento Continuo (CMC) | única | 2 |
| **TOTAL** | | **43** |

Las filas de agrupación/subtítulo (p. ej. "2.1.1. Escenario de Práctica Clínicos", "2.2.1/2.2.2/2.2.3...") NO son criterios: se modelan como `CriterionGroup`, un nivel puramente organizativo dentro de una subcondición, sin estado evaluable propio. Solo existen en `2.1 CI` y `2.2 IyME`; el resto de subcondiciones no tiene `CriterionGroup`.

Mantener esta jerarquía tanto en los mocks como en la interfaz.

==================================================
10. ESTADOS DE EVALUACIÓN
==================================================

Cada criterio puede tener uno de los siguientes estados:

COMPLIES (C)
    CUMPLE

DOES_NOT_COMPLY (NC)
    NO CUMPLE

NOT_APPLICABLE (NA)
    NO APLICA

`C`, `NC` y `NA` son los tres únicos estados que existen en el Excel (columna "Estado", validación de datos `list: "C,NC,NA"`).

También debe existir inicialmente:

PENDING
    Sin evaluar

IMPORTANTE: `PENDING` NO existe en el Excel. En el Excel, un criterio sin diligenciar es simplemente una celda vacía que no se cuenta en ningún `COUNTIF` (ni como C, ni NC, ni NA). `PENDING` es una extensión exclusiva de la aplicación web para poder distinguir visualmente "criterio sin evaluar" de "criterio evaluado como No Aplica". Esto debe quedar documentado en el código (comentario en el tipo `EvaluationStatus`) para que no se asuma erróneamente que viene del Excel.

Esto es importante para distinguir:

- criterios evaluados
- criterios no evaluados

Los estados deben tener representación visual clara.

Utiliza badges, indicadores y colores accesibles.

No depender únicamente del color para comunicar el estado.

==================================================
11. FORMULARIO DE EVALUACIÓN
==================================================

Cada condición debe mostrar sus criterios en una interfaz clara.

Para cada criterio mostrar:

- Código
- Nombre / descripción
- Estado
- Comentarios
- Mecanismos de verificación

Los mecanismos de verificación pueden incluir:

- Documental
- Visita de inspección ocular
- Entrevista para verificación

Y las personas involucradas en la entrevista cuando corresponda:

- Personal IPS
- Estudiantes
- Docentes
- Coordinador de práctica formativa Unicorsalud

Cuando una subcondición tenga `CriterionGroup` (solo en Capacidad Instalada), el nombre del grupo (p. ej. "2.1.1. Escenario de Práctica Clínicos") debe mostrarse como un separador/encabezado visual dentro del acordeón o tabs, nunca como una fila evaluable con su propio selector de estado.

La interfaz debe mostrar esta información de manera organizada.

No colocar todo en una tabla gigantesca.

Considera utilizar:

Accordion
Cards
Expandable rows
Tabs

según corresponda.

La experiencia debe ser mucho más legible que el Excel original.

==================================================
12. GUARDADO DE EVALUACIONES
==================================================

Aunque inicialmente sea mock data, la aplicación debe comportarse como si estuviera guardando información.

Al modificar un criterio:

1. Actualizar el estado visual.
2. Actualizar el store/cache de RTK Query.
3. Recalcular el `ObjectiveResult` de la subcondición, de la condición y el global (ver secciones 13 y 14).
4. Actualizar las gráficas.
5. Actualizar el porcentaje de avance.

Simular una respuesta del backend:

{
    "success": true,
    "message": "Evaluation updated successfully",
    "data": {
        ...
    }
}

Posteriormente esta operación será reemplazada por:

PUT /api/evaluations/{criterionId}

o el endpoint que se defina durante el desarrollo backend.

==================================================
13. OBJECTIVE Y OBJECTIVE RESULT
==================================================

MUY IMPORTANTE.

`Objective` y `ObjectiveResult` son DOS entidades distintas y no deben mezclarse en un solo objeto:

- `Objective`: definición/configuración de qué se está midiendo. Es un concepto exclusivo de la aplicación — el Excel NO tiene la noción de "objetivo" ni de meta (`target`). Es esencialmente metadata descriptiva ligada a una condición (o al escenario completo, cuando `conditionId` es `null`).

- `ObjectiveResult`: el resultado calculado dinámicamente a partir de las evaluaciones reales. NUNCA se mockea a mano ni se guarda como JSON estático; siempre se deriva mediante `calculateObjectiveResult()`.

Ejemplo conceptual:

// Configuración (sí puede vivir en mocks/objectives.json)
{
    "id": "objective-ag",
    "conditionId": "AG",
    "title": "Cumplimiento de los aspectos generales",
    "description": "Determinar el nivel de cumplimiento de los criterios asociados a los aspectos generales del escenario."
}

// Resultado (SIEMPRE calculado, nunca mockeado)
{
    "objectiveId": "objective-ag",
    "totalCriteria": 8,
    "effectiveCriteria": 7,
    "compliantCount": 5,
    "nonCompliantCount": 2,
    "notApplicableCount": 1,
    "pendingCount": 0,
    "compliancePercentage": 71.4,
    "value": 3.57,
    "judgement": { "code": "C", "label": "Se Cumple Aceptablemente" },
    "status": "EVALUATED"
}

Si `targetPercentage` (meta) se quiere ofrecer como funcionalidad adicional, debe tratarse como un valor OPCIONAL y CONFIGURABLE por la aplicación (no un dato proveniente del Excel) — ver sección 40.

El frontend debe poder mostrar:

- objetivo (definición)
- porcentaje actual
- valor (0-5)
- juicio de cumplimiento
- brecha frente a una meta, únicamente si esa meta fue configurada explícitamente en la aplicación

REGLA DE CÁLCULO — CONFIRMADA POR EL EXCEL, NO ES UNA PROPUESTA ABIERTA:

Esta fórmula está verificada en `Consolidado!G = D/(C-F)` del Excel y debe implementarse tal cual, sin reinterpretarla:

effectiveCriteria = totalCriteria - notApplicableCount

compliancePercentage =
    effectiveCriteria > 0
        ? (compliantCount / effectiveCriteria) * 100
        : null   // ver regla NOT_EVALUABLE abajo

Ejemplo:

Total criterios = 10
CUMPLE = 7
NO CUMPLE = 2
NO APLICA = 1

effectiveCriteria = 10 - 1 = 9
compliancePercentage = (7 / 9) * 100 = 77.8%

CASO DEFENSIVO — TODOS LOS CRITERIOS APLICABLES EN NA (`NOT_EVALUABLE`):

Si `effectiveCriteria = 0` (todos los criterios de la subcondición/condición están en NA), el resultado NO debe ser `0%` ni debe lanzar un error (a diferencia del Excel, que produce `#DIV/0!`):

- `compliancePercentage = null`
- `value = null`
- `judgement = null`
- `status = "NOT_EVALUABLE"`

La UI debe mostrar explícitamente **"N/A"** en vez de 0%, de un juicio A-E o de una valoración numérica. Esto es una mejora intencional respecto al Excel original y debe documentarse como tal en el código (ver sección 40).

Esta regla debe estar encapsulada en funciones puras:

calculateCompliance()          // % por subcondición
calculateObjectiveResult()     // ObjectiveResult completo (incluye value, judgement, status)

para que puedan probarse y ajustarse de forma centralizada.

==================================================
14. CONSOLIDADO
==================================================

Crear una página:

/dashboard

o:

/consolidated

que represente el "Consolidado" del Excel.

Debe mostrar como mínimo:

- Total de criterios
- Criterios cumplidos
- Criterios no cumplidos
- Criterios no aplicables
- Criterios pendientes
- Porcentaje de cumplimiento (o "N/A" si `NOT_EVALUABLE`)
- Juicio de cumplimiento (o "N/A" si `NOT_EVALUABLE`)
- Valoración (o "N/A" si `NOT_EVALUABLE`)

Por condición:

Aspectos Generales
Capacidad Instalada
Seguridad, Protección y Bienestar
Organización Administrativa
Personal Docente
Prácticas Formativas
Cultura del Mejoramiento Continuo

REGLAS DE AGREGACIÓN — CONFIRMADAS/DEFINIDAS EXPLÍCITAMENTE:

1. Capacidad Instalada = promedio simple de los porcentajes de sus dos subcomponentes, CONFIRMADO como regla definitiva (ya no pendiente):

   - Si 2.1 y 2.2 son ambos evaluables:
     conditionCI.compliancePercentage = average(subCondition2_1.compliancePercentage, subCondition2_2.compliancePercentage)
     (confirmado en `Consolidado!G18 = AVERAGE(G16:G17)`)
   - Si CUALQUIERA de los dos subcomponentes (2.1 o 2.2) es `NOT_EVALUABLE`, entonces Capacidad Instalada (CI) completa es `NOT_EVALUABLE`.
   - NO se debe promediar solo el subcomponente restante (eso equivaldría a cambiar el denominador de 2 a 1) ni excluir silenciosamente el subcomponente `NOT_EVALUABLE`.
   - Si CI resulta `NOT_EVALUABLE`, se propaga al resultado global conforme a la regla 3 de abajo.
   - Esta es una decisión DEFENSIVA de la aplicación (el Excel no define este caso) y debe quedar documentada como tal en el código, pendiente de validación funcional futura por negocio.

2. Resultado global = promedio simple (NO ponderado) de las 7 condiciones:

   globalCompliance = average(
       condition1, condition2, condition3, condition4,
       condition5, condition6, condition7
   )

   (confirmado en `Consolidado!C116 = AVERAGE(C109:C115)`). Cada condición pesa exactamente 1/7, sin importar si tiene 2 u 8 criterios. NO ponderar por número de criterios bajo ninguna circunstancia.

3. Propagación de `NOT_EVALUABLE` al resultado global (regla DEFENSIVA de la aplicación, el Excel no la define):

   - Si CUALQUIERA de las 7 condiciones principales es `NOT_EVALUABLE`, el resultado global es `NOT_EVALUABLE` también.
   - NO se debe excluir silenciosamente esa condición del promedio.
   - NO se debe reducir el denominador de 7 a 6, 5, etc.
   - Esta decisión debe quedar documentada explícitamente en el código y en `docs/PROMPT.md` (sección 40) como una decisión de diseño defensiva, pendiente de validación funcional posterior por el negocio.

Esta lógica se centraliza en:

calculateConditionSummary()   // aplica la regla 1 (promedio de subcondiciones)
calculateGlobalSummary()      // aplica las reglas 2 y 3 (promedio de 7 condiciones + propagación NOT_EVALUABLE)

==================================================
15. REGLA DE JUICIO DE CUMPLIMIENTO
==================================================

Implementar la siguiente escala (confirmada en `Consolidado!B138:F143`):

90% - 100%
    A
    Se Cumple Plenamente

80% - 89%
    B
    Se Cumple en Alto Grado

70% - 79%
    C
    Se Cumple Aceptablemente

30% - 69%
    D
    Se Cumple Insatisfactoriamente

0% - 29%
    E
    No Se Cumple

Esta escala SOLO aplica cuando `compliancePercentage` es un número (`status !== "NOT_EVALUABLE"`). Cuando el resultado es `NOT_EVALUABLE`, no se asigna ningún código A-E: `judgement = null` y la UI muestra "N/A".

IMPORTANTE:

Centralizar esta lógica.

Crear una función como:

getComplianceJudgement(percentage: number | null)

que retorne:

{
    "code": "C",
    "label": "Se Cumple Aceptablemente",
    "min": 70,
    "max": 79
}

o `null` si `percentage` es `null` (caso `NOT_EVALUABLE`).

No repetir esta lógica dentro de componentes.

==================================================
16. VALORACIÓN
==================================================

La plantilla también contempla:

A → 4.50 - 5.00
B → 4.00 - 4.49
C → 3.50 - 3.99
D → 1.50 - 3.49
E → 0.00 - 1.49

Esta fórmula ESTÁ confirmada y definida con exactitud en el Excel (`Consolidado!H = 5*G`), no es una ambigüedad:

value = (compliancePercentage / 100) * 5

Cuando `compliancePercentage` es `null` (caso `NOT_EVALUABLE`), `value` también debe ser `null` — nunca `0`.

Diseñar la función:

getComplianceValue(percentage: number | null): number | null

para convertir el porcentaje en la valoración correspondiente, encapsulada para que pueda ajustarse cuando se defina la regla definitiva del backend.

==================================================
17. DASHBOARD
==================================================

El dashboard es una parte MUY IMPORTANTE de la aplicación.

No crear gráficas estáticas.

Las gráficas deben depender completamente de la mock data, y en particular de `evaluations.json` — NUNCA de un archivo de resultados precalculado (ver secciones 6 y 8). El dashboard es 100% una función derivada de las evaluaciones: `dashboard = f(evaluations, criteria, conditions, subConditions)`.

Si cambia:

COMPLIES
DOES_NOT_COMPLY
NOT_APPLICABLE

las gráficas deben cambiar automáticamente.

Crear al menos:

### Gráfica 1 — Cumplimiento por condición

Bar chart:

X:
Condiciones

Y:
Porcentaje de cumplimiento

Las condiciones con resultado `NOT_EVALUABLE` deben representarse de forma distinguible (p. ej. barra vacía con etiqueta "N/A"), nunca como una barra en 0% (que se leería como "no cumple nada").

### Gráfica 2 — Distribución de estados

Donut/Pie chart:

CUMPLE
NO CUMPLE
NO APLICA
PENDIENTE

### Gráfica 3 — Comparación por condición

Stacked bar:

CUMPLE
NO CUMPLE
NO APLICA

### Gráfica 4 — Progreso general

Progress / radial chart:

Porcentaje global (o indicador "N/A" si el global es `NOT_EVALUABLE`)

### Gráfica 5 — Brechas

Mostrar las condiciones con menor cumplimiento (excluyendo las `NOT_EVALUABLE`, que no tienen un porcentaje comparable).

Las gráficas deben recibir datos mediante props.

Ejemplo:

<ComplianceByConditionChart
    data={dashboardData.byCondition}
/>

No permitir que la gráfica consulte directamente el JSON.

==================================================
18. DASHBOARD DINÁMICO
==================================================

Crear un selector:

"Escenario de práctica"

y permitir seleccionar el escenario.

Posteriormente el backend podrá devolver información diferente.

El dashboard debe recalcular:

- métricas
- objetivos
- gráficas
- juicios
- porcentajes

según el escenario seleccionado.

==================================================
19. TABLA DE CONTENIDO
==================================================

Crear una página:

/table-of-contents

Inspirada en la sección "Tabla de contenido" del Excel.

Debe funcionar como índice de navegación.

Mostrar:

1. Aspectos Generales — 8 criterios
2. Capacidad Instalada — 13 criterios (4 + 9, dos subcomponentes)
3. Seguridad, Protección y Bienestar — 6 criterios
4. Organización Administrativa — 6 criterios
5. Personal Docente — 4 criterios
6. Prácticas Formativas — 4 criterios
7. Cultura del Mejoramiento Continuo — 2 criterios

Cada elemento debe permitir navegar directamente a su sección.

Además mostrar:

- cantidad de criterios
- porcentaje completado
- porcentaje de cumplimiento (o "N/A" si la condición es `NOT_EVALUABLE`)
- estado

Ejemplo:

Aspectos Generales
8 criterios
75% completado
66% cumplimiento

[Continuar evaluación]

==================================================
20. NAVEGACIÓN
==================================================

Utilizar React Router.

Rutas mínimas:

/
    redirect a /dashboard

/dashboard

/table-of-contents

/conditions/:conditionId

/conditions/:conditionId/criteria

/summary

/error o NotFound

La navegación debe ser clara.

Sidebar en desktop.

En mobile utilizar navegación colapsable.

==================================================
21. LAYOUT
==================================================

Diseñar una interfaz moderna, profesional y orientada a aplicaciones empresariales.

NO hacer una interfaz excesivamente colorida.

NO hacer una interfaz tipo dashboard de marketing.

Debe parecer una plataforma institucional / empresarial.

Propuesta:

Sidebar:
- Dashboard
- Tabla de contenido
- Evaluación
- Consolidado

Header:
- Nombre del escenario
- Estado general
- Usuario
- Breadcrumb

Main:
- contenido

Footer:
- información institucional

Utilizar mucho espacio blanco.

Cards limpias.

Bordes sutiles.

Tipografía muy legible.

Jerarquía visual clara.

==================================================
22. EXPERIENCIA VISUAL
==================================================

Priorizar:

- legibilidad
- accesibilidad
- consistencia
- responsive design
- navegación rápida
- feedback inmediato

Utilizar:

- cards
- badges
- progress bars
- tooltips
- accordions
- tabs
- tables únicamente donde tengan sentido
- skeleton loading

Evitar:

- tablas con demasiadas columnas
- textos extremadamente pequeños
- interfaces saturadas
- exceso de iconos
- exceso de colores
- animaciones innecesarias

==================================================
23. ESTADOS DE LA APLICACIÓN
==================================================

Todos los componentes que consuman RTK Query deben contemplar:

Loading

Error

Empty

Success

Ejemplo:

if (isLoading) {
   return <LoadingSkeleton />;
}

if (isError) {
   return <ErrorState />;
}

if (!data?.length) {
   return <EmptyState />;
}

==================================================
24. RESPONSIVE DESIGN
==================================================

La aplicación debe funcionar correctamente en:

Desktop
Tablet
Mobile

En mobile:

- Sidebar colapsable
- Cards en una columna
- Gráficas adaptables
- Formularios fáciles de usar
- Evitar tablas horizontales cuando sea posible

==================================================
25. COMPONENTES REUTILIZABLES
==================================================

Crear componentes reutilizables:

AppLayout
Sidebar
Header
Breadcrumbs
PageHeader
SectionCard
CriterionCard
CriterionGroupHeader
EvaluationStatusSelector
CommentsField
VerificationMechanisms
ProgressIndicator
ComplianceBadge
MetricCard
DashboardChart
LoadingSkeleton
ErrorState
EmptyState
ObjectiveCard

`ObjectiveCard` debe renderizar tanto la definición (`Objective`) como su resultado (`ObjectiveResult`), y debe contemplar explícitamente el estado `NOT_EVALUABLE` mostrando "N/A" en lugar de porcentaje/juicio/valor.

Evitar duplicar código.

==================================================
26. ACCESIBILIDAD
==================================================

Utilizar:

- labels correctos
- aria-label cuando sea necesario
- navegación mediante teclado
- contraste adecuado
- focus states
- botones semánticos
- inputs correctamente asociados

No depender únicamente del color.

==================================================
27. PERFORMANCE
==================================================

Considerar:

- React.lazy
- code splitting
- memoización solo cuando aporte valor
- RTK Query caching
- evitar renders innecesarios
- evitar transformar grandes cantidades de datos dentro del render

Los cálculos del dashboard deben estar separados de la UI.

==================================================
28. UTILIDADES
==================================================

Crear funciones puras (en `domain/compliance/`):

calculateCompliance()          // % de una subcondición = C / (Total - NA); null si effectiveCriteria = 0
calculateProgress()            // % de criterios evaluados (no PENDING) sobre el total
getComplianceJudgement()       // porcentaje -> código A-E, o null si NOT_EVALUABLE
getComplianceValue()           // porcentaje -> valor 0-5, o null si NOT_EVALUABLE
calculateConditionSummary()    // promedia subcondiciones (p. ej. 2.1 y 2.2 para CI); propaga NOT_EVALUABLE si una subcondición lo es
calculateGlobalSummary()       // promedio simple de las 7 condiciones; propaga NOT_EVALUABLE si CUALQUIERA de las 7 lo es, sin reducir el denominador
buildChartData()
calculateObjectiveResult()     // combina un Objective con las evaluaciones de su condición para producir el ObjectiveResult completo

Estas funciones deben poder probarse independientemente.

==================================================
29. MOCK DATA REALISTA
==================================================

No crear solamente 2 o 3 criterios de prueba.

Utilizar los 43 criterios reales del Excel — ni más, ni menos, agrupados en las 7 condiciones y 8 subcondiciones (ver sección 9).

Crear mocks representativos de todas las condiciones.

Las evaluaciones deben contener una combinación realista de:

CUMPLE
NO CUMPLE
NO APLICA
PENDIENTE

Adicionalmente, incluir al menos un escenario mock (o una condición dentro de un escenario) donde TODOS los criterios aplicables estén en NA, para poder verificar en la interfaz el comportamiento `NOT_EVALUABLE` / "N/A" descrito en las secciones 13, 14 y 40.

Esto permitirá verificar que las gráficas funcionan realmente.

Los comentarios también deben contener ejemplos realistas.

==================================================
30. RESPUESTAS DE MOCK API
==================================================

Las respuestas deben simular una API real.

Ejemplo:

GET /conditions

{
    "success": true,
    "message": "Conditions retrieved successfully",
    "data": [...]
}

GET /conditions/AG

{
    "success": true,
    "message": "Condition retrieved successfully",
    "data": {
        ...
    }
}

GET /dashboard

{
    "success": true,
    "message": "Dashboard retrieved successfully",
    "data": {
        ...
    }
}

PUT /evaluations/:id

{
    "success": true,
    "message": "Evaluation updated successfully",
    "data": {
        ...
    }
}

El frontend debe diseñarse utilizando esta estructura de respuesta.

==================================================
31. PREPARACIÓN PARA EL BACKEND
==================================================

Aunque el backend no se desarrollará todavía, debes diseñar el frontend pensando en el backend futuro.

Documentar claramente:

- endpoints esperados
- request models
- response models
- parámetros
- IDs
- relaciones
- códigos de error

Crear un archivo:

API_CONTRACT.md

con el contrato preliminar.

Ejemplo:

GET /api/scenarios
GET /api/scenarios/{scenarioId}
GET /api/conditions
GET /api/conditions/{conditionId}
GET /api/criteria
GET /api/evaluations
PUT /api/evaluations/{criterionId}
GET /api/dashboard/{scenarioId}

No implementar todavía estos endpoints en .NET.

Solo dejar documentado el contrato esperado.

==================================================
32. BACKEND FUTURO
==================================================

La arquitectura futura esperada será:

React SPA
    ↓
RTK Query
    ↓
REST API
    ↓
ASP.NET Core
    ↓
Application Layer
    ↓
Domain
    ↓
Infrastructure / EF Core
    ↓
Database

No acoplar los componentes React al backend.

==================================================
33. MANEJO DE ERRORES
==================================================

Preparar la aplicación para respuestas como:

400 Bad Request
401 Unauthorized
403 Forbidden
404 Not Found
409 Conflict
500 Internal Server Error

Crear una estrategia centralizada para errores de API.

==================================================
34. CRITERIOS DE CALIDAD
==================================================

El código debe:

- ser TypeScript estricto
- ser legible
- ser modular
- evitar duplicación
- utilizar nombres descriptivos
- utilizar componentes pequeños
- evitar lógica de negocio en JSX
- separar presentación y lógica
- utilizar hooks cuando corresponda
- utilizar RTK Query correctamente

No crear componentes gigantes.

==================================================
35. NO HACER
==================================================

NO:

- crear backend todavía
- crear controllers .NET
- crear base de datos
- hardcodear criterios dentro de componentes
- utilizar fetch directamente desde componentes
- utilizar Axios directamente dentro de componentes
- duplicar lógica de cálculo
- crear gráficas con valores hardcodeados
- crear porcentajes hardcodeados
- convertir el Excel literalmente en una tabla HTML
- utilizar colores excesivos
- utilizar "any" indiscriminadamente
- crear un `dashboard.json` (o similar) con resultados de cumplimiento precalculados
- tratar las filas de agrupación/subtítulo del Excel como criterios evaluables reales
- devolver `0%`, un juicio A-E o lanzar un error cuando todos los criterios aplicables de una condición sean NA (usar `NOT_EVALUABLE` / "N/A")
- excluir silenciosamente una condición `NOT_EVALUABLE` del promedio global o cambiar el denominador de 7

==================================================
36. ENTREGABLES
==================================================

Al terminar esta etapa debes entregar:

1. Proyecto React funcionando.

2. Arquitectura de carpetas.

3. TypeScript models.

4. Mock JSON data.

5. RTK Query configurado.

6. Mock API configurada.

7. React Router configurado.

8. Dashboard.

9. Tabla de contenido.

10. Formularios de evaluación.

11. Consolidado.

12. Gráficas dinámicas.

13. Cálculo de cumplimiento.

14. Cálculo de progreso.

15. Cálculo de objetivos (`Objective` + `ObjectiveResult`).

16. Cálculo de juicio.

17. Estados loading/error/empty.

18. Diseño responsive.

19. API_CONTRACT.md.

20. README.md con instrucciones para ejecutar el proyecto.

21. Trazabilidad de las reglas funcionales definitivas y las decisiones pendientes de validación (sección 40) reflejada en el código (comentarios) y/o en la documentación entregada.

==================================================
37. ORDEN DE IMPLEMENTACIÓN
==================================================

NO intentes implementar todo de una sola vez.

Trabaja en fases.

FASE 1
Analizar completamente el Excel.

Identificar:

- condiciones
- subcondiciones
- criterios
- mecanismos de verificación
- estados
- estructura del consolidado
- reglas de cumplimiento

Antes de programar, presentar un resumen de la estructura detectada.

FASE 2
Crear proyecto React + TypeScript + Vite.

Configurar:

- Redux
- RTK Query
- Router
- estilos
- estructura base

FASE 3
Crear modelos TypeScript.

FASE 4
Crear JSON mock data.

FASE 5
Implementar Mock API con RTK Query.

FASE 6
Implementar Layout y navegación.

FASE 7
Implementar Tabla de Contenido.

FASE 8
Implementar pantalla de evaluación.

FASE 9
Implementar cálculo de resultados.

FASE 10
Implementar Consolidado.

FASE 11
Implementar Dashboard y gráficas dinámicas.

FASE 12
Implementar responsive design.

FASE 13
Implementar estados de loading/error/empty.

FASE 14
Revisar UX y consistencia visual.

FASE 15
Crear API_CONTRACT.md.

FASE 16
Crear README.md.

==================================================
38. REGLA IMPORTANTE PARA EL DESARROLLO
==================================================

Después de cada fase:

1. Explica qué se implementó.
2. Lista los archivos creados/modificados.
3. Explica las decisiones arquitectónicas importantes.
4. Verifica que la aplicación compile.
5. Identifica cualquier problema.
6. No avances a la siguiente fase si existe un error estructural importante.

No inventes información del Excel.

Si una regla de negocio no está claramente definida, identifica la ambigüedad y propón una solución configurable en lugar de asumirla silenciosamente.

==================================================
39. PRIMERA TAREA
==================================================

NO empieces todavía construyendo todas las pantallas.

Primero:

1. Analiza el Excel proporcionado.
2. Identifica toda la estructura funcional.
3. Identifica las condiciones.
4. Identifica los criterios.
5. Identifica los mecanismos de verificación.
6. Identifica los estados.
7. Identifica las reglas del consolidado.
8. Identifica la escala de juicios.
9. Identifica posibles ambigüedades en las fórmulas.
10. Propón el modelo de datos.
11. Propón la estructura de carpetas.
12. Propón el contrato inicial de API.
13. Propón la estrategia de mock data.
14. Propón la arquitectura de RTK Query.
15. Propón el diseño visual.

Después de esto, espera mi aprobación antes de comenzar a implementar la FASE 2.

ESTADO ACTUAL (registro de avance):

La FASE 1 (análisis funcional del Excel, detección de contradicciones frente a este documento, y definición de las reglas funcionales definitivas, incluida la regla de propagación de `NOT_EVALUABLE` en Capacidad Instalada) fue completada y aprobada explícitamente en su totalidad — sin puntos pendientes. Ver sección 40 para el resumen definitivo. La FASE 2 (creación del proyecto React + configuración de Redux/RTK Query/Router/estilos/estructura base) fue aprobada explícitamente y es la única fase autorizada a ejecutarse a continuación. Las fases 3 en adelante requieren nueva aprobación explícita.

Recuerda:

La prioridad de esta primera etapa es construir un FRONTEND profesional, moderno, escalable y preparado para conectar posteriormente con un backend ASP.NET Core.

La aplicación debe ser una SPA.

React Router + Redux Toolkit + RTK Query son obligatorios.

La mock data debe estar en JSON.

Las gráficas deben ser completamente dinámicas.

Los cálculos deben derivarse de las respuestas.

La arquitectura debe permitir reemplazar fácilmente la mock API por una REST API real.

==================================================
40. REGLAS FUNCIONALES DEFINITIVAS Y DECISIONES PENDIENTES
==================================================

Esta sección es el resumen autoritativo de todo lo validado contra el Excel y `docs/FUNCTIONAL_ANALYSIS.md`. Ante cualquier ambigüedad en secciones anteriores, esta sección prevalece.

--------------------------------------------------
40.1 REGLAS FUNCIONALES DEFINITIVAS (no configurables, no reinterpretables)
--------------------------------------------------

1. Existen exactamente 7 condiciones: AG, CI, SPyB, OADS, PD, PF, CMC.
2. Existen exactamente 43 criterios evaluables (8 + 4 + 9 + 6 + 6 + 4 + 4 + 2).
3. Capacidad Instalada (CI) tiene exactamente 2 subcomponentes: 2.1 (4 criterios) y 2.2 (9 criterios).
4. Las filas de agrupación/subtítulo dentro de las hojas de criterios (p. ej. "2.1.1...", "2.2.2...") NO son criterios evaluables; se modelan como `CriterionGroup`, sin estado propio.
5. Los estados originales del Excel son exclusivamente `C`, `NC`, `NA`.
6. `PENDING` es un estado exclusivo de la aplicación web, inexistente en el Excel, usado solo para distinguir "sin evaluar" de "no aplica".
7. Cumplimiento de una subcondición = `C / (Total - NA)`.
8. Valor (0-5) = `(porcentaje / 100) * 5`, en todos los niveles (subcondición, condición, global).
9. Escala de juicio A-E (90-100 A, 80-89 B, 70-79 C, 30-69 D, 0-29 E) aplicada solo cuando existe un porcentaje numérico.
10. Capacidad Instalada (condición) = promedio simple de los porcentajes de 2.1 y 2.2 SI ambos son evaluables; si CUALQUIERA de los dos es `NOT_EVALUABLE`, Capacidad Instalada completa es `NOT_EVALUABLE` (sin promediar solo el subcomponente restante ni cambiar el denominador de 2 a 1) — confirmado explícitamente por el usuario, ya no es una propuesta.
11. Resultado global = promedio simple (no ponderado) de las 7 condiciones. No se pondera por número de criterios de cada condición.
12. Cuando todos los criterios aplicables de una subcondición/condición están en `NA`: resultado = `NOT_EVALUABLE`, `compliancePercentage = null`, `value = null`, `judgement = null`, UI muestra "N/A" (nunca 0% ni error).
13. Cuando cualquiera de las 7 condiciones principales es `NOT_EVALUABLE` (incluida Capacidad Instalada cuando aplica la regla 10), el resultado global es `NOT_EVALUABLE`. No se excluye la condición del promedio ni se reduce el denominador de 7.
14. El dashboard y todo `ObjectiveResult` se calculan siempre dinámicamente a partir de `evaluations.json`; ningún resultado se almacena como mock estático.
15. `Objective` (definición) y `ObjectiveResult` (cálculo) son entidades separadas.
16. Los datos generales del escenario (Escenario de práctica, Municipio, Servicios a prestar, Elaborado por) se capturan como campos estructurados independientes en `Scenario`, no como un bloque de texto libre único.

--------------------------------------------------
40.2 DECISIONES DEFENSIVAS DE DISEÑO (explícitas, documentadas, pendientes de validación funcional posterior por negocio)
--------------------------------------------------

a) **Propagación de `NOT_EVALUABLE` al global (regla 13 de 40.1):** el Excel no define qué hacer cuando una condición completa queda en NA. Se adopta la regla defensiva de propagar `NOT_EVALUABLE` al resultado global sin modificar el denominador, en vez de excluir la condición o mostrar un 0%. Esta decisión debe reconfirmarse con el área funcional/negocio cuando exista un caso real, ya que no hay precedente en el Excel. CONFIRMADA por el usuario.

b) **Propagación de `NOT_EVALUABLE` entre los subcomponentes de Capacidad Instalada (regla 10 de 40.1):** por simetría con la regla (a), si `2.1` o `2.2` resultan `NOT_EVALUABLE`, la condición Capacidad Instalada también lo es (en vez de promediar solo el subcomponente restante, lo que equivaldría a cambiar el denominador de 2 a 1). CONFIRMADA EXPLÍCITAMENTE por el usuario — ya es regla definitiva (40.1 #10), no una propuesta. Se mantiene documentada aquí porque, igual que (a), es una decisión defensiva de la aplicación sin precedente en el Excel y pendiente de validación funcional futura por negocio si se presenta un caso real.

c) **`targetPercentage` / meta de `Objective`:** el Excel no contempla metas. Si se implementa, debe ser un valor opcional y configurable por la aplicación (no derivado del Excel), claramente distinguido del resultado real (`ObjectiveResult`).

d) **Progreso (`calculateProgress()`):** se define como el porcentaje de criterios ya evaluados (estado distinto de `PENDING`) sobre el total. Es un concepto exclusivo de la aplicación (el Excel no distingue "pendiente"), incluido para dar retroalimentación de avance durante el diligenciamiento.

--------------------------------------------------
40.3 CAMBIOS ARQUITECTÓNICOS APLICADOS EN ESTA REVISIÓN
--------------------------------------------------

- Se agregó `domain/compliance/` como capa única de funciones puras de cálculo.
- Se eliminó `mocks/dashboard.json`; el dashboard se calcula en runtime.
- Se agregaron `mocks/subConditions.json`, `mocks/criterionGroups.json`, `mocks/objectives.json`.
- Se agregó `CriterionGroup` como entidad de modelo (agrupación visual, no evaluable).
- Se separaron `Objective` y `ObjectiveResult` como tipos e interfaces distintas.
- Se agregó `EvaluationStatus` con `PENDING` explícitamente documentado como extensión de la app.
- `Scenario` pasa de "texto libre único" a campos estructurados (`practiceName`, `municipality`, `servicesToProvide`, `preparedBy`).

Toda la arquitectura previamente definida (React + TypeScript + Vite + Redux Toolkit + RTK Query + React Router, estructura de páginas, fases de implementación, criterios de calidad y restricciones de la sección 35) se mantiene sin cambios.
