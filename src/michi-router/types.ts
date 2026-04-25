import type { AnchorHTMLAttributes, ComponentType, ReactNode } from 'react';

export interface LayoutProps {
  children: ReactNode;
}

export type RouteParams = Record<string, string>;

export interface RouterLocation {
  pathname: string;
  search: string;
  hash: string;
  fullPath: string;
}

export interface NavigateOptions {
  replace?: boolean;
  state?: unknown;
}

export type NavigateFn = (to: string, options?: NavigateOptions) => void;

export interface Route {
  path: string;
  component: ReactNode;
}

export interface RouterContextType {
  path: string;
  location: RouterLocation;
  params: RouteParams;
  basename: string;
  navigate: NavigateFn;
}

export interface RouterProviderProps {
  routes: Route[];
  children?: ReactNode;
  notFound?: ReactNode;
  basename?: string;
  layout?: ComponentType<{ children: ReactNode }>;
}

export interface LinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  to: string;
  children: ReactNode;
  className?: string;
}

export interface AuthState<TUser = unknown> {
  user: TUser | null;
  isLoading: boolean;
}

export interface ProtectedConfig<TUser = unknown> {
  states: AuthState<TUser>;
  redirectionPath: string;
  loadingComponent?: ReactNode;
  defaultMessage?: string;
}

export interface ProtectedProps<TUser = unknown> {
  children: ReactNode;
  configObject: ProtectedConfig<TUser>;
}
