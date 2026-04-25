import React, { useEffect } from "react";
import { useNavigate } from "./Michi-router";
import { ProtectedProps, ProtectedConfig } from "./types";
import { resolveInternalPath } from './path-utils';

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
const getSafeRedirectionPath = (path: string): string => {
  const resolved = resolveInternalPath(path, '/');
  return resolved ? resolved.fullPath : '/';
};

export default function Protected<TUser = unknown>({
  children,
  configObject
}: ProtectedProps<TUser>): React.ReactElement | null {
  const navigate = useNavigate();

  /**
   * Objeto de configuración para el manejo de rutas protegidas.
   *
   * @property {Object} states - Contiene el estado actual del usuario y el estado de carga.
   * @property {any} states.user - El objeto o valor del usuario actual.
   * @property {boolean} states.isLoading - Indica si el proceso de autenticación/carga está en curso.
   * @property {string} redirectionPath - Ruta a la que se redirige si el usuario no está autenticado.
   * @property {React.ReactNode} [loadingComponent] - Componente personalizado opcional para mostrar mientras carga.
   * @property {string} [defaultMessage] - Mensaje por defecto a mostrar si no se provee loadingComponent.
   */
  const config: ProtectedConfig<TUser> = {
    states: configObject?.states || { user: null, isLoading: false },
    redirectionPath: configObject?.redirectionPath || "/",
    loadingComponent: configObject?.loadingComponent || null,
    defaultMessage: configObject?.defaultMessage || undefined
  };

  if (!configObject?.states) {
    console.error(
      "Componente Protected: El objeto de configuración es inválido. Este es el formato esperado:\n{\n  states: { user: any; isLoading: boolean };\n  redirectionPath: string;\n  loadingComponent?: React.ReactNode;\n  defaultMessage?: string;\n}"
    );
    return null;
  }
  
  const safeRedirectionPath = getSafeRedirectionPath(config.redirectionPath);

  const { user, isLoading } = config.states;

  useEffect(() => {
    if (!isLoading && !user) {
      if (safeRedirectionPath !== config.redirectionPath) {
        console.warn(
          `Protected: redirectionPath inseguro bloqueado ("${config.redirectionPath}"). Se usa "/" como fallback.`
        );
      }
      navigate(safeRedirectionPath, { replace: true });
    }
  }, [isLoading, user, navigate, safeRedirectionPath, config.redirectionPath]);

  if (isLoading) {
    if (config.loadingComponent) return <>{config.loadingComponent}</>;
    return config.defaultMessage ? <>{config.defaultMessage}</> : null;
  }

  return user ? <>{children}</> : null;
}
