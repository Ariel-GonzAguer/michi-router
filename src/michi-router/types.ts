import { ReactNode } from "react";

export interface LayoutProps {
  children: ReactNode;
}

export interface Route {
  path: string;
  component: ReactNode;
}

export interface RouterContextType {
  path: string;
  navigate: (to: string) => void;
}

export interface RouterProviderProps {
  routes: Array<{
    path: string;
    component: React.ReactNode;
  }>;
  children?: React.ReactNode;
  layout?: React.ComponentType<{ children: React.ReactNode }>;
}

export interface LinkProps extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  to: string;
  children: ReactNode;
  className?: string;
}

// Mejorado: Tipos más específicos para el estado de autenticación
export interface AuthState<TUser = any> {
  user: TUser | null;
  isLoading: boolean;
}

// Mejorado: Configuración más tipada para el componente Protected
export interface ProtectedConfig<TUser = any> {
  states: AuthState<TUser>;
  redirectionPath: string;
  loadingComponent?: ReactNode;
  defaultMessage?: string;
}

// Protected component props con mejor tipado
export interface ProtectedProps<TUser = any> {
  children: JSX.Element;
  configObject: ProtectedConfig<TUser>;
}