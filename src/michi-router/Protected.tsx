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

  const config = {
    states: configObject?.states || null,
    redirectionPath: configObject?.redirectionPath || "/",
    loadingComponent: configObject?.loadingComponent || null,
  defaultMessage: configObject?.defaultMessage ?? true, // Mensaje por defecto si no se provee loadingComponent
  };

  if (!config.states) {
    console.error("Protected component: 'states' is required in configObject.");
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
    return config.defaultMessage ? <div>Cargando...</div> : null;
  }

  return user ? children : null;
}
