import { EmptyState } from '@/components/feedback/EmptyState'
import { ErrorState } from '@/components/feedback/ErrorState'
import { LoadingState } from '@/components/feedback/LoadingState'
import { PageHeader } from '@/components/common/PageHeader'
import { ConditionListItem } from '@/features/tableOfContents/components/ConditionListItem'
import { ContinueEvaluationAction } from '@/features/tableOfContents/components/ContinueEvaluationAction'
import { ScenarioSummaryCard } from '@/features/tableOfContents/components/ScenarioSummaryCard'
import { useScenarioSummary } from '@/features/dashboard/hooks/useScenarioSummary'
import { findContinueEvaluationTarget } from '@/features/dashboard/utils/findContinueEvaluationTarget'
import { useActiveScenario } from '@/features/evaluation/hooks/useActiveScenario'
import {
  useGetConditionsQuery,
  useGetCriteriaQuery,
  useGetSubConditionsQuery,
} from '@/services/api'
import styles from './TableOfContentsPage.module.css'

/**
 * Índice de navegación (docs/PROMPT.md §19). Los conteos por condición son
 * puramente estructurales (longitud de arreglos ya filtrados) — no incluyen
 * porcentaje de cumplimiento ni estado.
 *
 * El indicador de progreso por condición (Fase 9/11) y la acción "Continuar
 * evaluación" (Fase 11 §19) vienen de `useScenarioSummary` — son un realce
 * PROGRESIVO: si todavía no está listo, la fila/acción simplemente no se
 * muestra, sin bloquear ni romper la navegación existente (que sigue
 * funcionando con las consultas estructurales de siempre, sin depender del
 * resumen calculado).
 */
export function TableOfContentsPage() {
  const { scenario, isLoading: isScenarioLoading, error: scenarioError } = useActiveScenario()
  const conditionsQuery = useGetConditionsQuery()
  const subConditionsQuery = useGetSubConditionsQuery()
  const criteriaQuery = useGetCriteriaQuery()
  const summary = useScenarioSummary(scenario)

  const continueTarget = summary.data
    ? findContinueEvaluationTarget(summary.data.conditionResults)
    : undefined

  const isLoading =
    isScenarioLoading || conditionsQuery.isLoading || subConditionsQuery.isLoading || criteriaQuery.isLoading

  const error = scenarioError ?? conditionsQuery.error ?? subConditionsQuery.error ?? criteriaQuery.error

  const conditions = conditionsQuery.data
  const subConditions = subConditionsQuery.data
  const criteria = criteriaQuery.data

  return (
    <div className={styles.page}>
      <PageHeader
        eyebrow="Índice"
        title="Tabla de contenido"
        description="Estructura completa de la autoevaluación: escenario, condiciones y criterios definidos en el modelo de docencia servicio."
        breadcrumbs={[{ label: 'Dashboard', to: '/dashboard' }, { label: 'Tabla de contenido' }]}
      />

      {isLoading && <LoadingState label="Cargando la tabla de contenido…" />}
      {!isLoading && error && <ErrorState error={error} title="No se pudo cargar la tabla de contenido" />}

      {!isLoading && !error && scenario && (
        <section aria-label="Escenario de práctica">
          <ScenarioSummaryCard scenario={scenario} />
        </section>
      )}

      {!isLoading && !error && continueTarget && (
        <ContinueEvaluationAction
          to={continueTarget.type === 'condition' ? `/conditions/${continueTarget.conditionId}` : '/summary'}
          label={continueTarget.type === 'condition' ? 'Continuar evaluación →' : 'Ver consolidado →'}
        />
      )}

      {!isLoading && !error && !scenario && (
        <EmptyState message="Todavía no hay ningún escenario de práctica registrado." />
      )}

      {!isLoading && !error && conditions && subConditions && criteria && (
        <section aria-label="Condiciones de calidad">
          <h2 className="section-title">Condiciones</h2>
          {conditions.length === 0 ? (
            <EmptyState message="Todavía no hay condiciones definidas." />
          ) : (
            <ul className={styles.list}>
              {[...conditions]
                .sort((a, b) => a.order - b.order)
                .map((condition) => {
                  const subConditionIds = subConditions
                    .filter((sc) => sc.conditionId === condition.id)
                    .map((sc) => sc.id)
                  const criterionCount = criteria.filter((c) =>
                    subConditionIds.includes(c.subConditionId),
                  ).length
                  const conditionResult = summary.data?.conditionResults.find(
                    (entry) => entry.condition.id === condition.id,
                  )

                  return (
                    <li key={condition.id}>
                      <ConditionListItem
                        condition={condition}
                        subConditionCount={subConditionIds.length}
                        criterionCount={criterionCount}
                        {...(conditionResult ? { conditionResult } : {})}
                      />
                    </li>
                  )
                })}
            </ul>
          )}
        </section>
      )}
    </div>
  )
}
