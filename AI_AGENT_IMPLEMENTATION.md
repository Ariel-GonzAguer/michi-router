# Michi Router: Guía de Implementación para Agentes de IA

Este documento está diseñado para que un agente de IA pueda integrar **@arielgonzaguer/michi-router** de forma correcta, segura y consistente.

## 1. Objetivo

Implementar enrutado cliente minimalista en React con:

- Rutas estáticas y dinámicas (`:param`, `*`)
- Navegación programática
- Rutas protegidas opcionales
- Buenas prácticas de seguridad para navegación interna

## 2. Reglas no negociables

1. `Link` es **solo para rutas internas**.
2. No usar `navigate` para ir a dominios externos.
3. Las redirecciones de `Protected` deben ser rutas internas (ej. `"/login"`).
4. Mantener fallback 404 (`notFound` o `children`).
5. Preferir imports desde `@arielgonzaguer/michi-router/core` cuando no se use `Protected` (bundle más pequeño).

## 3. Instalación

```bash
pnpm add @arielgonzaguer/michi-router
```

## 4. Imports recomendados

### Core (recomendado por tamaño)

```tsx
import {
  RouterProvider,
  Link,
  useNavigate,
  useLocation,
  useParams
} from '@arielgonzaguer/michi-router/core';
```

### Protected (si aplica auth)

```tsx
import { Protected } from '@arielgonzaguer/michi-router/protected';
```

> También puedes importar todo desde el paquete raíz: `@arielgonzaguer/michi-router`.

## 5. Implementación base (plantilla)

```tsx
import React from 'react';
import {
  RouterProvider,
  Link,
  useNavigate,
  useLocation,
  useParams
} from '@arielgonzaguer/michi-router/core';
import { Protected } from '@arielgonzaguer/michi-router/protected';

function Home() {
  const navigate = useNavigate();
  return (
    <main>
      <h1>Home</h1>
      <Link to="/users/42">Perfil</Link>
      <button onClick={() => navigate('/search?q=michi#top')}>Buscar</button>
    </main>
  );
}

function UserPage() {
  const { id } = useParams<{ id: string }>();
  return <h1>User {id}</h1>;
}

function SearchPage() {
  const location = useLocation();
  return <pre>{location.fullPath}</pre>;
}

function PrivatePage() {
  return <h1>Área privada</h1>;
}

export default function App() {
  const authState = { user: { id: 'u1' }, isLoading: false };

  return (
    <RouterProvider
      basename="/app"
      routes={[
        { path: '/', component: <Home /> },
        { path: '/users/:id', component: <UserPage /> },
        { path: '/search', component: <SearchPage /> },
        {
          path: '/private',
          component: (
            <Protected
              configObject={{
                states: authState,
                redirectionPath: '/login',
                defaultMessage: 'Cargando autenticación...'
              }}
            >
              <PrivatePage />
            </Protected>
          )
        },
        { path: '/docs/*', component: <h1>Docs</h1> }
      ]}
      notFound={<h1>404</h1>}
    />
  );
}
```

## 6. API clave para agentes

- `navigate(to, options?)`
  - `to`: ruta interna (`/dashboard`, `/users/1?tab=a#top`)
  - `options.replace?: boolean`
  - `options.state?: unknown`
- `useLocation()` → `{ pathname, search, hash, fullPath }`
- `useParams<T>()` → params de ruta dinámica
- `RouterProvider`
  - `routes: Route[]`
  - `basename?: string`
  - `notFound?: ReactNode`
  - `children?: ReactNode` (fallback)

## 7. Patrón de Protected

Cuando el usuario no está autenticado, `Protected` redirige con fallback seguro:

```tsx
<Protected
  configObject={{
    states: { user, isLoading },
    redirectionPath: '/login',
    loadingComponent: <Spinner />
  }}
>
  <Dashboard />
</Protected>
```

## 8. Checklist de aceptación (para PR de agente IA)

- [ ] No hay uso de URLs externas en `Link`/`navigate`.
- [ ] Existe fallback 404.
- [ ] Rutas dinámicas (`:id`) funcionan correctamente.
- [ ] Si se usa auth, `Protected` redirige a ruta interna.
- [ ] Si no se usa auth, se importa desde `core` para minimizar tamaño.
- [ ] La app compila y navega sin recargar página.

## 9. Errores comunes a evitar

1. Usar `Link` para `https://...` (incorrecto: es interno).
2. Omitir `basename` cuando la app vive bajo subruta.
3. No definir ruta de fallback (`notFound`/`children`).
4. Redirección insegura en `Protected` (no usar URLs absolutas externas).

## 10. Errores comunes y cómo solucionarlos

| Error común | Síntoma | Solución |
| --- | --- | --- |
| `Link` usado con URL externa (`https://...`) | No navega o se bloquea por seguridad | Usar `<a href=\"https://...\" target=\"_blank\" rel=\"noopener noreferrer\">` para enlaces externos y reservar `Link` para rutas internas |
| Falta `basename` en apps bajo subruta (`/app`) | 404 o rutas que no coinciden | Configurar `<RouterProvider basename=\"/app\" ... />` |
| No hay `notFound` ni `children` fallback | Pantalla vacía en rutas no registradas | Definir `notFound={<NotFoundPage />}` o pasar `children` como fallback |
| `Protected` redirige a URL absoluta externa | Redirección reemplazada por `/` | Usar siempre rutas internas en `redirectionPath` (ej. `\"/login\"`) |
| Ruta dinámica mal definida (`/users/id` en vez de `/users/:id`) | `useParams()` vacío | Declarar `path: '/users/:id'` y consumir `useParams<{ id: string }>()` |
| Uso de imports desde raíz sin necesitar `Protected` | Bundle mayor al necesario | Importar desde `@arielgonzaguer/michi-router/core` para mantener tamaño mínimo |

### Snippets de corrección rápida

```tsx
// 1) Enlace externo correcto (NO usar Link)
<a href="https://example.com" target="_blank" rel="noopener noreferrer">
  Sitio externo
</a>
```

```tsx
// 2) Basename correcto
<RouterProvider basename="/app" routes={routes} notFound={<h1>404</h1>} />
```

```tsx
// 3) Ruta dinámica correcta
{ path: '/users/:id', component: <UserPage /> }
```

```tsx
// 4) Redirección segura en Protected
<Protected configObject={{ states: { user, isLoading }, redirectionPath: '/login' }}>
  <Dashboard />
</Protected>
```

