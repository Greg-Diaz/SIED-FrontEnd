import { NotFoundState } from '@/components/feedback/NotFoundState'
import { PageHeader } from '@/components/common/PageHeader'

export function NotFoundPage() {
  return (
    <div>
      <PageHeader eyebrow="404" title="Página no encontrada" />
      <NotFoundState
        resourceLabel="la página"
        backTo="/dashboard"
        backLabel="Volver al dashboard"
        message="La dirección a la que intentaste acceder no existe o fue movida."
      />
    </div>
  )
}
