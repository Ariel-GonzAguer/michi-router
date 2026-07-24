# Flujo de desarrollo — michi-router

## Resumen

Guía para desarrolladores que quieran contribuir o modificar la librería.

## Requisitos previos

| Herramienta | Versión mínima |
|-------------|----------------|
| Node.js | 20+ |
| pnpm | 9+ |
| npm (para publishing) | Latest |

## Setup

```bash
# Clonar el repo
git clone https://github.com/user/michi-router.git
cd michi-router

# Instalar dependencias
pnpm install

# Verificar que todo funciona
pnpm build:bundle
pnpm test
pnpm lint
```

## Flujo de desarrollo

```
1. Crear rama de feature
   git checkout -b feat/nombre-feature

2. Modificar código en src/

3. Ejecutar tests en watch mode
   pnpm test:watch

4. Verificar lint
   pnpm lint:fix

5. Formatear código
   pnpm format

6. Verificar bundle size
   pnpm build:bundle
   pnpm size:check

7. Commit con convención semántica
   git commit -m "feat: agregar nueva funcionalidad"

8. Push y crear PR
   git push origin feat/nombre-feature
```

## Convenciones de commits

Usar [Conventional Commits](https://www.conventionalcommits.org/):

| Prefijo | Uso |
|---------|-----|
| `feat:` | Nueva funcionalidad |
| `fix:` | Corrección de bug |
| `docs:` | Cambios en documentación |
| `style:` | Cambios de formato (no afectan lógica) |
| `refactor:` | Reestructuración sin cambio de funcionalidad |
| `test:` | Agregar o modificar tests |
| `chore:` | Tareas de mantenimiento (deps, config, etc.) |
| `perf:` | Mejoras de performance |

**Ejemplos:**
```bash
git commit -m "feat: agregar soporte para lazy loading"
git commit -m "fix: corregir match de wildcards anidados"
git commit -m "docs: actualizar README con ejemplos de Protected"
git commit -m "test: agregar tests para resolveInternalPath"
git commit -m "chore: actualizar typescript a 5.7.3"
```

## Estructura del código

```
src/
├── index.ts              ← Barrel exports (core + protected)
├── core.ts               ← Exports del router
├── protected.ts           ← Export de Protected
├── setupTests.ts          ← Setup de Vitest
└── michi-router/
    ├── Michi-router.tsx   ← RouterProvider, Link, hooks
    ├── path-utils.ts      ← Match de rutas, resolución de URLs
    ├── Protected.tsx      ← Guard de autenticación
    ├── types.ts           ← Interfaces TypeScript
    └── __tests__/
        ├── RouterProvider.test.tsx
        ├── Protected.test.tsx
        └── path-utils.test.ts
```

## Agregar una funcionalidad

### 1. Definir el tipo (si aplica)

Agregar en `src/michi-router/types.ts`:

```ts
export interface NuevaFeature {
  opcion1: string;
  opcion2?: boolean;
}
```

### 2. Implementar la lógica

Agregar en el archivo correspondiente (`Michi-router.tsx`, `path-utils.ts`, o `Protected.tsx`).

### 3. Exportar (si es necesario)

Si el tipo o función es público, agregar el export en el entry point correspondiente:

- `src/index.ts` — para exportar en el paquete completo
- `src/core.ts` — para exportar sin Protected
- `src/protected.ts` — para exportar solo Protected

### 4. Escribir tests

Crear o modificar archivos en `src/michi-router/__tests__/`.

### 5. Verificar

```bash
pnpm test              # Todos los tests pasan
pnpm lint              # No hay errores de lint
pnpm build:bundle      # Build exitoso
pnpm size:check        # Bundle dentro del budget
```

## Presupuestos de bundle

| Entry point | Límite gzip |
|-------------|-------------|
| `core` | 1800 bytes |
| `index` | 2300 bytes |

Si una funcionalidad nueva excede el budget, considerar:
- Moverla al entry point `protected` (no afecta los budgets principales)
- Hacerla tree-shakeable (que se pueda eliminar si no se usa)
- Optimizar el código

## Testing

Ver [development/testing.md](testing.md) para detalles completos.

```bash
pnpm test              # Ejecutar una vez
pnpm test:watch        # Watch mode
```

## Publicar cambios

Ver [deployment/platform.md](../deployment/platform.md) para el flujo de publishing.

```bash
pnpm release:patch     # Bug fixes
pnpm release:minor     # Nuevas funcionalidades backward-compatible
pnpm release:major     # Breaking changes
```

## Referencias

- [development/testing.md](testing.md) — Estrategia de tests
- [development/linting.md](linting.md) — Reglas de lint
- [deployment/platform.md](../deployment/platform.md) — Publishing
- [ci-cd/overview.md](../ci-cd/overview.md) — Pipeline de CI
