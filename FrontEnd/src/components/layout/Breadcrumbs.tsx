import { Link } from 'react-router-dom'

import styles from './Breadcrumbs.module.css'

export interface BreadcrumbItem {
  label: string
  to?: string
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
}

/**
 * Migas de pan puramente presentacionales (docs/PROMPT.md §21): cada página
 * calcula sus propios `items` a partir de los datos que ya obtuvo por RTK
 * Query, en vez de que este componente conozca las rutas de la aplicación.
 */
export function Breadcrumbs({ items }: BreadcrumbsProps) {
  if (items.length === 0) return null

  return (
    <nav aria-label="Ruta de navegación">
      <ol className={styles.list}>
        {items.map((item, index) => {
          const isLast = index === items.length - 1
          return (
            <li key={`${item.label}-${index}`} className={styles.item}>
              {item.to && !isLast ? (
                <Link className={styles.link} to={item.to}>
                  {item.label}
                </Link>
              ) : (
                <span className={styles.current} aria-current={isLast ? 'page' : undefined}>
                  {item.label}
                </span>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
