import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

const routeMeta: Record<string, { title: string; action?: string }> = {
  '/dashboard': { title: 'Dashboard', action: 'Add' },
  '/inbox': { title: 'Inbox', action: 'New' },
  '/rules': { title: 'Rules', action: 'Add Rule' },
  '/settings': { title: 'Settings', action: 'Save' },
  '/profile': { title: 'Profile', action: 'Edit' },
};

const AppLayout = () => {
  const location = useLocation();
  const meta = routeMeta[location.pathname];

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <Topbar title={meta?.title} primaryActionLabel={meta?.action} />
      <Sidebar />
      <main className="ml-16 mt-16 h-[calc(100vh-4rem)] overflow-y-auto p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;
