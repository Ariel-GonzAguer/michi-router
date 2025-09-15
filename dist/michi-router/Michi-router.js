import { jsx as _jsx } from "react/jsx-runtime";
import { useCallback, createContext, useContext, useState, useEffect } from 'react';
// Verificar si estamos en el navegador (no en SSR)
const isBrowser = typeof window !== 'undefined';
// Creación del contexto con un valor inicial
const RouterContext = createContext({
    path: isBrowser ? window.location.pathname : '/',
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
export function RouterProvider({ routes, children, layout: Layout }) {
    const [path, setPath] = useState(isBrowser ? window.location.pathname : '/');
    useEffect(() => {
        if (!isBrowser)
            return; // No hacer nada en SSR
        const handlePopState = () => setPath(window.location.pathname);
        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, []);
    const navigate = useCallback((to) => {
        if (!isBrowser)
            return; // No hacer nada en SSR
        // Validación básica de la URL para prevenir navegación a URLs maliciosas
        if (typeof to !== 'string' || to.includes('javascript:') || to.includes('data:')) {
            console.warn('MichiRouter: URL potencialmente insegura bloqueada:', to);
            return;
        }
        window.history.pushState({}, '', to);
        setPath(to);
    }, []);
    // Encontrar la ruta actual
    const currentRoute = routes.find(route => route.path === path);
    const routeContent = currentRoute ? currentRoute.component : children;
    try {
        return (_jsx(RouterContext.Provider, { value: { path, navigate }, children: Layout ? (_jsx(Layout, { children: routeContent })) : (routeContent) }));
    }
    catch (error) {
        console.error('Error en RouterProvider:', error);
        return _jsx("div", { children: "Error en el enrutador. Consulta la consola para m\u00E1s detalles." });
    }
}
/**
 * Componente Link para navegación declarativa.
 * Previene la recarga de página y utiliza el historial del navegador.
 */
export const Link = ({ to, children, className, ...rest }) => {
    const { navigate } = useContext(RouterContext);
    return (_jsx("a", { href: to, className: className, onClick: (e) => {
            e.preventDefault();
            navigate(to);
        }, ...rest, children: children }));
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
