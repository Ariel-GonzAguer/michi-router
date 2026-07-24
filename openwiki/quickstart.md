# Quickstart — michi-router

Router minimalista para React. Zero dependencias de runtime, ~370 líneas de código fuente.

## Stack

- **Runtime**: React >=17 (peer dependency, no incluido)
- **Lenguaje**: TypeScript 5.7.3
- **Bundler**: tsup 8.5.0 (esbuild)
- **Tests**: Vitest 4.1.8 + jsdom + testing-library
- **Package manager**: pnpm
- **CI**: GitHub Actions (build + test + size check)

## Instalación

```bash
pnpm add @arielgonzaguer/michi-router
```

## Uso básico

```tsx
import { RouterProvider, Link } from '@arielgonzaguer/michi-router';

const Home = () => <h1>Inicio</h1>;
const About = () => <h1>Acerca de</h1>;

function App() {
  return (
    <RouterProvider
      routes={[
        { path: '/', component: <Home /> },
        { path: '/about', component: <About /> },
      ]}
    >
      <nav>
        <Link to="/">Inicio</Link>
        <Link to="/about">Acerca de</Link>
      </nav>
    </RouterProvider>
  );
}
```

## Entry points del paquete

| Import | Contenido | Bundle gzip |
|--------|-----------|-------------|
| `@arielgonzaguer/michi-router` | Router + Protected | < 2300 bytes |
| `@arielgonzaguer/michi-router/core` | Solo router (sin Protected) | < 1800 bytes |
| `@arielgonzaguer/michi-router/protected` | Solo Protected | — |

## Mapa de la wiki

### Arquitectura

| Documento | Descripción |
|-----------|-------------|
| [architecture/overview.md](architecture/overview.md) | Stack, entry points, diagrama de capas |
| [architecture/routing.md](architecture/routing.md) | Sistema de rutas: match, params, wildcards, basename |

### Componentes

| Documento | Descripción |
|-----------|-------------|
| [components/overview.md](components/overview.md) | RouterProvider, Link, Protected con props completas |

### Utilidades

| Documento | Descripción |
|-----------|-------------|
| [utils/overview.md](utils/overview.md) | path-utils, types, constantes del proyecto |

### Seguridad

| Documento | Descripción |
|-----------|-------------|
| [security/implementation.md](security/implementation.md) | Bloqueo de protocolos inseguros, validación de URLs |

### CI/CD

| Documento | Descripción |
|-----------|-------------|
| [ci-cd/overview.md](ci-cd/overview.md) | GitHub Actions, size budgets, scripts de CI |

### Despliegue

| Documento | Descripción |
|-----------|-------------|
| [deployment/platform.md](deployment/platform.md) | npm publishing, scripts de release, exports map |

### Desarrollo

| Documento | Descripción |
|-----------|-------------|
| [development/testing.md](development/testing.md) | Vitest, testing-library, setup de tests |
| [development/linting.md](development/linting.md) | ESLint flat config, Prettier |
| [development/workflow.md](development/workflow.md) | Flujo de desarrollo, convenciones |

## Scripts disponibles

| Script | Comando | Cuándo usarlo |
|--------|---------|---------------|
| `build` | `pnpm build` | Compilar TypeScript |
| `build:bundle` | `pnpm build:bundle` | Generar bundles ESM/CJS con tsup |
| `test` | `pnpm test` | Ejecutar tests (una vez) |
| `test:watch` | `pnpm test:watch` | Ejecutar tests en watch mode |
| `lint` | `pnpm lint` | Verificar código con ESLint |
| `lint:fix` | `pnpm lint:fix` | Auto-corregir problemas de lint |
| `format` | `pnpm format` | Formatear con Prettier |
| `size:check` | `pnpm size:check` | Verificar presupuestos de bundle size |
| `release:patch` | `pnpm release:patch` | Publicar patch version |
| `release:minor` | `pnpm release:minor` | Publicar minor version |
| `release:major` | `pnpm release:major` | Publicar major version |
