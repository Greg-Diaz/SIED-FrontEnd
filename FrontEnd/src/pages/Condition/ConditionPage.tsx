import { useMemo } from 'react'
import { useParams } from 'react-router-dom'

import { EmptyState } from '@/components/feedback/EmptyState'
import { ErrorState } from '@/components/feedback/ErrorState'
import { LoadingState } from '@/components/feedback/LoadingState'
import { NotFoundState } from '@/components/feedback/NotFoundState'
import { PageHeader } from '@/components/common/PageHeader'
import { ObjectiveResultCard } from '@/components/results/ObjectiveResultCard'
import { ProgressOverview } from '@/components/results/ProgressOverview'
import { ConditionNavigationFooter } from '@/features/conditions/components/ConditionNavigationFooter'
import { SubConditionResultSummary } from '@/features/conditions/components/SubConditionResultSummary'
import { SubConditionSection } from '@/features/conditions/components/SubConditionSection'
import { getAdjacentConditions, type AdjacentConditions } from '@/features/conditions/utils/getAdjacentConditions'
import type { ConditionResultEntry } from '@/features/dashboard/types'
import { useScenarioSummary } from '@/features/dashboard/hooks/useScenarioSummary'
import { EvaluationDirtyProvider } from '@/features/evaluation/context/EvaluationDirtyProvider'
import { useHasUnsavedEvaluations } from '@/features/evaluation/context/evaluationDirtyContext'
import { useActiveScenario } from '@/features/evaluation/hooks/useActiveScenario'
import { useUnsavedChangesGuard } from '@/features/evaluation/hooks/useUnsavedChangesGuard'
import {
  useGetConditionByIdQuery,
  useGetConditionsQuery,
  useGetEvaluationsByScenarioQuery,
  useGetSubConditionsByConditionQuery,
} from '@/services/api'
import type { Condition, ConditionCode, Evaluation, SubCondition } from '@/types'
import { getApiErrorMessage } from '@/utils/getApiErrorMessage'
import styles from './ConditionPage.module.css'

/**
 * Página de detalle de una condición (Fase 6: estructura de solo lectura;
 * Fase 7: formulario de evaluación; Fase 9: resultado calculado; Fase 11: UX
 * — progreso arriba, navegación anterior/siguiente, aviso de cambios sin
 * guardar). `conditionId` llega como `string` crudo desde la URL; se pasa
 * tal cual al Mock API, que valida en runtime si corresponde a una de las 7
 * condiciones reales y responde 404 en caso contrario (ver `NotFoundState`
 * más abajo).
 *
 * Las evaluaciones del escenario se consultan UNA sola vez aquí
 * (`getEvaluationsByScenario`) y se reparten hacia abajo como un mapa
 * `criterionId -> Evaluation` para el formulario de evaluación (Fase 7). El
 * RESULTADO calculado (Fase 9) se obtiene por separado vía
 * `useScenarioSummary` — que internamente reutiliza la MISMA consulta de
 * evaluaciones (RTK Query la deduplica: no genera una segunda petición de
 * red), solo que además ejecuta `domain/compliance/` sobre ella.
 *
 * `useGetConditionsQuery` (Fase 11 §4) trae la lista completa de las 7
 * condiciones para calcular anterior/siguiente — es la MISMA consulta que ya
 * usan `Sidebar`/`TableOfContentsPage`, así que en la práctica ya está en el
 * cache de RTK Query al llegar aquí (no agrega una petición de red nueva en
 * el flujo normal de navegación).
 */
export function ConditionPage() {
  const { conditionId } = useParams<{ conditionId: string }>()

  const conditionQuery = useGetConditionByIdQuery((conditionId ?? '') as ConditionCode, {
    skip: !conditionId,
  })
  const subConditionsQuery = useGetSubConditionsByConditionQuery((conditionId ?? '') as ConditionCode, {
    skip: !conditionId,
  })
  const conditionsQuery = useGetConditionsQuery()
  const { scenario, scenarioId, isLoading: isScenarioLoading, error: scenarioError } = useActiveScenario()
  const evaluationsQuery = useGetEvaluationsByScenarioQuery(scenarioId ?? '', {
    skip: !scenarioId,
  })
  const summary = useScenarioSummary(scenario)

  const evaluationsByCriterionId = useMemo(() => {
    const map = new Map<string, Evaluation>()
    for (const evaluation of evaluationsQuery.data ?? []) {
      map.set(evaluation.criterionId, evaluation)
    }
    return map
  }, [evaluationsQuery.data])

  if (!conditionId) {
    return (
      <NotFoundState
        resourceLabel="la condición"
        backTo="/table-of-contents"
        backLabel="Volver a la tabla de contenido"
      />
    )
  }

  const isLoading =
    conditionQuery.isLoading ||
    subConditionsQuery.isLoading ||
    isScenarioLoading ||
    evaluationsQuery.isLoading ||
    summary.isLoading
  const conditionErrorInfo = conditionQuery.error ? getApiErrorMessage(conditionQuery.error) : undefined

  if (!isLoading && conditionErrorInfo?.status === 404) {
    return (
      <NotFoundState
        resourceLabel="la condición"
        backTo="/table-of-contents"
        backLabel="Volver a la tabla de contenido"
        message={`No existe ninguna condición con el código "${conditionId}".`}
      />
    )
  }

  const error =
    conditionQuery.error ?? subConditionsQuery.error ?? scenarioError ?? evaluationsQuery.error ?? summary.error
  const condition = conditionQuery.data
  const subConditions = subConditionsQuery.data
  const conditionResult = summary.data?.conditionResults.find((entry) => entry.condition.id === conditionId)
  const adjacent = conditionsQuery.data ? getAdjacentConditions(conditionsQuery.data, conditionId) : undefined

  // El `EvaluationDirtyProvider` envuelve TODO el árbol (criterios +
  // navegación): cada `EvaluationForm` reporta su propio `isDirty` hacia
  // arriba (Fase 11 §10), y `ConditionPageBody` — un componente DISTINTO,
  // descendiente del provider — es quien lee el agregado
  // (`useHasUnsavedEvaluations`) para decidir si bloquea la navegación.
  return (
    <EvaluationDirtyProvider>
      <ConditionPageBody
        conditionId={conditionId}
        condition={condition}
        isLoading={isLoading}
        error={error}
        scenarioId={scenarioId}
        subConditions={subConditions}
        evaluationsByCriterionId={evaluationsByCriterionId}
        conditionResult={conditionResult}
        adjacent={adjacent}
      />
    </EvaluationDirtyProvider>
  )
}

interface ConditionPageBodyProps {
  conditionId: string
  condition: Condition | undefined
  isLoading: boolean
  error: unknown
  scenarioId: string | undefined
  subConditions: SubCondition[] | undefined
  evaluationsByCriterionId: ReadonlyMap<string, Evaluation>
  conditionResult: ConditionResultEntry | undefined
  adjacent: AdjacentConditions | undefined
}

function ConditionPageBody({
  conditionId,
  condition,
  isLoading,
  error,
  scenarioId,
  subConditions,
  evaluationsByCriterionId,
  conditionResult,
  adjacent,
}: ConditionPageBodyProps) {
  const hasUnsavedChanges = useHasUnsavedEvaluations()
  const blocker = useUnsavedChangesGuard(hasUnsavedChanges)

  return (
    <div>
      <PageHeader
        {...(condition ? { eyebrow: condition.id } : {})}
        title={isLoading ? 'Cargando condición…' : (condition?.name ?? 'Condición')}
        breadcrumbs={[
          { label: 'Dashboard', to: '/dashboard' },
          { label: 'Tabla de contenido', to: '/table-of-contents' },
          { label: condition?.name ?? conditionId },
        ]}
      />

      {/* Fase 11 §10: confirmación antes de perder cambios sin guardar — se
          muestra al intentar navegar (otro Link, atrás del navegador) mientras
          `useUnsavedChangesGuard` mantiene la navegación en pausa. */}
      {blocker.state === 'blocked' && (
        <div className={styles.unsavedGuard} role="alertdialog" aria-label="Cambios sin guardar">
          <p className={styles.unsavedGuardMessage}>
            Tienes cambios sin guardar en esta condición. Si continúas, se perderán.
          </p>
          <div className={styles.unsavedGuardActions}>
            <button type="button" className={styles.unsavedGuardStay} onClick={() => blocker.reset()}>
              Seguir editando
            </button>
            <button type="button" className={styles.unsavedGuardLeave} onClick={() => blocker.proceed()}>
              Salir sin guardar
            </button>
          </div>
        </div>
      )}

      {isLoading && <LoadingState label="Cargando condición…" />}
      {!isLoading && Boolean(error) && <ErrorState error={error} title="No se pudo cargar la condición" />}

      {!isLoading && !error && !scenarioId && (
        <EmptyState message="No hay ningún escenario de práctica registrado para evaluar." />
      )}

      {/* Progreso arriba de todo (Fase 11 §1, §12): el usuario ve "cuánto he
          completado" ANTES de desplazarse por los criterios, sin esperar a
          llegar a la sección "Resultado" del final. Usa `progress` (nunca
          `compliancePercentage`, §13) — es el MISMO `ProgressOverview` del
          Dashboard (Fase 10), reutilizado con otro título. */}
      {!isLoading && !error && conditionResult && (
        <div className={styles.topProgress}>
          <ProgressOverview progress={conditionResult.progress} title="Progreso de esta condición" />
        </div>
      )}

      {!isLoading && !error && scenarioId && subConditions && (
        <section aria-label="Criterios de la condición">
          {/* Fase 12 §14 (accesibilidad, "headings coherentes"): sin este <h2>
              los <h3> de `SubConditionSection` quedaban colgando directo bajo
              el <h1> de `PageHeader`, saltándose un nivel — bug evidente
              detectado en la auditoría, corregido aquí. */}
          <h2 className="section-title">Criterios</h2>
          <div className={styles.subConditions}>
            {subConditions.length === 0 ? (
              <EmptyState message="Esta condición todavía no tiene subcondiciones definidas." />
            ) : (
              [...subConditions]
                .sort((a, b) => a.order - b.order)
                .map((subCondition) => (
                  <SubConditionSection
                    key={subCondition.id}
                    subCondition={subCondition}
                    scenarioId={scenarioId}
                    evaluationsByCriterionId={evaluationsByCriterionId}
                  />
                ))
            )}
          </div>
        </section>
      )}

      {!isLoading && !error && conditionResult && (
        <section className={styles.resultSection} aria-label="Resultado de la condición">
          {/* Nota: NO se usa la clase global `section-title` aquí a propósito
              — `.resultSection` es un flex column con su propio `gap`, que ya
              separa el <h2> del resto; agregar además el `margin-bottom` de
              `section-title` duplicaría el espaciado (gap + margin). */}
          <h2 className={styles.resultTitle}>Resultado</h2>

          {/* Capacidad Instalada es la única condición con más de una
              subcondición: se muestra el desglose de 2.1 y 2.2 ANTES del
              resultado agregado de la condición completa. */}
          {conditionResult.subConditionResults.length > 1 && (
            <div className={styles.subConditionResults}>
              {conditionResult.subConditionResults.map((entry) => (
                <SubConditionResultSummary key={entry.subCondition.id} entry={entry} />
              ))}
            </div>
          )}

          <ObjectiveResultCard
            result={conditionResult.objectiveResult}
            progress={conditionResult.progress}
          />
        </section>
      )}

      {/* Navegación anterior/siguiente (Fase 11 §4, §5) — solo se muestra
          cuando `conditionId` es reconocible dentro de la lista completa de
          condiciones (evita mostrar una navegación incorrecta mientras esa
          lista todavía está cargando). */}
      {!isLoading && !error && adjacent?.isKnownCondition && (
        <ConditionNavigationFooter
          {...(adjacent.previous ? { previousCondition: adjacent.previous } : {})}
          {...(adjacent.next ? { nextCondition: adjacent.next } : {})}
        />
      )}
    </div>
  )
}
