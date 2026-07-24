# Seguridad — michi-router

## Resumen

michi-router implementa validación de URLs en 3 puntos: navegación (`navigate`), Links (`Link`) y autenticación (`Protected`). El objetivo es prevenir que la librería sea usada para navegar a URLs externas o ejecutar código inseguro.

## Medidas de seguridad

### 1. Bloqueo de protocolos inseguros

La constante `SAFE_PROTOCOLS` en `src/michi-router/path-utils.ts` define los únicos protocolos permitidos:

```ts
const SAFE_PROTOCOLS = new Set(['http:', 'https:']);
```

Cualquier URL con protocolo diferente (`javascript:`, `data:`, `ftp:`, etc.) es bloqueada y retorna `null` en `resolveInternalPath()`.

### 2. Bloqueo de URLs externas

`resolveInternalPath()` compara el hostname de la URL contra `FALLBACK_ORIGIN`. Si son diferentes, la URL se considera externa y se bloquea.

```ts
// URLs internas → permitidas
resolveInternalPath('/users/123', '/')
// → ResolvedInternalPath

// URLs externas → bloqueadas
resolveInternalPath('https://evil.com', '/')
// → null
```

### 3. Sanitización de redirectionPath en Protected

El componente `Protected` valida que `redirectionPath` sea una URL interna antes de redirigir:

```ts
// src/michi-router/Protected.tsx
const safePath = resolveInternalPath(redirectionPath, basename);
if (!safePath) {
  // No redirige, bloquea la navegación
  return;
}
navigate(safePath.fullPath, { replace: true });
```

### 4. Bloqueo en Link

El componente `Link` valida que `to` sea una URL interna. Si no lo es, pone `href="#"` y bloquea la navegación en `onClick`.

## Flujo de seguridad

```
 Usuario hace clic en Link o navigate() es llamado
                    │
                    ▼
         ┌─────────────────────┐
         │ resolveInternalPath  │
         │ (path-utils.ts)     │
         └──────────┬──────────┘
                    │
         ┌──────────▼──────────┐
         │ ¿Protocolo seguro?  │
         │ SAFE_PROTOCOLS      │
         │ ├── No → null       │
         │ └── Sí ↓            │
         └──────────┬──────────┘
                    │
         ┌──────────▼──────────┐
         │ ¿URL interna?       │
         │ hostname vs FALLBACK│
         │ ├── Externa → null  │
         │ └── Interna ↓       │
         └──────────┬──────────┘
                    │
         ┌──────────▼──────────┐
         │ ¿ basename matchea? │
         │ ├── Sí → strip      │
         │ └── No → join       │
         └──────────┬──────────┘
                    │
                    ▼
         ResolvedInternalPath
         (pathname, search, hash,
          fullPath, browserPath)
```

## Escenarios bloqueados

| Input | Razón del bloqueo |
|-------|-------------------|
| `javascript:alert(1)` | Protocolo inseguro |
| `data:text/html,...` | Protocolo inseguro |
| `https://evil.com` | URL externa |
| `//evil.com` | URL externa (protocol-relative) |
| `ftp://files.com` | Protocolo no permitido |

## SSR y seguridad

En SSR (servidor), `typeof window !== 'undefined'` es `false`, por lo que:
- `resolveInternalPath()` usa `FALLBACK_ORIGIN` como origin
- `navigate()` no hace nada
- No hay riesgo de ejecución de código del lado del servidor

## Limitaciones

- **No protege contra XSS en el contenido de las rutas** — si el usuario pasa `component={<XSSComponent />}`, la librería no valida eso
- **No valida el contenido de `params`** — los parámetros se pasan tal cual del URL
- **No hay CSP integration** — la librería no configura Content Security Policy
- **No hay rate limiting** — la navegación es instantánea, sin throttling

## SECURITY.md del proyecto

El archivo `SECURITY.md` en la raíz documenta estas medidas y está destinado a consumidores de la librería.

## Referencias

- [components/overview.md](../components/overview.md) — Protected y Link
- [utils/overview.md](../utils/overview.md) — resolveInternalPath, SAFE_PROTOCOLS
- [architecture/routing.md](../architecture/routing.md) — Flujo de navegación
- Archivo fuente: `src/michi-router/path-utils.ts`
- Archivo fuente: `src/michi-router/Protected.tsx`
- Archivo fuente: `SECURITY.md`
