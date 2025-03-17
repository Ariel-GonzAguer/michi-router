import React from 'react';
import { createContext, useContext, useState, useEffect } from 'react';
import type { RouterContextType, RouterProviderProps, LinkProps, LayoutProps } from './types';

// Creación del contexto con un valor inicial
const RouterContext = createContext<RouterContextType>({
  path: '',
  navigate: () => { }
});


export function RouterProvider({ routes, children, layout: Layout }: RouterProviderProps & { layout?: LayoutProps }) {
  const [path, setPath] = useState(window.location.pathname);

  useEffect(() => {
    const handlePopState = () => setPath(window.location.pathname);
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (to: string) => {
    window.history.pushState({}, '', to);
    setPath(to);
  };

  const currentRoute = routes.find(route => route.path === path);
  const routeContent = currentRoute ? currentRoute.component : children;

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
}

export const Link = ({ to, children, className }: LinkProps) => {
  const { navigate } = useContext(RouterContext);

  return (
    <a
      href={to}
      className={className}
      style={{ marginRight: '1rem' }}
      onClick={(e) => {
        e.preventDefault();
        navigate(to);
      }}
    >
      {children}
    </a>
  );
};

export const useNavigate = () => {
  const { navigate } = useContext(RouterContext);
  return navigate;
};

// Exportamos el contexto para que pueda ser usado por otros componentes si es necesario
export { RouterContext };