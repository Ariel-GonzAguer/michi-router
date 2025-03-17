import React from 'react';
import type { RouterContextType, RouterProviderProps, LinkProps } from './types';
declare const RouterContext: React.Context<RouterContextType>;
/**
 * Proveedor principal del enrutador.
 * @param routes - Array de rutas disponibles
 * @param children - Contenido a mostrar cuando no hay coincidencia de ruta (404)
 * @param layout - Componente de layout opcional para envolver todas las rutas
 */
export declare function RouterProvider({ routes, children, layout: Layout }: RouterProviderProps): React.JSX.Element;
/**
 * Componente Link para navegación declarativa.
 * Previene la recarga de página y utiliza el historial del navegador.
 */
export declare const Link: ({ to, children, className, ...rest }: LinkProps & React.AnchorHTMLAttributes<HTMLAnchorElement>) => React.JSX.Element;
/**
 * Hook para acceder a la función de navegación programática.
 * @returns Función navigate que permite cambiar de ruta
 */
export declare const useNavigate: () => (to: string) => void;
export { RouterContext };
