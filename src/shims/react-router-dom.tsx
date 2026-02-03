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
  const [pathname, setPathname] = useState(() =>
    typeof window === 'undefined' ? '/' : window.location.pathname || '/'
  );

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined;
    }
    const handlePopState = () => setPathname(window.location.pathname || '/');
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = useCallback((to: string, options?: NavigateOptions) => {
    if (typeof window === 'undefined') {
      return;
    }
    const next = normalizePathname(to);
    if (options?.replace) {
      window.history.replaceState({}, '', next);
    } else {
      window.history.pushState({}, '', next);
    }
    setPathname(next);
  }, []);

  const value = useMemo(() => ({ pathname, navigate }), [pathname, navigate]);

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
  return { pathname: router?.pathname ?? '/' };
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
