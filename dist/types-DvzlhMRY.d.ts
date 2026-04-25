import { ReactNode, AnchorHTMLAttributes, ComponentType } from 'react';

interface LayoutProps {
    children: ReactNode;
}
type RouteParams = Record<string, string>;
interface RouterLocation {
    pathname: string;
    search: string;
    hash: string;
    fullPath: string;
}
interface NavigateOptions {
    replace?: boolean;
    state?: unknown;
}
type NavigateFn = (to: string, options?: NavigateOptions) => void;
interface Route {
    path: string;
    component: ReactNode;
}
interface RouterContextType {
    path: string;
    location: RouterLocation;
    params: RouteParams;
    basename: string;
    navigate: NavigateFn;
}
interface RouterProviderProps {
    routes: Route[];
    children?: ReactNode;
    notFound?: ReactNode;
    basename?: string;
    layout?: ComponentType<{
        children: ReactNode;
    }>;
}
interface LinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
    to: string;
    children: ReactNode;
    className?: string;
}
interface AuthState<TUser = unknown> {
    user: TUser | null;
    isLoading: boolean;
}
interface ProtectedConfig<TUser = unknown> {
    states: AuthState<TUser>;
    redirectionPath: string;
    loadingComponent?: ReactNode;
    defaultMessage?: string;
}
interface ProtectedProps<TUser = unknown> {
    children: ReactNode;
    configObject: ProtectedConfig<TUser>;
}

export type { AuthState as A, LayoutProps as L, NavigateFn as N, ProtectedConfig as P, Route as R, LinkProps as a, NavigateOptions as b, ProtectedProps as c, RouteParams as d, RouterContextType as e, RouterLocation as f, RouterProviderProps as g };
