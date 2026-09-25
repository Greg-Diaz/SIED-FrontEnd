import { createBrowserRouter, Navigate } from 'react-router-dom'

import { AppLayout } from '@/components/layout/AppLayout'
import { ConditionPage } from '@/pages/Condition/ConditionPage'
import { DashboardPage } from '@/pages/Dashboard/DashboardPage'
import { NotFoundPage } from '@/pages/NotFound/NotFoundPage'
import { SummaryPage } from '@/pages/Summary/SummaryPage'
import { TableOfContentsPage } from '@/pages/TableOfContents/TableOfContentsPage'

/**
 * Rutas mínimas de PROMPT.md §20. El contenido de cada página se completa
 * en fases posteriores; esta Fase 2 solo garantiza que la navegación resuelve.
 */
export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: 'dashboard', element: <DashboardPage /> },
      { path: 'table-of-contents', element: <TableOfContentsPage /> },
      { path: 'conditions/:conditionId', element: <ConditionPage /> },
      { path: 'conditions/:conditionId/criteria', element: <ConditionPage /> },
      { path: 'summary', element: <SummaryPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])
