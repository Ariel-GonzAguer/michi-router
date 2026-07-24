# Despliegue — michi-router

## Resumen

michi-router se despliega como paquete npm. No hay servidor, ni hosting, ni CDN propio. La distribución es via registry de npm.

## Plataforma

| Aspecto | Valor |
|---------|-------|
| Registry | npm (npmjs.com) |
| Paquete | `@arielgonzaguer/michi-router` |
| Visibilidad | Público (`--access public`) |
| Tipo | Librería (no app) |

## Exports map

El `package.json` define 3 entry points:

```json
{
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.mjs",
      "require": "./dist/index.js"
    },
    "./core": {
      "types": "./dist/core.d.ts",
      "import": "./dist/core.mjs",
      "require": "./dist/core.js"
    },
    "./protected": {
      "types": "./dist/protected.d.ts",
      "import": "./dist/protected.mjs",
      "require": "./dist/protected.js"
    }
  }
}
```

Esto permite:

```ts
// Import completo (router + Protected)
import { RouterProvider, Link, Protected } from '@arielgonzaguer/michi-router';

// Import solo del router (sin Protected, menor bundle)
import { RouterProvider, Link } from '@arielgonzaguer/michi-router/core';

// Import solo de Protected
import { Protected } from '@arielgonzaguer/michi-router/protected';
```

## Scripts de release

| Script | Qué hace |
|--------|----------|
| `release:patch` | `pnpm version patch && pnpm publish --access public && git push origin main --tags` |
| `release:minor` | `pnpm version minor && pnpm publish --access public && git push origin main --tags` |
| `release:major` | `pnpm version major && pnpm publish --access public && git push origin main --tags` |

**Flujo completo:**

```
1. pnpm release:patch
2. │
3. ├─→ pnpm version patch     (3.3.0 → 3.3.1)
4. │   └─→ Actualiza package.json
5. │
6. ├─→ prepublishOnly hook
7. │   ├─→ build:bundle (tsup → dist/)
8. │   ├─→ test (vitest → 24 tests)
9. │   └─→ size:check (verifica budgets)
10. │
11. ├─→ pnpm publish --access public
12. │   └─→ Sube paquete a npm registry
13. │
14. └─→ git push origin main --tags
15.     └─→ Pushea commit de version y tag
```

## publish.sh

Script bash alternativo que ejecuta el mismo flujo:

```bash
#!/bin/bash
set -e

pnpm run build:bundle
pnpm test
pnpm run size:check
npm publish --access public
```

## Documentación pública

La documentación de la librería está publicada en:
- **URL**: `https://michirouter.netlify.app/`
- **Plataforma**: Netlify
- **Nota**: La config de despliegue de esa documentación no está en este repo

## Variables de entorno

| Variable | Requerida | Propósito |
|----------|-----------|-----------|
| npm token | Sí (local) | Autenticación para `npm publish` |

**Setup:**
```bash
npm login              # Login interactivo
# o
npm set //registry.npmjs.org/:_authToken=TOKEN
```

## Troubleshooting

### `npm publish` falla con 403

**Causa**: No estás logueado en npm o el token expiró.

**Solución**:
```bash
npm login
# o regenerar token en npmjs.com → Access Tokens
```

### `prepublishOnly` falla

**Causa**: Tests o size check fallan antes de publicar.

**Solución**:
```bash
pnpm test              # Ver qué test falla
pnpm size:check        # Ver si el bundle excede el budget
pnpm build:bundle      # Verificar que el build funciona
```

### Tags no se pushean

**Causa**: No tienes permisos de push en la rama `main`.

**Solución**:
```bash
git push origin main --tags
# Si falla, verifica que tengas acceso al repo
```

## Referencias

- [ci-cd/overview.md](../ci-cd/overview.md) — Pipeline de CI
- [architecture/overview.md](../architecture/overview.md) — Entry points y budgets
- Archivo fuente: `package.json`
- Archivo fuente: `publish.sh`
