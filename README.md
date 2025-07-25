# Michi Router

![npm version](https://img.shields.io/npm/v/@arielgonzaguer/michi-router)
![bundle size](https://img.shields.io/bundlephobia/minzip/@arielgonzaguer/michi-router)
![license](https://img.shields.io/npm/l/@arielgonzaguer/michi-router)


![Logo de MichiRouter](./public/michiRouter_LOGO.png)


# ¡IMPORTANTE!

Las versiones 1.1.x publicadas antes del 18/marzo/2025 están rotas, contienen errores y han sido eliminadas.
La versión estable es la 1.2.2.
Si tienes alguna de estas versiones instaladas (1.1.x), actualízala a la versión 1.2.2 ejecutando el siguiente comando:
```bash
npm install @arielgonzaguer/michi-router@latest
```


Gracias por su comprensión 😸

# Michi Router

El router minimalista y simple para React.
El objetivo principal de esta herramienta es proporcionar la funcionalidad básica de enrutamiento.


## Características

- Es ideal para proyectos pequeños o que solo necesitan una funcionalidad básica de enrutamiento.
- No requiere de ninguna configuración adicional.
- No requiere de ninguna dependencia externa.
- Creado con TypeScript.

## Compatibilidad

- React 16.8+.
- Funciona con proyectos creados con Vite.
- Totalmente tipado con TypeScript.

## Instalación

```bash
npm install @arielgonzaguer/michi-router
```

## Uso básico

```tsx
// src/App.jsx //
import { RouterProvider } from "@arielgonzaguer/michi-router";

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

#### Usando el componente Link solo con prop to

```tsx
import { Link } from "@arielgonzaguer/michi-router";

function NavigationComponent() {
  return (
    <nav>
      <Link to="/">Home</Link>
      <Link to="/about">About</Link>
    </nav>
  );
}
```

#### Usando el componente Link con todas las props

```tsx
<Link
  to="/contact"
  className="nav-link"
  target="_blank"
  rel="noopener noreferrer"
  aria-label="Contacto"
>
  Contacto
</Link>
```

### Navegación programática (Hook useNavigate)

```tsx
import { useNavigate } from "@arielgonzaguer/michi-router";

function NavigateButton() {
  const navigate = useNavigate();
  return;
  <button onClick={() => navigate("/gatos")}>Ir a Gatos</button>;
}
```

### Organización de rutas en archivos separados

Puede organizar sus rutas en archivos separados.
Primero cree un archivo con las rutas:

```tsx
// routes.tsx
import Home from "./pages/Home";
import About from "./pages/About";
import Products from "./pages/Products";
import NotFound from "./pages/NotFound";

export const routes = [
  { path: "/", component: <Home /> },
  { path: "/about", component: <About /> },
  { path: "/products", component: <Products /> },
];

export const notFoundPage = <NotFound />;
```

Después utilice este archivo en su componente que maneja el enrutado:

```tsx
// App.tsx
import { RouterProvider } from "@arielgonzaguer/michi-router";
import { routes, notFoundPage } from "./routes";

function App() {
  return <RouterProvider routes={routes}>{notFoundPage}</RouterProvider>;
}
```

### Protección de rutas

Si necesita que sus rutas se mantengan protegidas, puede usar un componente que cumpla este propósito, como el siguiente:

```tsx
// Protected.tsx
import { useEffect } from "react";
import { useNavigate } from "@arielgonzaguer/michi-router";
import useAuthStore from "../store/useAuthStore"; // esta sería la store que maneja la autenticacación en su proyecto
import { ReactNode } from "react"; // tipado

export default function Protected({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  useEffect(() => {
    if (!user) {
      navigate("/login"); // si no hay usuario autenticado en la store, redirige al login
    }
  }, [user, navigate]);

  return user ? children : null; // Devuelve los hijos solo si la persona usuaria está autenticada
}
```

Después, puede usar ese componente en el archivo dónde maneja sus rutas:

```tsx
// MichiRouter.tsx
import { RouterProvider } from "@arielgonzaguer/michi-router";
import Home from "../pages/Home";
import ActualizarGatos from "../pages/ActualizarGatos";
import VerGatos from "../pages/VerGatos";
import AgregarGatos from "../pages/AgregarGatos";
import NotFoud404 from "../components/NotFound404";
import Index from "../pages/Index";

// protección de rutas
import Protected from "./Protected";

// layout
import BaseLayout from "../layouts/BaseLayout";

const rutas = [
  { path: "/", component: <Home /> },
  // encapsule los componente a elegir dentro de <Protected>
  {
    path: "/index",
    component: (
      <Protected>
        <Index />
      </Protected>
    ),
  },
  {
    path: "/actualizar-gatos",
    component: (
      <Protected>
        <ActualizarGatos />
      </Protected>
    ),
  },
  {
    path: "/ver-gatos",
    component: (
      <Protected>
        <VerGatos />{" "}
      </Protected>
    ),
  },
  {
    path: "/agregar-gatos",
    component: (
      <Protected>
        <AgregarGatos />
      </Protected>
    ),
  },
];

export default function MichiRouter() {
  return (
    <RouterProvider routes={rutas} layout={BaseLayout}>
      <NotFoud404 />
    </RouterProvider>
  );
}
```

### Usando un Layout General

Puede aplicar un layout común a todas tus rutas:

```tsx
import { RouterProvider } from "@arielgonzaguer/michi-router";
import MainLayout from "./layouts/MainLayout";

const routes = [
  { path: "/", component: <Home /> },
  { path: "/felinos-ferales", component: <Ferales /> },
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
          <Link to="/felinos-ferales">Ferales</Link>
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

- `routes`: Array de objetos con `path` y `component`.
- `children`: Elemento a mostrar cuando no hay ruta coincidente.
- `layout`: Componente opcional que funciona como layout general para todas las rutas.

### `<Link>`

Componente para navegación declarativa.

**Props:**

- `to`: Ruta destino.
- `children`: Contenido del enlace.
- `className`: Clases CSS opcionales.
- `...rest`: Cualquier otra prop válida para elementos `<a>` de HTML.

### `useNavigate()`

Hook para navegación programática.

**Retorna:**

- Función navigate que acepta la ruta como parámetro.

## Próximas características

- [ ] Transiciones entre rutas.

  ```jsx
  <RouterProvider routes={routes} transitions={true} transitionDuration={300}>
    <NotFound />
  </RouterProvider>
  ```

## Solución de problemas comunes

### El componente no se renderiza después de navegar

Asegúrese de que la ruta en el array `routes` coincida exactamente con la URL, incluyendo barras diagonales.


## Contribuir

Las contribuciones son bienvenidas. Por favor, sigue estos pasos:

1. Fork el repositorio.
2. Crea una rama para tu feature (`git checkout -b feature/amazing-feature`).
3. Haz commit de tus cambios (`git commit -m 'Add some amazing feature'`).
4. Push a la rama (`git push origin feature/amazing-feature`).
5. Abre un Pull Request.

## Licencia

MIT
