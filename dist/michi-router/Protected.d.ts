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
export default function Protected<TUser = any>({ children, configObject }: ProtectedProps<TUser>): JSX.Element | null;
