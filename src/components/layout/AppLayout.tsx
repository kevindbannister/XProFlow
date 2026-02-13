import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

const routeMeta: Record<string, { title: string }> = {
  '/dashboard': { title: 'Dashboard' },
  '/rules': { title: 'Rules' },
  '/settings': { title: 'Settings' },
  '/profile': { title: 'Profile' },
};

const AppLayout = () => {
  const location = useLocation();
  const meta = routeMeta[location.pathname];

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <Topbar title={meta?.title} />
      <Sidebar />
      <main className="ml-16 mt-16 h-[calc(100vh-4rem)] overflow-y-auto p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;
