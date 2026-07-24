# Testing — michi-router

## Resumen

El proyecto usa Vitest como test runner con jsdom como ambiente DOM y testing-library para tests de componentes React. Hay 24 tests en 3 archivos.

## Stack de testing

| Paquete | Versión | Propósito |
|---------|---------|-----------|
| `vitest` | 4.1.8 | Test runner |
| `jsdom` | 26.1.0 | Ambiente DOM en Node |
| `@testing-library/react` | 14.0.0 | Rendering y queries de componentes |
| `@testing-library/jest-dom` | 6.0.0 | Matchers de DOM (`toBeInTheDocument`, etc.) |
| `@swc/core` | 1.13.5 | Compilador para transformar JSX en tests |

## Configuración

### `vitest.config.ts`

```ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
  },
});
```

- **`environment: 'jsdom'`** — Provee APIs de DOM (`document`, `window`, `navigator`)
- **`globals: true`** — Permite usar `describe`, `it`, `expect` sin importar

### `src/setupTests.ts`

```ts
import '@testing-library/jest-dom';
```

Extiende los matchers de Vitest con matchers de testing-library:
- `toBeInTheDocument()`
- `toHaveAttribute()`
- `toHaveClass()`
- etc.

## Archivos de test

| Archivo | Tests | Qué cubre |
|---------|-------|-----------|
| `src/michi-router/__tests__/path-utils.test.ts` | 14 | Funciones de path-utils |
| `src/michi-router/__tests__/Protected.test.tsx` | 5 | Componente Protected |
| `src/michi-router/__tests__/RouterProvider.test.tsx` | 5 | RouterProvider, Link, hooks |

### path-utils.test.ts (14 tests)

| Test | Qué verifica |
|------|-------------|
| `normalizePathname` | Agrega `/` al inicio, remueve `/` al final |
| `normalizeBasename` | Retorna `/` por defecto, normaliza prefijos |
| `resolveInternalPath` | URLs internas permitidas, externas bloqueadas, protocolos inseguros bloqueados |
| `matchRoutePath` | Rutas estáticas, dinámicas (`:param`), wildcard (`*`), catch-all |

### Protected.test.tsx (5 tests)

| Test | Qué verifica |
|------|-------------|
| Loading state | Muestra `loadingComponent` cuando `isLoading=true` |
| Redirect | Redirige a `redirectionPath` cuando no hay user |
| Render children | Renderiza children cuando hay user |
| defaultMessage | Muestra texto alternativo durante loading |
| Invalid config | No redirige si `redirectionPath` es insegura |

### RouterProvider.test.tsx (5 tests)

| Test | Qué verifica |
|------|-------------|
| Dynamic params | Extrae `:id` del URL |
| Wildcard | Captura `*` correctamente |
| Basename | Maneja subrutas correctamente |
| Location | `useLocation` retorna datos correctos |
| Security | Bloquea navegación a URLs externas |

## Scripts

| Script | Comando | Propósito |
|--------|---------|-----------|
| `test` | `pnpm test` | Ejecutar tests una vez (`vitest --run`) |
| `test:watch` | `pnpm test:watch` | Ejecutar tests en watch mode (`vitest --watch`) |

## Ejecución

```bash
# Ejecutar todos los tests
pnpm test

# Watch mode (re-ejecuta al guardar archivos)
pnpm test:watch

# Ejecutar un archivo específico
pnpm vitest --run src/michi-router/__tests__/path-utils.test.ts

# Coverage (no está configurado pero se puede agregar)
pnpm vitest --run --coverage
```

## Convenciones

- Los tests van en `src/michi-router/__tests__/`
- Nomenclatura: `NombreModulo.test.ts` (utils) o `NombreModulo.test.tsx` (componentes)
- Se usa `describe` para agrupar por función/componente
- Se usa `it` para tests individuales
- No hay mocking externo (no se mockean APIs del navegador)

## Coverage

No está configurado actualmente. Para agregarlo:

```ts
// vitest.config.ts
export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/michi-router/**'],
    },
  },
});
```

## Referencias

- [development/linting.md](linting.md) — Calidad de código
- [development/workflow.md](workflow.md) — Flujo de desarrollo
- [ci-cd/overview.md](../ci-cd/overview.md) — Tests en CI
- Archivo fuente: `vitest.config.ts`
- Archivo fuente: `src/setupTests.ts`
