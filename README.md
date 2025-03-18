# Michi Router

![npm version](https://img.shields.io/npm/v/@arielgonzaguer/michi-router)
![bundle size](https://img.shields.io/bundlephobia/minzip/@arielgonzaguer/michi-router)
![license](https://img.shields.io/npm/l/@arielgonzaguer/michi-router)


# ¡IMPORTANTE!

Las versiones 1.1.x publicadas antes del 18/marzo/2025 están rotas, contienen errores y han sido eliminadas.
La versión estable es la 1.2.2.
Si tienes alguna de estas versiones instaladas (1.1.x), actualízala a la versión 1.2.2 ejecutando el siguiente comando:
```bash
npm install @arielgonzaguer/michi-router@latest
```

O:
```bash
npm install @arielgonzaguer/michi-router@1.2.2
```

Gracias por tu comprensión 😸

# Michi Router

El router minimalista y simple para React.
El objetivo principal de esta herramienta es proporcionar la funcionalidad básica de enrutamiento.


## Características

- Es ideal para proyectos pequeños o que solo necesitan una funcionalidad básica de enrutamiento.
- No requiere de ninguna configuración adicional.
- No requiere de ninguna dependencia externa.
- Creado con TypeScript.
- Ultra ligero.


## Compatibilidad

- React 16.8+.
- Funciona con proyectos creados con  Vite, Next.js, etc.
- Totalmente tipado con TypeScript.

## Instalación

```bash
npm install @arielgonzaguer/michi-router
```

## Uso básico

```jsx
// src/App.jsx //
import { RouterProvider} from "@arielgonzaguer/michi-router";

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
```jsx
import { Link} from "@arielgonzaguer/michi-router";

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
```jsx
import { Link} from "@arielgonzaguer/michi-router";

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

```jsx
import { useNavigate } from "@arielgonzaguer/michi-router";

function NavigateButton() {
  const navigate = useNavigate();
  return <button onClick={() => navigate("/about")}>Ir a About</button>;
}
```

### Organización de rutas en archivos separados

Para aplicaciones más grandes, puedes organizar tus rutas en archivos separados:

```jsx
// routes.js
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

```jsx
// App.jsx
import { RouterProvider } from "@arielgonzaguer/michi-router";
import { routes, notFoundPage } from "./routes";

function App() {
  return <RouterProvider routes={routes}>{notFoundPage}</RouterProvider>;
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
    ...(isAuthenticated
      ? [
          { path: "/profile", component: <Profile /> },
          { path: "/admin", component: <Admin /> },
        ]
      : []),
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

## Solución de problemas comunes

### El componente no se renderiza después de navegar

Asegúrate de que la ruta en el array `routes` coincida exactamente con la URL, incluyendo barras diagonales.

### Errores con TypeScript

Si estás usando TypeScript, asegúrate de importar los tipos correctamente:

```typescript
import {
  RouterProvider,
  Link,
  useNavigate,
} from "@arielgonzaguer/michi-router";
import type { RouterProviderProps } from "@arielgonzaguer/michi-router";
```

## Contribuir

Las contribuciones son bienvenidas. Por favor, sigue estos pasos:

1. Fork el repositorio.
2. Crea una rama para tu feature (`git checkout -b feature/amazing-feature`).
3. Haz commit de tus cambios (`git commit -m 'Add some amazing feature'`).
4. Push a la rama (`git push origin feature/amazing-feature`).
5. Abre un Pull Request.

## Licencia

MIT
