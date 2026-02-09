import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react';

type NavigateOptions = {
  replace?: boolean;
};

type RouterState = {
  pathname: string;
  search: string;
  navigate: (to: string, options?: NavigateOptions) => void;
};

type RouteProps = {
  path?: string;
  index?: boolean;
  element?: React.ReactNode;
  children?: React.ReactNode;
};

type NavLinkProps = {
  to: string;
  className?: string | ((props: { isActive: boolean }) => string);
  children?: React.ReactNode | ((props: { isActive: boolean }) => React.ReactNode);
};

type LinkProps = {
  to: string;
  className?: string;
  children?: React.ReactNode;
};

const RouterContext = createContext<RouterState | null>(null);
const OutletContext = createContext<React.ReactNode>(null);

const normalizePathname = (pathname: string) => {
  if (!pathname) {
    return '/';
  }
  return pathname.startsWith('/') ? pathname : `/${pathname}`;
};

const matchRoutePath = (routePath: string, pathname: string) => {
  if (routePath === '*') {
    return true;
  }
  const normalizedPath = normalizePathname(routePath);
  return normalizedPath === normalizePathname(pathname);
};

type RouteMatch = {
  element?: React.ReactNode;
  outlet?: React.ReactNode;
};

const matchRoutes = (children: React.ReactNode, pathname: string): RouteMatch | null => {
  const routeElements = React.Children.toArray(children).filter(React.isValidElement);
  for (const routeElement of routeElements) {
    if (routeElement.type !== Route) {
      continue;
    }

    const routeProps = routeElement.props as RouteProps;
    if (routeProps.children) {
      const nestedMatch = matchRoutes(routeProps.children, pathname);
      if (nestedMatch) {
        return {
          element: routeProps.element,
          outlet: nestedMatch.element
        };
      }
    }

    if (routeProps.index && normalizePathname(pathname) === '/') {
      return { element: routeProps.element };
    }

    if (routeProps.path && matchRoutePath(routeProps.path, pathname)) {
      return { element: routeProps.element };
    }
  }

  return null;
};

export const BrowserRouter = ({ children }: { children: React.ReactNode }) => {
  const [locationState, setLocationState] = useState(() => ({
    pathname: typeof window === 'undefined' ? '/' : window.location.pathname || '/',
    search: typeof window === 'undefined' ? '' : window.location.search || ''
  }));

  const parseLocation = useCallback((to: string) => {
    if (typeof window === 'undefined') {
      return { pathname: normalizePathname(to), search: '' };
    }
    const url = new URL(to, window.location.origin);
    return {
      pathname: normalizePathname(url.pathname),
      search: url.search
    };
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined;
    }
    const handlePopState = () =>
      setLocationState({
        pathname: window.location.pathname || '/',
        search: window.location.search || ''
      });
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = useCallback(
    (to: string, options?: NavigateOptions) => {
      if (typeof window === 'undefined') {
        return;
      }
      const next = parseLocation(to);
      const nextUrl = `${next.pathname}${next.search}`;
      if (options?.replace) {
        window.history.replaceState({}, '', nextUrl);
      } else {
        window.history.pushState({}, '', nextUrl);
      }
      setLocationState(next);
    },
    [parseLocation]
  );

  const value = useMemo(
    () => ({ pathname: locationState.pathname, search: locationState.search, navigate }),
    [locationState.pathname, locationState.search, navigate]
  );

  return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>;
};

export const Routes = ({ children }: { children: React.ReactNode }) => {
  const router = useContext(RouterContext);
  const pathname = router?.pathname ?? '/';
  const match = matchRoutes(children, pathname);

  if (!match?.element) {
    return null;
  }

  if (match.outlet) {
    return <OutletContext.Provider value={match.outlet}>{match.element}</OutletContext.Provider>;
  }

  return <>{match.element}</>;
};

export const Route = (_props: RouteProps) => null;

export const Outlet = () => {
  const outlet = useContext(OutletContext);
  return <>{outlet}</>;
};

export const Navigate = ({ to, replace }: { to: string; replace?: boolean }) => {
  const router = useContext(RouterContext);
  useEffect(() => {
    router?.navigate(to, { replace });
  }, [router, to, replace]);
  return null;
};

export const useNavigate = () => {
  const router = useContext(RouterContext);
  return (to: string, options?: NavigateOptions) => router?.navigate(to, options);
};

export const useLocation = () => {
  const router = useContext(RouterContext);
  return { pathname: router?.pathname ?? '/', search: router?.search ?? '' };
};

export const Link = ({ to, className, children }: LinkProps) => {
  const navigate = useNavigate();
  return (
    <a
      href={to}
      className={className}
      onClick={(event) => {
        event.preventDefault();
        navigate(to);
      }}
    >
      {children}
    </a>
  );
};

export const NavLink = ({ to, className, children }: NavLinkProps) => {
  const location = useLocation();
  const isActive = normalizePathname(location.pathname) === normalizePathname(to);
  const resolvedClassName =
    typeof className === 'function' ? className({ isActive }) : className ?? '';
  const resolvedChildren =
    typeof children === 'function' ? children({ isActive }) : children;

  return (
    <Link to={to} className={resolvedClassName}>
      {resolvedChildren}
    </Link>
  );
};
