import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

const pageMeta: Record<string, { title: string; actionLabel?: string }> = {
  '/dashboard': { title: 'Dashboard', actionLabel: 'New report' },
  '/inbox': { title: 'Inbox', actionLabel: 'New message' },
  '/rules': { title: 'Rules', actionLabel: 'Add rule' },
  '/settings': { title: 'Settings', actionLabel: 'Save' },
};

const AppLayout = () => {
  const location = useLocation();
  const currentMeta = pageMeta[location.pathname] ?? { title: 'XProFlow', actionLabel: 'Add' };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <Topbar title={currentMeta.title} primaryActionLabel={currentMeta.actionLabel} />
      <Sidebar />
      <main className="ml-16 mt-16 h-[calc(100vh-4rem)] overflow-y-auto p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;
