# Michi Router

![npm version](https://img.shields.io/npm/v/@arielgonzaguer/michi-router)
![bundle size](https://img.shields.io/bundlephobia/minzip/@arielgonzaguer/michi-router)
![license](https://img.shields.io/npm/l/@arielgonzaguer/michi-router)

![Logo de MichiRouter](https://cdn.jsdelivr.net/gh/Ariel-GonzAguer/michi-router@main/public/michiRouter_LOGO.png)

El router minimalista y simple para React.
El objetivo principal de esta herramienta es proporcionar la funcionalidad básica de enrutamiento.
No requiere de ninguna dependencia externa, ideal para proyectos pequeños.
Creado con TypeScript.

## 🚀 Características

- ✅ **Minimalista**: Solo las funcionalidades esenciales de enrutamiento
- ✅ **TypeScript**: Completamente tipado para mejor experiencia de desarrollo
- ✅ **Zero dependencias**: No requiere librerías externas
- ✅ **Liviano**: Bundle pequeño y optimizado
- ✅ **Componente Protected**: Control de acceso integrado
- ✅ **SSR Compatible**: Funciona con Next.js y otras soluciones SSR

## 📦 Instalación

```bash
npm install @arielgonzaguer/michi-router
```

## 🔧 Uso Básico

### Configuración del Router

```tsx
import React from 'react';
import { RouterProvider, Link } from '@arielgonzaguer/michi-router';

// Definir rutas
const routes = [
  { path: '/', component: <Home /> },
  { path: '/about', component: <About /> },
  { path: '/contact', component: <Contact /> }
];

function App() {
  return (
    <RouterProvider routes={routes}>
      {/* Componente para páginas no encontradas (404) */}
      <NotFound />
    </RouterProvider>
  );
}

// Componentes de ejemplo
function Home() {
  return (
    <div>
      <h1>Inicio</h1>
      <Link to="/about">Ir a Acerca de</Link>
    </div>
  );
}

function About() {
  return (
    <div>
      <h1>Acerca de</h1>
      <Link to="/">Volver al inicio</Link>
    </div>
  );
}

function NotFound() {
  return <h1>Página no encontrada</h1>;
}
```

### Navegación Programática

```tsx
import React from 'react';
import { useNavigate } from '@arielgonzaguer/michi-router';

function MyComponent() {
  const navigate = useNavigate();

  const handleButtonClick = () => {
    // Navegar programáticamente
    navigate('/contact');
  };

  return (
    <button onClick={handleButtonClick}>
      Ir a contacto
    </button>
  );
}
```

### Componente Protected (Control de Acceso)

```tsx
import React, { useState, useEffect } from 'react';
import { RouterProvider, Protected } from '@arielgonzaguer/michi-router';

function App() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Simular carga de usuario
  useEffect(() => {
    setTimeout(() => {
      setUser({ id: 1, name: 'Juan' }); // o null si no está autenticado
      setIsLoading(false);
    }, 2000);
  }, []);

  const routes = [
    { path: '/', component: <Home /> },
    { path: '/login', component: <Login /> },
    { 
      path: '/dashboard', 
      component: (
        <Protected 
          configObject={{
            states: { user, isLoading },
            redirectionPath: '/login',
            loadingComponent: <div>Cargando...</div>,
            defaultMessage: 'Verificando acceso...'
          }}
        >
          <Dashboard />
        </Protected>
      )
    }
  ];

  return <RouterProvider routes={routes} />;
}
```

### Layout Compartido

```tsx
import React from 'react';
import { RouterProvider } from '@arielgonzaguer/michi-router';

// Componente Layout
function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <header>
        <nav>
          <Link to="/">Inicio</Link>
          <Link to="/about">Acerca</Link>
        </nav>
      </header>
      <main>{children}</main>
      <footer>© 2024 Mi App</footer>
    </div>
  );
}

function App() {
  return (
    <RouterProvider 
      routes={routes}
      layout={Layout}
    >
      <NotFound />
    </RouterProvider>
  );
}
```

## 📋 API Reference

### RouterProvider

Props:
- `routes`: Array de objetos `{ path: string, component: ReactNode }`
- `children?`: Componente a renderizar cuando no hay coincidencias (404)
- `layout?`: Componente que envuelve todas las rutas

### Link

Props:
- `to`: Ruta de destino
- `children`: Contenido del enlace
- `className?`: Clases CSS opcionales
- Acepta todas las props de `<a>` excepto `href`

### Protected

Props:
- `children`: Componente a proteger
- `configObject`: Objeto de configuración con:
  - `states`: `{ user: any, isLoading: boolean }`
  - `redirectionPath`: Ruta de redirección si no está autenticado
  - `loadingComponent?`: Componente a mostrar mientras carga
  - `defaultMessage?`: Mensaje por defecto (no recomendado para React Native)

### useNavigate

Hook que retorna una función `navigate(path: string)` para navegación programática.

## 🔒 Consideraciones de Seguridad

- Las rutas son validadas automáticamente
- No se ejecuta código arbitrario en las URLs
- Compatible con Content Security Policy (CSP)
- Previene ataques XSS al no usar `dangerouslySetInnerHTML`

## 📱 React Native

Michi Router es compatible con React Native con algunas consideraciones:

1. **No usar `defaultMessage`**: En React Native, siempre proporciona un `loadingComponent`
2. **Ejemplo para React Native**:

```tsx
import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { Protected } from '@arielgonzaguer/michi-router';

const LoadingComponent = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <ActivityIndicator size="large" />
    <Text>Cargando...</Text>
  </View>
);

// Usar en React Native
<Protected 
  configObject={{
    states: { user, isLoading },
    redirectionPath: '/login',
    loadingComponent: <LoadingComponent />
  }}
>
  <YourComponent />
</Protected>
```

Ver [REACT_NATIVE_SUPPORT.md](./REACT_NATIVE_SUPPORT.md) para más detalles.

## 🌐 Server Side Rendering (SSR)

Compatible con Next.js y otras soluciones SSR. El router detecta automáticamente si se ejecuta en el servidor y maneja la navegación apropiadamente.

## 📚 Compatibilidad

- React 17+
- TypeScript 4.0+
- Navegadores modernos (ES2020+)
- React Native (con consideraciones especiales)
- Next.js y otras soluciones SSR

## 📄 Licencia

MIT - Ver [LICENSE.txt](./LICENSE.txt) para más detalles.

## 🤝 Contribución

Las contribuciones son bienvenidas. Por favor, abre un issue primero para discutir los cambios propuestos.

---

Visite la [Documentación oficial](https://michirouter.vercel.app/) para ejemplos interactivos y más detalles.
