# Michi Router

El router minimalista y simple para React.

## Installation

```bash
npm install @arielgonzaguer/michi-router
```

## Usage

```jsx
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

// Usando Link
function NavigationComponent() {
  return (
    <nav>
      <Link to="/">Home</Link>
      <Link to="/about">About</Link>
    </nav>
  );
}

// Usando useNavigate
function NavigateButton() {
  const navigate = useNavigate();
  return <button onClick={() => navigate("/about")}>Ir a About</button>;
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

## Licencia

MIT
