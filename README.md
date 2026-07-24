# Michi Router

![npm version](https://img.shields.io/npm/v/@arielgonzaguer/michi-router)
![bundle size](https://img.shields.io/bundlephobia/minzip/@arielgonzaguer/michi-router)
![license](https://img.shields.io/npm/l/@arielgonzaguer/michi-router)

![Logo de MichiRouter](https://cdn.jsdelivr.net/gh/Ariel-GonzAguer/michi-router@main/public/michiRouter_LOGO.png)

Router minimalista para React, enfocado en tamano, DX y seguridad para navegacion interna del lado del cliente.

## Caracteristicas

- **Ligero**: pensado para mantenerse pequeno.
- **TypeScript first**: API completamente tipada.
- **Zero dependencias de runtime**.
- **Rutas dinamicas**: soporte para `:params` y wildcard `*`.
- **Hooks**: `useNavigate`, `useLocation`, `useParams`.
- **Basename**: util para apps bajo subrutas (`/app`).
- **Componente `Protected`** opcional.
- **Navegacion segura interna**: bloquea protocolos inseguros y destinos externos.

## Instalación

```bash
# pnpm (recomendado)
pnpm add @arielgonzaguer/michi-router

# npm
npm install @arielgonzaguer/michi-router

# yarn
yarn add @arielgonzaguer/michi-router
```

## Uso rápido

```tsx
import { RouterProvider, Link, useNavigate, useParams } from '@arielgonzaguer/michi-router';

function Home() {
  const navigate = useNavigate();
  return (
    <>
      <h1>Home</h1>
      <Link to="/users/42">Ir al usuario</Link>
      <button onClick={() => navigate('/search?q=michi#top')}>Buscar</button>
    </>
  );
}

function UserPage() {
  const { id } = useParams<{ id: string }>();
  return <h1>User {id}</h1>;
}

export default function App() {
  return (
    <RouterProvider
      basename="/app"
      routes={[
        { path: '/', component: <Home /> },
        { path: '/users/:id', component: <UserPage /> },
        { path: '/docs/*', component: <h1>Docs</h1> }
      ]}
      notFound={<h1>404</h1>}
    />
  );
}
```

## API Reference

### RouterProvider

| Prop | Tipo | Descripcion |
|------|------|-------------|
| `routes` | `Route[]` | Array de rutas a renderizar |
| `basename` | `string` | Prefijo base para todas las rutas |
| `notFound` | `ReactNode` | Contenido a mostrar cuando no hay match |
| `children` | `ReactNode` | Fallback cuando no hay match (alternativa a `notFound`) |
| `layout` | `ComponentType<{children}>` | Layout wrapper para todas las rutas |

### Route

| Prop | Tipo | Descripcion |
|------|------|-------------|
| `path` | `string` | Patron de ruta (`/`, `/users/:id`, `/docs/*`) |
| `component` | `ReactNode` | Componente a renderizar |

### Link

| Prop | Tipo | Descripcion |
|------|------|-------------|
| `to` | `string` | Ruta interna a navegar |
| `children` | `ReactNode` | Contenido del enlace |
| `className` | `string` | Clase CSS opcional |

### useNavigate

```typescript
navigate(to: string, options?: { replace?: boolean; state?: unknown }): void
```

### useLocation

```typescript
useLocation(): { pathname: string; search: string; hash: string; fullPath: string }
```

### useParams

```typescript
useParams<T extends Record<string, string>>(): T
```

### Protected

| Prop | Tipo | Descripcion |
|------|------|-------------|
| `children` | `ReactNode` | Contenido protegido |
| `configObject` | `ProtectedConfig` | Configuracion de autenticacion |

### ProtectedConfig

| Prop | Tipo | Descripcion |
|------|------|-------------|
| `states` | `{ user: any; isLoading: boolean }` | Estado de autenticacion |
| `redirectionPath` | `string` | Ruta de redireccion si no esta autenticado |
| `loadingComponent` | `ReactNode` | Componente de carga opcional |
| `defaultMessage` | `string` | Mensaje por defecto mientras carga |

## Entradas del paquete

- `@arielgonzaguer/michi-router`: API completa (incluye `Protected`).
- `@arielgonzaguer/michi-router/core`: router base sin `Protected` (mas pequeno).
- `@arielgonzaguer/michi-router/protected`: solo el componente `Protected`.

## Limitaciones

- **SSR/SSG no soportado**: El router depende de `window` y `history.pushState`. Compatible con SSR limitado (el servidor renderiza la ruta por defecto).
- **Sin code splitting**: Las rutas se cargan todas al inicio.
- **Sin lazy loading**: No hay soporte para `React.lazy` integrado.

## Compatibilidad

| Caracteristica | Estado |
|----------------|--------|
| React 17+ | Soportado |
| React 18+ | Soportado |
| React 19+ | No probado |
| SSR/SSG | No soportado |
| TypeScript 5+ | Soportado |

[Documentacion](https://michirouter.netlify.app/)
