# Michi Router

![npm version](https://img.shields.io/npm/v/@arielgonzaguer/michi-router)
![bundle size](https://img.shields.io/bundlephobia/minzip/@arielgonzaguer/michi-router)
![license](https://img.shields.io/npm/l/@arielgonzaguer/michi-router)

![Logo de MichiRouter](./public/michiRouter_LOGO.png)

# Michi Router

El router minimalista y simple para React.
El objetivo principal de esta herramienta es proporcionar la funcionalidad básica de enrutamiento.

## Características

- Es ideal para proyectos pequeños o que solo necesitan una funcionalidad básica de enrutamiento.
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

El paquete incluye el componente `<Protected>` para restringir el acceso a contenido según el estado de autenticación.

Uso básico:

```tsx
<Protected configObject={configObject}>
  <PrivateComponent />
</Protected>
```

`configObject` (props requeridas/permitidas):

- `states` (obligatorio): <Record<string, any>> objeto con `{ user: any, isLoading: boolean }`. Por ejemplo el valor retornado por un hook de autenticación (Zustand, Redux, Context, etc.).
- `redirectionPath` (obligatorio): <string> ruta destino cuando no hay usuario autenticado. Por defecto `/`.
- `loadingComponent` (opcional): <JSX.Element> componente React a mostrar mientras `isLoading` es `true`.
- `defaultMessage` (opcional): <boolean> si `true` muestra `Cargando...` cuando `isLoading` es `true` y no se ha provisto `loadingComponent`. Si `false` o no se proporciona, retorna `null`.

Ejemplo con Zustand:

```tsx
import Protected from "@arielgonzaguer/michi-router/Protected";
import useAuthStore from "../store/useAuthStore";

function PrivateRoute() {
  const { user, isLoading } = useAuthStore();

  return (
    <Protected
      configObject={{
        states: { user, isLoading },
        redirectionPath: "/login",
        loadingComponent: <div>Cargando...</div>,
      }}
    >
      <Notas />
    </Protected>
  );
}
```

### Ejemplo de uso del componente Protected:

```tsx
// routes.tsx

// ...otros imports
import {
  Protected,
  RouterProvider as MichiProvider,
} from "@arielgonzaguer/michi-router";
import useAuthStore from "../store/useAuthStore"; // la store que maneja autenticación
import Login from "../paginas/Login.jsx";
import Home from "../paginas/Home.jsx";
import Notas from "../paginas/Notas.jsx";
// ...otros componentes

export default function MichiRouter() {
  const configObject = {
    states: useAuthStore(),
    redirectionPath: '/',
    loadingComponent: (
      <div className="w-full h-screen flex items-center justify-center">Cargando...</div>
    ),
    defaultMessage: false,
  };

  const routes = [
    { path: "/", component: <Home /> },
    {
      path: "/login",
      component: <Login />,
    },
    {
      path: "/notas",
      component: (
        <Protected
          configObject={configObject}
        >
          <Notas />
        </Protected>
      ),
    },
    // ...otras rutas
  ];

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
import { RouterProvider, Link } from "@arielgonzaguer/michi-router";

// ejemplo de un componente Layout
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

// definición de rutas
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

### `<Protected>`

Componente para proteger rutas.

**Props:**

- `children`: Elemento a proteger.
- `configObject`: Objeto de configuración para el componente.

  - `states`: obligatorio. Objeto con `{ user: any, isLoading: boolean }`.
  - `redirectionPath`: obligatorio. Ruta a redirigir si no hay usuario.
  - `loadingComponent`: opcional. Componente a mostrar mientras `isLoading` es true.
  - `defaultMessage`: opcional. Si es true, muestra "Cargando..." por defecto mientras `isLoading` es true. Si es false o no se proporciona, retorna `null` mientras `isLoading` es true.

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
