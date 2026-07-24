# Sistema de rutas — michi-router

## Resumen

michi-router soporta 4 tipos de rutas: estáticas, dinámicas (`:param`), wildcard (`*`) y catch-all. El matching se hace en `src/michi-router/path-utils.ts` via la función `matchRoutePath`.

## Tipos de rutas

| Tipo | Ejemplo | Descripción |
|------|---------|-------------|
| Estática | `/about` | Match exacto |
| Dinámica | `/users/:id` | Captura segmentos como parámetros |
| Multi-param | `/users/:userId/posts/:postId` | Múltiples params dinámicos |
| Wildcard | `/docs/*` | Captura todo lo que sigue al prefijo |
| Catch-all | `*` | Captura cualquier ruta |

## Flujo de matching

```
URL del navegador: /users/123/posts/456
         │
         ▼
┌─────────────────────────┐
│  getCurrentLocation()   │  Extrae pathname, search, hash
│  (path-utils.ts)       │
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│  resolveInternalPath()  │  Valida que sea URL interna, safe protocol
│  (path-utils.ts)        │  Strips basename si aplica
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│  matchRoutePath()       │  Compara con cada route.path del array
│  (path-utils.ts)        │  Extrae :params y * wildcards
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│  RouterProvider render  │  Renderiza el componente de la ruta matcheada
│  (Michi-router.tsx)     │  Provee params via RouterContext
└─────────────────────────┘
```

## Funciones de matching

### `matchRoutePath(routePath, currentPath)`

Compara una ruta definida con la ruta actual. Retorna los parámetros extraídos o `null` si no matchea.

```ts
// src/michi-router/path-utils.ts
matchRoutePath('/users/:id', '/users/123')
// → { id: '123' }

matchRoutePath('/docs/*', '/docs/getting-started/install')
// → { '*': 'getting-started/install' }

matchRoutePath('/about', '/users')
// → null
```

**Reglas de matching:**
1. Divide tanto `routePath` como `currentPath` por `/`
2. Compara segmento por segmento
3. Si un segmento empieza con `:`, lo captura como parámetro
4. Si el segmento es `*`, captura todo el resto de la URL
5. Si los segmentos no coinciden, retorna `null`

### `normalizePathname(value)`

Asegura que un pathname tenga formato válido.

```ts
normalizePathname('about')    // → '/about'
normalizePathname('/about/')  // → '/about'
normalizePathname('')         // → '/'
normalizePathname('/')        // → '/'
```

### `resolveInternalPath(to, basename)`

Función central de seguridad. Parsea una URL y verifica que sea interna y segura.

```ts
// URLs internas → retorna ResolvedInternalPath
resolveInternalPath('/users/123', '/')
// → { pathname: '/users/123', search: '', hash: '', fullPath: '/users/123', browserPath: '/users/123' }

// URLs externas → retorna null
resolveInternalPath('https://evil.com', '/')
// → null

// Protocolos inseguros → retorna null
resolveInternalPath('javascript:alert(1)', '/')
// → null
```

### `normalizeBasename(basename?)`

Normaliza el basename del router.

```ts
normalizeBasename(undefined)  // → '/'
normalizeBasename('app')     // → '/app'
normalizeBasename('/app/')   // → '/app'
```

## Basename

El basename permite montar el router en una subruta. Todas las rutas se resuelven relativas a este prefijo.

```tsx
<RouterProvider basename="/app" routes={routes}>
```

| Ruta definida | Basename | URL real |
|---------------|----------|----------|
| `/dashboard` | `/app` | `/app/dashboard` |
| `/settings` | `/app` | `/app/settings` |
| `/` | `/app` | `/app` |

**Comportamiento:**
- `navigate('/dashboard')` → `pushState({}, '', '/app/dashboard')`
- El pathname reportado por `useLocation()` es `/dashboard` (sin basename)
- `matchRoutePath` opera sobre paths sin basename

## Navegación

### `navigate(to, options?)`

Función que usa History API para navegar.

```ts
navigate('/users/123')                    // pushState
navigate('/users/123', { replace: true }) // replaceState
navigate('/users/123', { state: { from: 'home' } }) // con state
```

**Seguridad:** Bloquea navegación a URLs externas y protocolos inseguros (`javascript:`, `data:`).

### `popstate` event

`RouterProvider` escucha `popstate` para sincronizar el estado interno cuando el usuario usa los botones atrás/adelante del navegador.

## SSR

El router chequea `typeof window !== 'undefined'` antes de acceder a APIs del navegador. En SSR:
- `getCurrentLocation()` retorna `DEFAULT_LOCATION` (`{ pathname: '/', search: '', hash: '', fullPath: '/' }`)
- `navigate()` no hace nada
- No hay `popstate` listener

## Referencias

- [components/overview.md](../components/overview.md) — RouterProvider y Link
- [utils/overview.md](../utils/overview.md) — path-utils completo
- [security/implementation.md](../security/implementation.md) — Seguridad en resolución de URLs
- Archivo fuente: `src/michi-router/path-utils.ts`
- Archivo fuente: `src/michi-router/Michi-router.tsx`
