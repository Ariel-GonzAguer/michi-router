export type RouteParams = Record<string, string>;

export interface ResolvedInternalPath {
  pathname: string;
  search: string;
  hash: string;
  fullPath: string;
  browserPath: string;
}

const FALLBACK_ORIGIN = 'https://michi-router.local';
const SAFE_PROTOCOLS = new Set(['http:', 'https:']);

const ensureLeadingSlash = (value: string): string => (value.startsWith('/') ? value : `/${value}`);

export const normalizePathname = (value: string): string => {
  const trimmed = value.trim();
  if (!trimmed) return '/';

  const withLeadingSlash = ensureLeadingSlash(trimmed);
  const withoutTrailingSlash = withLeadingSlash.length > 1 ? withLeadingSlash.replace(/\/+$/, '') : withLeadingSlash;
  return withoutTrailingSlash || '/';
};

export const normalizeBasename = (basename?: string): string => {
  if (!basename) return '/';
  return normalizePathname(basename);
};

const hasBasename = (pathname: string, basename: string): boolean => {
  if (basename === '/') return true;
  return pathname === basename || pathname.startsWith(`${basename}/`);
};

const stripBasename = (pathname: string, basename: string): string => {
  if (basename === '/') return pathname;
  if (pathname === basename) return '/';
  if (pathname.startsWith(`${basename}/`)) {
    return pathname.slice(basename.length) || '/';
  }
  return pathname;
};

const joinBasename = (basename: string, pathname: string): string => {
  if (basename === '/') return pathname;
  return pathname === '/' ? basename : `${basename}${pathname}`;
};

const decodeSegment = (value: string): string => {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
};

export const resolveInternalPath = (to: string, basename = '/'): ResolvedInternalPath | null => {
  if (typeof to !== 'string') return null;

  const trimmed = to.trim();
  if (!trimmed) return null;
  if (/[\u0000-\u001f\u007f]/.test(trimmed)) return null;

  const normalizedBasename = normalizeBasename(basename);
  const baseOrigin = typeof window !== 'undefined' ? window.location.origin : FALLBACK_ORIGIN;
  const baseHref = normalizedBasename === '/' ? `${baseOrigin}/` : `${baseOrigin}${normalizedBasename}/`;

  let parsed: URL;
  try {
    parsed = new URL(trimmed, baseHref);
  } catch {
    return null;
  }

  if (!SAFE_PROTOCOLS.has(parsed.protocol)) return null;
  if (typeof window !== 'undefined' && parsed.origin !== window.location.origin) return null;

  const normalizedPathname = normalizePathname(parsed.pathname);
  const routerPathname = hasBasename(normalizedPathname, normalizedBasename)
    ? normalizePathname(stripBasename(normalizedPathname, normalizedBasename))
    : normalizedPathname;

  const browserPathname = normalizePathname(joinBasename(normalizedBasename, routerPathname));
  const search = parsed.search || '';
  const hash = parsed.hash || '';
  const fullPath = `${routerPathname}${search}${hash}`;
  const browserPath = `${browserPathname}${search}${hash}`;

  return {
    pathname: routerPathname,
    search,
    hash,
    fullPath,
    browserPath,
  };
};

export const matchRoutePath = (routePath: string, currentPath: string): RouteParams | null => {
  const normalizedRoute = normalizePathname(routePath);
  const normalizedCurrent = normalizePathname(currentPath);

  if (normalizedRoute === '*') {
    return { '*': normalizedCurrent === '/' ? '' : normalizedCurrent.slice(1) };
  }

  const routeSegments = normalizedRoute === '/' ? [] : normalizedRoute.slice(1).split('/');
  const pathSegments = normalizedCurrent === '/' ? [] : normalizedCurrent.slice(1).split('/');

  const params: RouteParams = {};
  let routeIndex = 0;
  let pathIndex = 0;

  while (routeIndex < routeSegments.length && pathIndex < pathSegments.length) {
    const routeSegment = routeSegments[routeIndex];

    if (routeSegment === '*') {
      if (routeIndex !== routeSegments.length - 1) return null;
      params['*'] = pathSegments.slice(pathIndex).map(decodeSegment).join('/');
      pathIndex = pathSegments.length;
      routeIndex = routeSegments.length;
      break;
    }

    const pathSegment = pathSegments[pathIndex];
    if (routeSegment.startsWith(':')) {
      const key = routeSegment.slice(1);
      if (!key) return null;
      params[key] = decodeSegment(pathSegment);
    } else if (routeSegment !== pathSegment) {
      return null;
    }

    routeIndex += 1;
    pathIndex += 1;
  }

  if (routeIndex < routeSegments.length && routeSegments[routeIndex] === '*' && routeIndex === routeSegments.length - 1) {
    params['*'] = '';
    routeIndex += 1;
  }

  if (routeIndex !== routeSegments.length || pathIndex !== pathSegments.length) {
    return null;
  }

  return params;
};
