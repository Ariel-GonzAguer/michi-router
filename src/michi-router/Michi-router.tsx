import React, { useCallback, createContext, useContext, useState, useEffect } from 'react';
import type { RouterContextType, RouterProviderProps, LinkProps } from './types';

// Creación del contexto con un valor inicial
const RouterContext = createContext<RouterContextType>({
  path: window.location.pathname,
  navigate: () => {
    console.warn('RouterContext usado fuera de RouterProvider');
  }
});

/**
 * Proveedor principal del enrutador.
 * @param routes - Array de rutas disponibles
 * @param children - Contenido a mostrar cuando no hay coincidencia de ruta (404)
 * @param layout - Componente de layout opcional para envolver todas las rutas
 */
export function RouterProvider({ routes, children, layout: Layout }: RouterProviderProps) {
  const [path, setPath] = useState(window.location.pathname);

  useEffect(() => {
    const handlePopState = () => setPath(window.location.pathname);
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = useCallback((to: string) => {
    window.history.pushState({}, '', to);
    setPath(to);
  }, []);

  // Encontrar la ruta actual
  const currentRoute = routes.find(route => route.path === path);
  const routeContent = currentRoute ? currentRoute.component : children;

  try {
    return (
      <RouterContext.Provider value={{ path, navigate }}>
        {Layout ? (
          <Layout>
            {routeContent}
          </Layout>
        ) : (
          routeContent
        )}
      </RouterContext.Provider>
    );
  } catch (error) {
    console.error('Error en RouterProvider:', error);
    return <div>Error en el enrutador. Consulta la consola para más detalles.</div>;
  }

}

/**
 * Componente Link para navegación declarativa.
 * Previene la recarga de página y utiliza el historial del navegador.
 */
export const Link = ({ to, children, className, ...rest }: LinkProps & React.AnchorHTMLAttributes<HTMLAnchorElement>) => {
  const { navigate } = useContext(RouterContext);

  return (
    <a
      href={to}
      className={className}
      onClick={(e) => {
        e.preventDefault();
        navigate(to);
      }}
      {...rest} // se puede agregar más props si es necesario
    >
      {children}
    </a>
  );
};

/**
 * Hook para acceder a la función de navegación programática.
 * @returns Función navigate que permite cambiar de ruta
 */
export const useNavigate = () => {
  const { navigate } = useContext(RouterContext);
  return navigate;
};

// Exportamos el contexto para que pueda ser usado por otros componentes si es necesario
export { RouterContext };
