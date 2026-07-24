# Plan de documentación — michi-router

## Información del proyecto

| Campo | Valor |
|-------|-------|
| Nombre | `@arielgonzaguer/michi-router` |
| Versión | 3.3.0 |
| Tipo | Librería npm (no app) |
| Stack | React 17+ / TypeScript 5.7 / tsup / Vitest |
| Dependencias runtime | 0 (solo peer: react) |
| Tests | 24 tests en 3 archivos |

## Estructura de la wiki

```
openwiki/
├── _plan.md                          ← Este archivo
├── quickstart.md                     ← Punto de entrada
├── .last-update.json                 ← Metadata
├── architecture/
│   ├── overview.md                   ← Stack, entry points, diagrama de capas
│   └── routing.md                    ← Sistema de rutas: match, params, wildcards
├── components/
│   └── overview.md                   ← RouterProvider, Link, Protected
├── utils/
│   └── overview.md                   ← path-utils, types, constantes
├── security/
│   └── implementation.md             ← Bloqueo de protocolos, validación de URLs
├── ci-cd/
│   └── overview.md                   ← GitHub Actions, size budgets
├── deployment/
│   └── platform.md                   ← npm publishing, scripts de release
└── development/
    ├── testing.md                    ← Vitest, testing-library, setup
    ├── linting.md                    ← ESLint flat config, Prettier
    └── workflow.md                   ← Flujo de desarrollo y contribución
```

## Archivos a crear

| # | Archivo | Contenido principal |
|---|---------|-------------------|
| 1 | `quickstart.md` | Stack, instalación, uso básico, mapa de la wiki |
| 2 | `architecture/overview.md` | Entry points, dependencias, diagrama de arquitectura |
| 3 | `architecture/routing.md` | Rutas estáticas/dinámicas/wildcard, matchRoutePath, basename |
| 4 | `components/overview.md` | RouterProvider, Link, Protected con props completas |
| 5 | `utils/overview.md` | path-utils (5 funciones), types (12 tipos), constantes |
| 6 | `security/implementation.md` | SAFE_PROTOCOLS, resolveInternalPath, Protected security |
| 7 | `ci-cd/overview.md` | ci.yml, check-size.js, budgets gzip |
| 8 | `deployment/platform.md` | npm scripts, publish.sh, exports map |
| 9 | `development/testing.md` | Vitest config, setup, cobertura de tests |
| 10 | `development/linting.md` | ESLint flat config, reglas, Prettier |
| 11 | `development/workflow.md` | Flujo de desarrollo, convenciones de commits |
| 12 | `.last-update.json` | Metadata de actualización |

## Nivel de detalle

**Intermedio** — Tablas de funciones/props, flujos con diagramas ASCII, ejemplos de código reales del proyecto.
