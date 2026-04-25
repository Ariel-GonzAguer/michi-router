import React, { useCallback, createContext, useContext, useEffect, useMemo, useState } from 'react';
import type {
  LinkProps,
  NavigateFn,
  RouteParams,
  RouterContextType,
  RouterLocation,
  RouterProviderProps,
} from './types';
import { matchRoutePath, normalizeBasename, normalizePathname, resolveInternalPath } from './path-utils';

const isBrowser = typeof window !== 'undefined';

const DEFAULT_LOCATION: RouterLocation = {
  pathname: '/',
  search: '',
  hash: '',
  fullPath: '/',
};

const getCurrentLocation = (basename: string): RouterLocation => {
  if (!isBrowser) return DEFAULT_LOCATION;

  const currentPath = `${window.location.pathname}${window.location.search}${window.location.hash}`;
  const resolved = resolveInternalPath(currentPath, basename);

  if (resolved) {
    return {
      pathname: resolved.pathname,
      search: resolved.search,
      hash: resolved.hash,
      fullPath: resolved.fullPath,
    };
  }

  const fallbackPath = normalizePathname(window.location.pathname);
  return {
    pathname: fallbackPath,
    search: window.location.search,
    hash: window.location.hash,
    fullPath: `${fallbackPath}${window.location.search}${window.location.hash}`,
  };
};

const RouterContext = createContext<RouterContextType>({
  path: '/',
  location: DEFAULT_LOCATION,
  params: {},
  basename: '/',
  navigate: () => {
    console.warn('RouterContext usado fuera de RouterProvider');
  },
});

export function RouterProvider({ routes, children, notFound, basename, layout: Layout }: RouterProviderProps) {
  const normalizedBasename = useMemo(() => normalizeBasename(basename), [basename]);
  const [location, setLocation] = useState<RouterLocation>(() => getCurrentLocation(normalizedBasename));

  useEffect(() => {
    if (!isBrowser) return;

    const handlePopState = () => setLocation(getCurrentLocation(normalizedBasename));
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [normalizedBasename]);

  const navigate = useCallback<NavigateFn>(
    (to, options) => {
      const resolved = resolveInternalPath(to, normalizedBasename);
      if (!resolved) {
        console.warn(`MichiRouter: navegación bloqueada. URL interna no válida: "${to}"`);
        return;
      }

      const nextLocation: RouterLocation = {
        pathname: resolved.pathname,
        search: resolved.search,
        hash: resolved.hash,
        fullPath: resolved.fullPath,
      };

      if (!isBrowser) {
        setLocation(nextLocation);
        return;
      }

      if (options?.replace) {
        window.history.replaceState(options?.state ?? null, '', resolved.browserPath);
      } else {
        window.history.pushState(options?.state ?? null, '', resolved.browserPath);
      }

      setLocation(nextLocation);
    },
    [normalizedBasename]
  );

  const matchedRoute = useMemo(() => {
    for (const route of routes) {
      const params = matchRoutePath(route.path, location.pathname);
      if (params) {
        return { route, params };
      }
    }
    return null;
  }, [location.pathname, routes]);

  const params: RouteParams = matchedRoute?.params ?? {};
  const routeContent = matchedRoute ? matchedRoute.route.component : notFound ?? children;

  return (
    <RouterContext.Provider
      value={{
        path: location.pathname,
        location,
        params,
        basename: normalizedBasename,
        navigate,
      }}
    >
      {Layout ? <Layout>{routeContent}</Layout> : routeContent}
    </RouterContext.Provider>
  );
}

export const Link = ({ to, children, className, onClick, ...rest }: LinkProps) => {
  const { navigate, basename } = useContext(RouterContext);
  const resolved = resolveInternalPath(to, basename);
  const href = resolved ? resolved.browserPath : '#';

  return (
    <a
      href={href}
      className={className}
      onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
        onClick?.(e);
        if (e.defaultPrevented) return;
        e.preventDefault();
        navigate(to);
      }}
      {...rest}
    >
      {children}
    </a>
  );
};

export const useNavigate = (): NavigateFn => useContext(RouterContext).navigate;

export const useLocation = (): RouterLocation => useContext(RouterContext).location;

export const useParams = <T extends RouteParams = RouteParams>(): T => useContext(RouterContext).params as T;

export { RouterContext };
