/**
 * Declaración ambiental para importar archivos `*.module.css` (CSS Modules,
 * soportado nativamente por Vite) con tipado en vez de `any`.
 */
declare module '*.module.css' {
  const classes: { readonly [className: string]: string }
  export default classes
}
