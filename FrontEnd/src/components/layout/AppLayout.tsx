import { useEffect, useRef, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'

import { Header } from './Header'
import { Sidebar } from './Sidebar'
import styles from './AppLayout.module.css'

/**
 * Shell principal de la aplicación (docs/PROMPT.md §21): Sidebar + Header +
 * área de contenido. En pantallas angostas (<900px) el Sidebar se comporta
 * como un drawer superpuesto, controlado por el botón de menú del Header.
 */
export function AppLayout() {
  const [isSidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()
  const sidebarRef = useRef<HTMLDivElement>(null)
  const wasSidebarOpenRef = useRef(false)

  // Cierra el drawer automáticamente al navegar a otra ruta.
  useEffect(() => {
    setSidebarOpen(false)
  }, [location.pathname])

  // Permite cerrar el drawer con la tecla Escape (accesibilidad por teclado).
  useEffect(() => {
    if (!isSidebarOpen) return
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setSidebarOpen(false)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isSidebarOpen])

  // Fase 13 §19 (teclado): mueve el foco al abrir el drawer (al primer enlace
  // de navegación) y lo devuelve al botón de menú al cerrarlo — para que un
  // usuario de teclado no quede con el foco "perdido" en un elemento que el
  // fix de §19 (visibility, ver AppLayout.module.css) acaba de sacar del
  // árbol de accesibilidad.
  useEffect(() => {
    if (isSidebarOpen) {
      sidebarRef.current?.querySelector<HTMLElement>('a, button')?.focus()
    } else if (wasSidebarOpenRef.current) {
      document.getElementById('app-menu-button')?.focus()
    }
    wasSidebarOpenRef.current = isSidebarOpen
  }, [isSidebarOpen])

  return (
    <div className={styles.shell}>
      <a className="skip-link" href="#main-content">
        Saltar al contenido principal
      </a>

      {isSidebarOpen && (
        <button
          type="button"
          className={styles.backdrop}
          aria-label="Cerrar navegación"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div
        id="app-sidebar"
        ref={sidebarRef}
        className={`${styles.sidebarWrapper} ${isSidebarOpen ? styles.sidebarOpen : ''}`}
      >
        <Sidebar onNavigate={() => setSidebarOpen(false)} />
      </div>

      <div className={styles.mainColumn}>
        <Header isSidebarOpen={isSidebarOpen} onToggleSidebar={() => setSidebarOpen((v) => !v)} />
        <main id="main-content" className={styles.content} tabIndex={-1}>
          <div className={styles.contentInner}>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
