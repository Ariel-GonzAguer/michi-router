# Changelog

Todas lasnotas de cambios importantes a este proyecto seguiran el formato
[Keep a Changelog](https://keepachangelog.com/es/1.1.0/) y este proyecto
sigue [Semantic Versioning](https://semver.org/lang/es/).

## [3.1.0] - 23 de julio de 2026

### Agregado
- Configuracion de ESLint y Prettier para el proyecto
- Tests unitarios para `path-utils.ts` (24 tests nuevos)
- Skill `changelog-updater` para actualizacion automatica del changelog
- Politica de versiones soportadas en SECURITY.md

### Cambiado
- TypeScript actualizado de 4.9.5 a 5.7.3
- Scripts de build y release migrados de npm a pnpm
- `prepublish` renombrado a `prepublishOnly` (deprecated por npm)
- README actualizado con tabla de API completa, limitaciones y compatibilidad
- SECURITY.md actualizado con politica de versiones soportadas

### Corregido
- Eliminado `publish.sh` y `PUBLISH.md` del historial de git (archivos sensibles)
- `Protected.tsx`: fix para遵守 React hooks rules (useEffect condicional)

## [3.0.4] - 15 de enero de 2025

### Agregado
- Soporte para rutas dinamicas (`:param`)
- Soporte para wildcard routes (`*`)
- Componente `Protected` con redireccion segura
- Validacion de URLs internas
- Hooks: `useNavigate`, `useLocation`, `useParams`
- Soporte para `basename` en subrutas
- Bundle size budgets verificados

### Corregido
- Bloqueo de protocolos inseguros (`javascript:`, `data:`)
- Bloqueo de URLs externas en `Link` y `navigate`

## [3.0.3] - 10 de enero de 2025

### Corregido
- Mejoras en el manejo de errores de navegacion

## [3.0.2] - 5 de enero de 2025

### Corregido
- Fix en el manejo de basename vacio

## [3.0.1] - 1 de enero de 2025

### Corregido
- Correccion menor en tipos de TypeScript

## [3.0.0] - 20 de diciembre de 2024

### Agregado
- Nueva arquitectura basada en Context API
- Soporte para layout personalizado
- Validacion de URLs con `resolveInternalPath`

### Cambiado
- API completamente rediseñada
- Breaking change: imports desde `@arielgonzaguer/michi-router/core`

## [2.2.4] - 15 de diciembre de 2024

### Corregido
- Fix en navegacion con query strings

## [2.2.3] - 10 de diciembre de 2024

### Corregido
- Mejoras en el manejo de edge cases

## [2.1.2] - 5 de diciembre de 2024

### Agregado
- Soporte basico para rutas dinamicas

## [2.0.1] - 1 de diciembre de 2024

### Corregido
- Fix en el componente Link

## [2.0.0] - 25 de noviembre de 2024

### Agregado
- Publicacion inicial en npm
- Router minimalista para React
- Soporte para rutas estaticas
- Componente Link basico

## [1.3.0] - 20 de noviembre de 2024

### Agregado
- Primera version funcional
- Enrutamiento basico por paths

## [1.0.1] - 15 de noviembre de 2024

### Corregido
- Configuracion inicial del proyecto

## [1.0.0] - 10 de noviembre de 2024

### Agregado
- Inicializacion del proyecto
- Configuracion de TypeScript
- Setup de build con tsup
