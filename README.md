# Michi Router

El router minimalista y simple para React.
El objetivo principal de esta herramienta es proporcionar la funcionalidad básica de enrutamiento.

## Características

- Es idea para proyectos pequeños o que solo necesitan una funcionalidad básica de enrutamiento.
- No requiere de ninguna configuración adicional.
- No requiere de ninguna dependencia externa.
- Es compatible con React 16.8 y versiones posteriores.
- Creado con TypeScript.
- Ultra ligero. Menos de 15kb (más ligero y básico que otras librerías).

## Installation

```bash
npm install @arielgonzaguer/michi-router
```

## Uso básico

```jsx
// src/App.jsx //
import { RouterProvider, Link } from "@arielgonzaguer/michi-router";

// puede crear rutas en un archivo separado o en el mismo archivo
const routes = [
  { path: "/", component: <Home /> },
  { path: "/about", component: <About /> },
];

function App() {
  return (
    <RouterProvider routes={routes}>
      {/* Esto se muestra si no se encuentra una ruta */}
      <div>404: Page not found</div>
    </RouterProvider>
  );
}
```

### Usando Link
```jsx
function NavigationComponent() {
  return (
    <nav>
      <Link to="/">Home</Link>
      <Link to="/about">About</Link>
    </nav>
  );
}
```

### Navegación programática (Hook useNavigate)
```jsx
function NavigateButton() {
  const navigate = useNavigate();
  return <button onClick={() => navigate("/about")}>Ir a About</button>;
}
```

### Organización de rutas en archivos separados

Para aplicaciones más grandes, puedes organizar tus rutas en archivos separados:

```jsx
// routes.js
import Home from './pages/Home';
import About from './pages/About';
import Products from './pages/Products';
import NotFound from './pages/NotFound';

export const routes = [
  { path: "/", component: <Home /> },
  { path: "/about", component: <About /> },
  { path: "/products", component: <Products /> },
];

export const notFoundPage = <NotFound />;
```

```jsx
// App.jsx
import { RouterProvider } from "@arielgonzaguer/michi-router";
import { routes, notFoundPage } from './routes';

function App() {
  return (
    <RouterProvider routes={routes}>
      {notFoundPage}
    </RouterProvider>
  );
}
```

### Integración con sistemas de autenticación

```jsx
import { RouterProvider } from "@arielgonzaguer/michi-router";
import { useAuth } from "./auth-context";

function App() {
  const { isAuthenticated } = useAuth();
  
  // Definimos rutas condicionalmente basadas en autenticación
  const routes = [
    { path: "/", component: <Home /> },
    { path: "/login", component: <Login /> },
    // Solo agregamos estas rutas si el usuario está autenticado
    ...(isAuthenticated ? [
      { path: "/profile", component: <Profile /> },
      { path: "/admin", component: <Admin /> }
    ] : [])
  ];
  
  return (
    <RouterProvider routes={routes}>
      <div>404: Page not found</div>
    </RouterProvider>
  );
}
```

### Usando un Layout General

Puedes aplicar un layout común a todas tus rutas:

```jsx
import { RouterProvider } from "@arielgonzaguer/michi-router";
import MainLayout from "./layouts/MainLayout";

const routes = [
  { path: "/", component: <Home /> },
  { path: "/about", component: <About /> },
];

function App() {
  return (
    <RouterProvider routes={routes} layout={MainLayout}>
      <div>404: Page not found</div>
    </RouterProvider>
  );
}

// Ejemplo de un componente Layout
function MainLayout({ children }) {
  return (
    <div className="layout">
      <header>
        <nav>
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
        </nav>
      </header>
      <main>{children}</main>
      <footer>Michi-router 😸</footer>
    </div>
  );
}
```

## API

### `<RouterProvider>`

Componente principal para el enrutamiento.

**Props:**

- `routes`: Array de objetos con `path` y `component`
- `children`: Elemento a mostrar cuando no hay ruta coincidente
- `layout`: Componente opcional que funciona como layout general para todas las rutas

### `<Link>`

Componente para navegación declarativa.

**Props:**

- `to`: Ruta destino
- `children`: Contenido del enlace
- `className`: Clases CSS opcionales

### `useNavigate()`

Hook para navegación programática.

**Retorna:**

- Función navigate que acepta la ruta como parámetro

## Próximas características

- [ ] Soporte para rutas anidadas.

  ```jsx
  const routes = [
    {
      path: "/dashboard",
      component: <Dashboard />,
      children: [
        { path: "/users", component: <Users /> },
        { path: "/settings", component: <Settings /> },
      ],
    },
  ];
  ```

- [ ] Transiciones entre rutas.
  ```jsx
  <RouterProvider routes={routes} transitions={true} transitionDuration={300}>
    <NotFound />
  </RouterProvider>
  ```

## Licencia

MIT
