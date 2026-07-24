# Arquitectura — michi-router

## Resumen

michi-router es una librería npm que provee enrutamiento client-side para React. No tiene backend, ni base de datos, ni dependencias de runtime. Todo opera en el navegador via History API.

## Stack tecnológico

| Capa | Tecnología | Versión |
|------|-----------|---------|
| UI | React | >=17 (peer) |
| Lenguaje | TypeScript | 5.7.3 |
| Bundler | tsup (esbuild) | 8.5.0 |
| Tests | Vitest + jsdom | 4.1.8 |
| Lint | ESLint (flat config) | 10.7.0 |
| Format | Prettier | 3.9.6 |

## Entry points del paquete

El paquete expone 3 entry points via `exports` en `package.json`:

```
@arielgonzaguer/michi-router
├── src/index.ts           → RouterProvider, Link, hooks, Protected
├── src/core.ts            → RouterProvider, Link, hooks (sin Protected)
└── src/protected.ts       → Protected
```

| Import | Archivo fuente | Contenido |
|--------|---------------|-----------|
| `@arielgonzaguer/michi-router` | `src/index.ts` | Todo: router + Protected |
| `@arielgonzaguer/michi-router/core` | `src/core.ts` | Solo router (sin Protected) |
| `@arielgonzaguer/michi-router/protected` | `src/protected.ts` | Solo Protected |

Cada entry point genera 3 archivos en `dist/`:
- `.mjs` (ESM)
- `.js` (CJS)
- `.d.ts` / `.d.mts` (tipos)

## Diagrama de capas

```
┌─────────────────────────────────────────────────┐
│                  Consumidor                      │
│          (app React del usuario)                 │
└────────────────────┬────────────────────────────┘
                     │ import
┌────────────────────▼────────────────────────────┐
│              Entry Points                        │
│  index.ts │ core.ts │ protected.ts               │
└────────────────────┬────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────┐
│              Módulos internos                    │
│                                                  │
│  ┌──────────────┐  ┌──────────────┐             │
│  │ Michi-router │  │  Protected   │             │
│  │  (Router +   │  │  (Auth guard │             │
│  │   Link +     │  │   genérico)  │             │
│  │   hooks)     │  │              │             │
│  └──────┬───────┘  └──────────────┘             │
│         │                                        │
│  ┌──────▼───────┐  ┌──────────────┐             │
│  │  path-utils  │  │    types     │             │
│  │  (match,     │  │  (interfaces │             │
│  │   resolve)   │  │   TypeScript)│             │
│  └──────────────┘  └──────────────┘             │
└─────────────────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────┐
│            Browser APIs                         │
│  history.pushState │ history.replaceState        │
│  popstate event    │ URL / Location              │
└─────────────────────────────────────────────────┘
```

## Dependencias

| Tipo | Paquete | Versión | Propósito |
|------|---------|---------|-----------|
| peer | `react` | >=17.0.0 | Renderizado de componentes |
| dev | `typescript` | 5.7.3 | Type checking |
| dev | `tsup` | 8.5.0 | Bundling |
| dev | `vitest` | 4.1.8 | Tests |
| dev | `@testing-library/react` | 14.0.0 | Tests de componentes |
| dev | `@testing-library/jest-dom` | 6.0.0 | Matchers de DOM |
| dev | `jsdom` | 26.1.0 | Ambiente DOM para tests |
| dev | `eslint` | 10.7.0 | Lint |
| dev | `prettier` | 3.9.6 | Formateo |

**Zero dependencias de runtime.** El paquete no incluye ninguna librería externa en el bundle final.

## Presupuestos de bundle

| Entry point | Archivo | Límite gzip |
|-------------|---------|-------------|
| `core` | `dist/core.mjs` | 1800 bytes |
| `index` | `dist/index.mjs` | 2300 bytes |

Verificados automáticamente por `scripts/check-size.js` en CI.

## Referencias

- [architecture/routing.md](routing.md) — Sistema de rutas
- [components/overview.md](../components/overview.md) — Componentes
- [utils/overview.md](../utils/overview.md) — Utilidades
- [ci-cd/overview.md](../ci-cd/overview.md) — Pipeline CI
- Archivo fuente: `src/index.ts`
