# Autoevaluación de Escenarios de Práctica Formativa — Frontend

Frontend SPA para la "Autoevaluación para los Escenarios de Práctica Formativa en el marco de la relación Docencia Servicio". Especificación completa en [`../docs/PROMPT.md`](../docs/PROMPT.md); análisis funcional del Excel origen en [`../docs/FUNCTIONAL_ANALYSIS.md`](../docs/FUNCTIONAL_ANALYSIS.md).

## Estado actual del proyecto

**Fase 2 completada** (de 16 fases definidas en `docs/PROMPT.md` §37): proyecto React + TypeScript + Vite creado, con Redux Toolkit, RTK Query, React Router y estructura base de carpetas configurados.

Las páginas existentes son **placeholders** (aún no hay modelos de datos, mock data, ni lógica de negocio — eso corresponde a las Fases 3 a 16). No avanzar a fases posteriores sin aprobación explícita.

## Stack

- React 18 + TypeScript (estricto)
- Vite 7 (Rollup)
- React Router 7 (`createBrowserRouter`)
- Redux Toolkit + RTK Query
- ESLint (flat config) + typescript-eslint

## Requisitos

- Node.js 20.19+ o 22.12+ recomendado (el proyecto también compila y corre en Node 20.12.2, con una advertencia de versión no bloqueante).

## Scripts

```bash
npm install       # instalar dependencias
npm run dev       # servidor de desarrollo (http://localhost:5173)
npm run build     # type-check (tsc -b) + build de producción a dist/
npm run preview   # servir el build de producción localmente
npm run lint      # ESLint
npm run typecheck # solo type-check, sin emitir archivos
```

## Estructura de carpetas

Ver `docs/PROMPT.md` §4 para el detalle y la justificación de cada carpeta. Resumen:

```
src/
├── app/            store, router, providers globales
├── assets/
├── components/     common, layout, forms, tables, charts, feedback
├── features/       evaluation, conditions, criteria, dashboard, objectives, tableOfContents
├── pages/          Dashboard, TableOfContents, Condition, Summary, NotFound
├── services/api/   baseApi (RTK Query) + *Api.ts específicos (Fase 5)
├── domain/compliance/  funciones puras de cálculo (Fase 9+)
├── mocks/          JSON mock data (Fase 4)
├── hooks/
├── types/          modelos TypeScript (Fase 3)
├── utils/
└── styles/
```

## Variables de entorno

- `VITE_API_BASE_URL` (opcional): base URL para `fetchBaseQuery` en `services/api/baseApi.ts`. Sin definir, usa `/api`. Durante las Fases 4-5 esto se sustituye temporalmente por un `mockBaseQuery` que lee `mocks/*.json` (ver `docs/PROMPT.md` §8).
