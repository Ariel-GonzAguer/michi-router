import React, { useEffect } from "react";
import { useNavigate } from "./Michi-router";
import { ProtectedProps } from "./types";

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
export default function Protected({ children, configObject }: ProtectedProps): JSX.Element | null {
  const navigate = useNavigate();

  /**
   * Objeto de configuración para el manejo de rutas protegidas.
   *
   * @property {Object} states - Contiene el estado actual del usuario y el estado de carga.
   * @property {any} states.user - El objeto o valor del usuario actual.
   * @property {boolean} states.isLoading - Indica si el proceso de autenticación/carga está en curso.
   * @property {string} redirectionPath - Ruta a la que se redirige si el usuario no está autenticado.
   * @property {React.ReactNode} [loadingComponent] - Componente personalizado opcional para mostrar mientras carga.
   * @property {string} [defaultMessage] - Mensaje por defecto a mostrar si no se provee loadingComponent. Si no se provee ningún mensaje, no se muestra nada.
   */
  const config: {
    states: { user: any; isLoading: boolean };
    redirectionPath: string;
    loadingComponent?: React.ReactNode;
    defaultMessage?: string;
  } = {
    states: configObject?.states || null,
    redirectionPath: configObject?.redirectionPath || "/",
    loadingComponent: configObject?.loadingComponent || null,
    defaultMessage: configObject?.defaultMessage || undefined,
  };

  if (!config.states) {
    console.error(
      "Componente Protected: El objeto de configuración es inválido. Este es el formato esperado:\n{\n  states: { user: any; isLoading: boolean };\n  redirectionPath: string;\n  loadingComponent?: React.ReactNode;\n  defaultMessage?: string;\n}"
    );
    return null;
  }
  // Leemos el estado directamente desde el store
  const { user, isLoading } = config.states;

  useEffect(() => {
    // Redirigir solo cuando haya terminado de cargar y el usuario NO esté autenticado
    if (!isLoading && !user) {
      navigate(config.redirectionPath);
    }
  }, [isLoading, user, navigate, config.redirectionPath]);

  // Mientras carga, mostrar loadingComponent si está definido, si no y defaultMessage true mostrar texto
  if (isLoading) {
    if (config.loadingComponent) return config.loadingComponent as JSX.Element;
    return config.defaultMessage ? <div>{config.defaultMessage}</div> : null;
  }

  return user ? children : null;
}
