import React$1, { ReactNode } from 'react';
import * as react_jsx_runtime from 'react/jsx-runtime';

interface LayoutProps {
    children: ReactNode;
}
interface Route {
    path: string;
    component: ReactNode;
}
interface RouterContextType {
    path: string;
    navigate: (to: string) => void;
}
interface RouterProviderProps {
    routes: Array<{
        path: string;
        component: React.ReactNode;
    }>;
    children?: React.ReactNode;
    layout?: React.ComponentType<{
        children: React.ReactNode;
    }>;
}
interface LinkProps extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
    to: string;
    children: ReactNode;
    className?: string;
}
interface AuthState<TUser = any> {
    user: TUser | null;
    isLoading: boolean;
}
interface ProtectedConfig<TUser = any> {
    states: AuthState<TUser>;
    redirectionPath: string;
    loadingComponent?: ReactNode;
    defaultMessage?: string;
}
interface ProtectedProps<TUser = any> {
    children: JSX.Element;
    configObject: ProtectedConfig<TUser>;
}

/**
 * Proveedor principal del enrutador.
 * @param routes - Array de rutas disponibles
 * @param children - Contenido a mostrar cuando no hay coincidencia de ruta (404)
 * @param layout - Componente de layout opcional para envolver todas las rutas
 */
declare function RouterProvider({ routes, children, layout: Layout }: RouterProviderProps): react_jsx_runtime.JSX.Element;
/**
 * Componente Link para navegación declarativa.
 * Previene la recarga de página y utiliza el historial del navegador.
 */
declare const Link: ({ to, children, className, ...rest }: LinkProps & React$1.AnchorHTMLAttributes<HTMLAnchorElement>) => react_jsx_runtime.JSX.Element;
/**
 * Hook para acceder a la función de navegación programática.
 * @returns Función navigate que permite cambiar de ruta
 */
declare const useNavigate: () => (to: string) => void;

/**
 * Un componente que restringe el acceso a sus hijos según el estado de autenticación del usuario.
 *
 * Si el usuario no está autenticado, redirige a la página de landing ("/").
 * De lo contrario, renderiza sus hijos.
 *
 * @param {Object} props - Props del componente
 * @param {React.ReactNode} props.children - Los nodos React a renderizar si el usuario está autenticado.
 * @returns {JSX.Element|null} Los hijos si está autenticado, de lo contrario loader.
 */
declare function Protected<TUser = any>({ children, configObject }: ProtectedProps<TUser>): JSX.Element | null;

export { type LayoutProps, Link, type LinkProps, Protected, type ProtectedProps, type Route, type RouterContextType, RouterProvider, type RouterProviderProps, useNavigate };
