# CI/CD — michi-router

## Resumen

El proyecto usa GitHub Actions para CI y scripts de pnpm para publishing. No hay CD automatizado a producción (el publishing es manual via `release:*` scripts).

## Pipeline de CI

### Workflow: CI (`.github/workflows/ci.yml`)

**Triggers:**

| Evento | Condición |
|--------|-----------|
| `push` | Solo rama `main` |
| `pull_request` | Cualquier PR |

**Jobs (2, corren en paralelo):**

| Job | Runner | Propósito |
|-----|--------|-----------|
| `lint` | `ubuntu-latest` | Lint + format check |
| `test` | `ubuntu-latest` | Build + tests + size check |

**Job `lint`:**

| # | Step | Comando | Descripción |
|---|------|---------|-------------|
| 1 | Checkout | `actions/checkout@v7` | Clona el repositorio |
| 2 | Setup pnpm | `pnpm/action-setup@v6` | Instala pnpm 10 |
| 3 | Setup Node | `actions/setup-node@v7` | Instala Node 22, cache con pnpm |
| 4 | Install | `pnpm install --frozen-lockfile` | Instala dependencias |
| 5 | Lint | `pnpm run lint` | ESLint flat config |
| 6 | Format check | `pnpm run format:check` | Verifica formateo Prettier |

**Job `test`:**

| # | Step | Comando | Descripción |
|---|------|---------|-------------|
| 1 | Checkout | `actions/checkout@v7` | Clona el repositorio |
| 2 | Setup pnpm | `pnpm/action-setup@v6` | Instala pnpm 10 |
| 3 | Setup Node | `actions/setup-node@v7` | Instala Node 22, cache con pnpm |
| 4 | Install | `pnpm install --frozen-lockfile` | Instala dependencias |
| 5 | Build | `pnpm run build:bundle` | Genera bundles ESM/CJS con tsup |
| 6 | Test | `pnpm test` | Ejecuta Vitest (24 tests) |
| 7 | Size check | `pnpm run size:check` | Verifica presupuestos de bundle |

**Diagrama de ejecución:**

```
push a main / PR
  ├─→ lint (ubuntu-latest)    ← paralelo
  │     ├─→ checkout (v7)
  │     ├─→ setup pnpm (v6)
  │     ├─→ setup node 22 (v7)
  │     ├─→ pnpm install --frozen-lockfile
  │     ├─→ lint (eslint)
  │     └─→ format:check (prettier)
  │
  └─→ test (ubuntu-latest)    ← paralelo
        ├─→ checkout (v7)
        ├─→ setup pnpm (v6)
        ├─→ setup node 22 (v7)
        ├─→ pnpm install --frozen-lockfile
        ├─→ build:bundle (tsup)
        ├─→ test (vitest)
        └─→ size:check
```

### Size Budgets

El script `scripts/check-size.js` verifica que los bundles no excedan:

| Entry point | Archivo | Límite gzip |
|-------------|---------|-------------|
| `core` | `dist/core.mjs` | 1800 bytes |
| `index` | `dist/index.mjs` | 2300 bytes |

Si algún bundle excede el límite, el script falla con `exit(1)` y la CI se rompe.

## Publishing a npm

No hay CD automatizado. El publishing se hace manualmente via scripts en `package.json`:

| Script | Comando | Acción |
|--------|---------|--------|
| `release:patch` | `pnpm release:patch` | Versiona patch, publica en npm, pushea tags |
| `release:minor` | `pnpm release:minor` | Versiona minor, publica en npm, pushea tags |
| `release:major` | `pnpm release:major` | Versiona major, publica en npm, pushea tags |

**Flujo de publishing:**

```
pnpm release:patch
  ├─→ pnpm version patch    (actualiza package.json)
  ├─→ pnpm publish --access public  (publica en npm)
  └─→ git push origin main --tags   (pushea commit y tags)
```

**Precondiciones:**
- Estar logueado en npm (`npm login`)
- Estar en la rama `main`
- Los tests deben pasar (se ejecutan en `prepublishOnly`)

### Script publish.sh

Existe un `publish.sh` adicional que ejecuta:
1. `pnpm run build:bundle`
2. `pnpm test`
3. `pnpm run size:check`
4. `npm publish --access public`

## Secrets y variables

| Nombre | Tipo | Descripción |
|--------|------|-------------|
| — | — | No se usan secrets en la CI actual |

## Artefactos

| Artefacto | Generado por | Propósito |
|-----------|-------------|-----------|
| `dist/` | `build:bundle` | Bundles ESM, CJS y tipos |
| `.size-report.json` | `check-size.js` | Reporte de tamaño de bundles |

## Referencias

- [deployment/platform.md](../deployment/platform.md) — Detalles de npm publishing
- [development/testing.md](../development/testing.md) — Estrategia de tests
- [architecture/overview.md](../architecture/overview.md) — Stack y budgets
- Archivo fuente: `.github/workflows/ci.yml`
- Archivo fuente: `scripts/check-size.js`
