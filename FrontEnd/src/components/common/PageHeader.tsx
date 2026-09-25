import type { ReactNode } from 'react'

import { Breadcrumbs, type BreadcrumbItem } from '@/components/layout/Breadcrumbs'
import styles from './PageHeader.module.css'

interface PageHeaderProps {
  title: string
  eyebrow?: string
  description?: string
  breadcrumbs?: BreadcrumbItem[]
  actions?: ReactNode
}

/** Encabezado de página reutilizable: breadcrumbs + título + descripción opcional. */
export function PageHeader({ title, eyebrow, description, breadcrumbs, actions }: PageHeaderProps) {
  return (
    <header className={styles.header}>
      {breadcrumbs && <Breadcrumbs items={breadcrumbs} />}
      <div className={styles.titleRow}>
        {eyebrow && <span className={styles.eyebrow}>{eyebrow}</span>}
        <h1 className={styles.title}>{title}</h1>
        {actions}
      </div>
      {description && <p className={styles.description}>{description}</p>}
    </header>
  )
}
