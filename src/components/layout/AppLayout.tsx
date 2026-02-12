import { useMemo } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

type RouteLayoutMeta = {
  title: string;
  primaryActionLabel?: string;
  primaryActionPath?: string;
};

const routeMeta: Array<{ matcher: (pathname: string) => boolean; meta: RouteLayoutMeta }> = [
  {
    matcher: (pathname) => pathname === '/dashboard',
    meta: { title: 'Dashboard', primaryActionLabel: 'New workflow', primaryActionPath: '/workflows' }
  },
  {
    matcher: (pathname) => pathname.startsWith('/inbox'),
    meta: { title: 'Inbox', primaryActionLabel: 'Compose', primaryActionPath: '/inbox' }
  },
  {
    matcher: (pathname) => pathname.startsWith('/rules'),
    meta: { title: 'Rules', primaryActionLabel: 'Add rule', primaryActionPath: '/rules' }
  },
  {
    matcher: (pathname) => pathname.startsWith('/settings'),
    meta: { title: 'Settings', primaryActionLabel: 'New setting', primaryActionPath: '/settings' }
  }
];

const defaultMeta: RouteLayoutMeta = {
  title: 'XProFlow',
  primaryActionLabel: 'New',
  primaryActionPath: '/inbox'
};

const AppLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const currentMeta = useMemo(
    () => routeMeta.find((item) => item.matcher(location.pathname))?.meta ?? defaultMeta,
    [location.pathname]
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Topbar
        title={currentMeta.title}
        primaryActionLabel={currentMeta.primaryActionLabel}
        onPrimaryAction={() => navigate(currentMeta.primaryActionPath ?? '/inbox')}
      />
      <Sidebar />
      <main className="ml-16 pt-16">
        <div className="h-[calc(100vh-4rem)] overflow-y-auto px-6 py-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AppLayout;
