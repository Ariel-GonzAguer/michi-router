# Utilidades — michi-router

## Resumen

Toda la lógica de matching de rutas, resolución de URLs y tipos TypeScript vive en `src/michi-router/`. Son ~370 líneas de código fuente sin contar tests.

## Archivos

| Archivo | Líneas | Propósito |
|---------|--------|-----------|
| `src/michi-router/path-utils.ts` | ~147 | Match de rutas, normalización, resolución de URLs |
| `src/michi-router/types.ts` | ~65 | Interfaces y tipos TypeScript |
| `src/michi-router/Michi-router.tsx` | ~154 | Componentes y hooks (documentado en components/) |
| `src/michi-router/Protected.tsx` | ~72 | Guard de auth (documentado en components/) |

---

## path-utils.ts — Funciones

### `normalizePathname(value: string): string`

Asegura que un pathname tenga formato válido: `/` al inicio, sin `/` al final.

```ts
normalizePathname('about')    // → '/about'
normalizePathname('/about/')  // → '/about'
normalizePathname('')         // → '/'
normalizePathname('/')        // → '/'
```

### `normalizeBasename(basename?: string): string`

Normaliza el basename del router. Retorna `/` si no se provee.

```ts
normalizeBasename(undefined)  // → '/'
normalizeBasename('app')     // → '/app'
normalizeBasename('/app/')   // → '/app'
```

### `resolveInternalPath(to: string, basename: string): ResolvedInternalPath | null`

Función central de seguridad. Parsea una URL y verifica que sea interna y segura. Retorna `null` si la URL es externa o usa un protocolo inseguro.

```ts
resolveInternalPath('/users/123', '/')
// → { pathname: '/users/123', search: '', hash: '', fullPath: '/users/123', browserPath: '/users/123' }

resolveInternalPath('https://evil.com', '/')
// → null

resolveInternalPath('javascript:alert(1)', '/')
// → null
```

**Flujo interno:**

```
to: '/users/123?tab=settings#section2'
         │
         ▼
┌─────────────────────────┐
│ new URL(to, FALLBACK_   │  Parsea la URL
│ ORIGIN)                 │
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│ ¿protocolo en           │  Bloquea javascript:, data:, etc.
│ SAFE_PROTOCOLS?         │
│ ├── No → return null    │
│ └── Sí ↓                │
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│ ¿hostname diferente     │  Bloquea URLs externas
│ al FALLBACK_ORIGIN?     │
│ ├── Sí → return null    │
│ └── No ↓                │
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│ hasBasename /            │  Maneja basename stripping
│ stripBasename            │  y joining
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│ Retorna                 │  { pathname, search, hash,
│ ResolvedInternalPath    │    fullPath, browserPath }
└─────────────────────────┘
```

### `matchRoutePath(routePath: string, currentPath: string): RouteParams | null`

Compara una ruta definida con la ruta actual. Retorna los parámetros extraídos o `null` si no matchea.

```ts
matchRoutePath('/users/:id', '/users/123')
// → { id: '123' }

matchRoutePath('/docs/*', '/docs/getting-started/install')
// → { '*': 'getting-started/install' }

matchRoutePath('/about', '/users')
// → null
```

**Algoritmo:**

1. Divide `routePath` y `currentPath` por `/`
2. Filtra segmentos vacíos
3. Compara segmento por segmento:
   - Si `routeSegment` empieza con `:`, captura como parámetro
   - Si `routeSegment` es `*`, captura todo el resto
   - Si no coinciden, retorna `null`
4. Retorna el objeto de parámetros

### Funciones internas (no exportadas)

| Función | Propósito |
|---------|-----------|
| `hasBasename(pathname, basename)` | Verifica si un pathname empieza con el basename |
| `stripBasename(pathname, basename)` | Remueve el basename del inicio |
| `joinBasename(basename, pathname)` | Concatena basename + pathname |
| `decodeSegment(value)` | `decodeURIComponent` con fallback |

---

## types.ts — Interfaces

### Router

| Tipo | Definición | Descripción |
|------|-----------|-------------|
| `Route` | `{ path: string, component: ReactNode }` | Definición de ruta |
| `RouterLocation` | `{ pathname, search, hash, fullPath }` | Ubicación actual |
| `RouterContextType` | `{ path, location, params, basename, navigate }` | Estado del contexto |
| `RouterProviderProps` | Ver [components/](../components/overview.md) | Props del RouterProvider |

### Navegación

| Tipo | Definición | Descripción |
|------|-----------|-------------|
| `NavigateOptions` | `{ replace?: boolean, state?: unknown }` | Opciones de navegación |
| `NavigateFn` | `(to: string, options?: NavigateOptions) => void` | Firma de navigate() |

### Componentes

| Tipo | Definición | Descripción |
|------|-----------|-------------|
| `LayoutProps` | `{ children: ReactNode }` | Props del layout |
| `LinkProps` | Extiende `AnchorHTMLAttributes` (sin `href`), agrega `to` | Props de Link |

### Auth

| Tipo | Definición | Descripción |
|------|-----------|-------------|
| `RouteParams` | `Record<string, string>` | Parámetros de ruta |
| `AuthState<TUser>` | `{ user: TUser \| null, isLoading: boolean }` | Estado de autenticación |
| `ProtectedConfig<TUser>` | Ver [components/](../components/overview.md) | Config de Protected |
| `ProtectedProps<TUser>` | `{ children, configObject }` | Props de Protected |

### path-utils

| Tipo | Definición | Descripción |
|------|-----------|-------------|
| `ResolvedInternalPath` | `{ pathname, search, hash, fullPath, browserPath }` | URL resuelta y validada |

---

## Constantes

| Constante | Archivo | Valor | Propósito |
|-----------|---------|-------|-----------|
| `FALLBACK_ORIGIN` | `path-utils.ts` | `'https://michi-router.local'` | Origin fallback en SSR (sin `window`) |
| `SAFE_PROTOCOLS` | `path-utils.ts` | `Set(['http:', 'https:'])` | Protocolos permitidos en navegación |
| `DEFAULT_LOCATION` | `Michi-router.tsx` | `{ pathname: '/', search: '', hash: '', fullPath: '/' }` | Location por defecto en SSR |

## Referencias

- [architecture/routing.md](../architecture/routing.md) — Cómo se usan estas utilidades
- [components/overview.md](../components/overview.md) — Componentes que las consumen
- [security/implementation.md](../security/implementation.md) — Seguridad en resolveInternalPath
- Archivo fuente: `src/michi-router/path-utils.ts`
- Archivo fuente: `src/michi-router/types.ts`
