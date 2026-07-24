# Componentes — michi-router

## Resumen

michi-router exporta 3 componentes: `RouterProvider`, `Link` y `Protected`. Todos están definidos en `src/michi-router/`.

## Componentes

| Componente | Archivo | Propósito |
|-----------|---------|-----------|
| `RouterProvider` | `src/michi-router/Michi-router.tsx` | Proveedor del router, maneja estado y navegación |
| `Link` | `src/michi-router/Michi-router.tsx` | Navegación interna sin recarga de página |
| `Protected` | `src/michi-router/Protected.tsx` | Guard de autenticación genérico |

---

## RouterProvider

Componente principal. Crea el contexto del router y maneja el estado de la URL.

### Props

| Prop | Tipo | Requerido | Descripción |
|------|------|-----------|-------------|
| `routes` | `Route[]` | Sí | Array de rutas `{ path: string, component: ReactNode }` |
| `children` | `ReactNode` | No | Contenido renderizado (nav, layouts, etc.) |
| `notFound` | `ReactNode` | No | Contenido para 404 |
| `basename` | `string` | No | Prefijo de subruta (ej: `/app`) |
| `layout` | `ComponentType<{ children }>` | No | Layout wrapper para todas las rutas |

### Ejemplo

```tsx
import { RouterProvider } from '@arielgonzaguer/michi-router';

const Home = () => <h1>Inicio</h1>;
const About = () => <h1>Acerca de</h1>;
const NotFound = () => <h1>404</h1>;

function App() {
  return (
    <RouterProvider
      routes={[
        { path: '/', component: <Home /> },
        { path: '/about', component: <About /> },
      ]}
      notFound={<NotFound />}
      basename="/app"
    >
      <nav>...</nav>
    </RouterProvider>
  );
}
```

### Comportamiento

1. Inicializa `location` con `getCurrentLocation()` (o `DEFAULT_LOCATION` en SSR)
2. Escucha `popstate` para sincronizar con botones atrás/adelante
3. Para cada render, itera `routes` y ejecuta `matchRoutePath()` hasta encontrar un match
4. Si no hay match y se provee `notFound`, lo renderiza
5. Si no hay match y no hay `notFound`, renderiza `children` (si existe)
6. Provee `RouterContext` con `{ path, location, params, basename, navigate }`

---

## Link

Componente de navegación que previene la recarga de página.

### Props

| Prop | Tipo | Requerido | Descripción |
|------|------|-----------|-------------|
| `to` | `string` | Sí | Ruta destino (interna) |
| `children` | `ReactNode` | Sí | Contenido del link |
| `className` | `string` | No | Clases CSS |
| `onClick` | `MouseEventHandler` | No | Click handler custom |
| `...rest` | `AnchorHTMLAttributes` | No | Todos los atributos `<a>` excepto `href` |

### Ejemplo

```tsx
import { Link } from '@arielgonzaguer/michi-router';

<Link to="/about">Acerca de</Link>
<Link to="/users/123" className="nav-link">Usuario</Link>
<Link to="/docs" onClick={() => console.log('navegando')}>Docs</Link>
```

### Comportamiento

1. Renderiza un `<a>` con `href` resuelto via `resolveInternalPath()`
2. En `onClick`, previene `e.preventDefault()` y llama a `navigate()`
3. Si la URL es externa o insegura, pone `href="#"` y bloquea la navegación
4. Soporta todos los atributos de `<a>` excepto `href` (que se calcula internamente)

---

## Protected

Guard genérico de autenticación. Bloquea el renderizado de hijos si no hay usuario autenticado.

### Props

| Prop | Tipo | Requerido | Descripción |
|------|------|-----------|-------------|
| `children` | `ReactNode` | Sí | Contenido protegido |
| `configObject` | `ProtectedConfig<TUser>` | Sí | Configuración de autenticación |

### ProtectedConfig<TUser>

| Prop | Tipo | Requerido | Descripción |
|------|------|-----------|-------------|
| `states` | `AuthState<TUser>` | Sí | `{ user: TUser \| null, isLoading: boolean }` |
| `redirectionPath` | `string` | Sí | Ruta a redirigir si no hay user |
| `loadingComponent` | `ReactNode` | No | Componente de loading |
| `defaultMessage` | `string` | No | Texto alternativo durante loading |

### Ejemplo

```tsx
import { Protected } from '@arielgonzaguer/michi-router';

function Dashboard() {
  const { user, isLoading } = useAuth(); // hook custom del usuario

  return (
    <Protected
      configObject={{
        states: { user, isLoading },
        redirectionPath: '/login',
        loadingComponent: <Spinner />,
      }}
    >
      <h1>Bienvenido, {user.name}</h1>
    </Protected>
  );
}
```

### Comportamiento

```
┌─────────────────────────────┐
│        Protected             │
│                             │
│  isLoading === true?        │
│  ├── Sí → loadingComponent  │
│  │        o defaultMessage  │
│  └── No ↓                   │
│                             │
│  user === null?             │
│  ├── Sí → navigate(         │
│  │    redirectionPath,      │
│  │    { replace: true }     │
│  │  )                       │
│  └── No → render children   │
└─────────────────────────────┘
```

**Seguridad:**
- `redirectionPath` se valida con `resolveInternalPath()` — bloquea `javascript:`, URLs externas, etc.
- El componente es agnóstico al provider de auth. El usuario pasa su propio estado.

---

## Hooks

| Hook | Retorna | Descripción |
|------|---------|-------------|
| `useNavigate` | `NavigateFn` | Función `navigate(to, options?)` |
| `useLocation` | `RouterLocation` | `{ pathname, search, hash, fullPath }` |
| `useParams<T>` | `T` | Parámetros de la ruta activa, tipados genéricamente |

### Ejemplo

```tsx
import { useNavigate, useLocation, useParams } from '@arielgonzaguer/michi-router';

function UserPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams<{ id: string }>();

  return (
    <div>
      <p>Ruta: {location.fullPath}</p>
      <p>Usuario: {id}</p>
      <button onClick={() => navigate('/')}>Volver</button>
    </div>
  );
}
```

---

## RouterContext

El estado compartido entre componentes:

```ts
interface RouterContextType {
  path: string;           // Ruta actual (sin basename)
  location: RouterLocation; // { pathname, search, hash, fullPath }
  params: RouteParams;    // Parámetros extraídos del matching
  basename: string;       // Basename normalizado
  navigate: NavigateFn;   // Función de navegación
}
```

## Referencias

- [architecture/routing.md](../architecture/routing.md) — Sistema de rutas
- [utils/overview.md](../utils/overview.md) — Types y path-utils
- [security/implementation.md](../security/implementation.md) — Seguridad
- Archivo fuente: `src/michi-router/Michi-router.tsx`
- Archivo fuente: `src/michi-router/Protected.tsx`
