# Michi Router

![npm version](https://img.shields.io/npm/v/@arielgonzaguer/michi-router)
![bundle size](https://img.shields.io/bundlephobia/minzip/@arielgonzaguer/michi-router)
![license](https://img.shields.io/npm/l/@arielgonzaguer/michi-router)

![Logo de MichiRouter](https://cdn.jsdelivr.net/gh/Ariel-GonzAguer/michi-router@main/public/michiRouter_LOGO.png)

Router minimalista para React, enfocado en tamaño, DX y seguridad para navegación interna del lado del cliente.

## Características

- **Ligero**: pensado para mantenerse pequeño.
- **TypeScript first**: API completamente tipada.
- **Zero dependencias de runtime**.
- **Rutas dinámicas**: soporte para `:params` y wildcard `*`.
- **Hooks**: `useNavigate`, `useLocation`, `useParams`.
- **Basename**: útil para apps bajo subrutas (`/app`).
- **Componente `Protected`** opcional.
- **Navegación segura interna**: bloquea protocolos inseguros y destinos externos.

## Instalación

```bash
npm install @arielgonzaguer/michi-router
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

## API

- `navigate(to, options?)` con `options.replace` y `options.state`.
- `useLocation()` retorna `{ pathname, search, hash, fullPath }`.
- `useParams()` retorna los parámetros de la ruta activa.
- `Link` está diseñado para rutas internas.

## Entradas del paquete

- `@arielgonzaguer/michi-router`: API completa.
- `@arielgonzaguer/michi-router/core`: router base sin `Protected`.
- `@arielgonzaguer/michi-router/protected`: export del componente `Protected`.

Documentación: [https://michirouter.vercel.app/](https://michirouter.vercel.app/)
