import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

const routeMeta: Record<string, { title: string }> = {
  '/dashboard': { title: 'Dashboard' },
  '/rules': { title: 'Rules' },
  '/settings/drafts': { title: 'Drafting' },
  '/writing-style': { title: 'Writing Style' },
  '/signature-time-zone': { title: 'Signature & Time Zone' },
  '/account-settings': { title: 'Account' },
  '/onboarding/professional-context': { title: 'Professional Context' },
  '/settings/professional-context': { title: 'Professional Context' },
  '/settings/firm': { title: 'Firm Settings' },
  '/profile': { title: 'Profile' },
};

const AppLayout = () => {
  const location = useLocation();
  const meta = routeMeta[location.pathname];

  return (
    <div className="app-shell-bg min-h-screen theme-text-primary">
      <Topbar />
      <Sidebar />
      <main className="app-main-bg ml-12 mt-11 h-[calc(100vh-2.75rem)] overflow-y-auto p-6">
        {meta?.title ? (
          <header className="mb-6">
            <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">{meta.title}</h1>
          </header>
        ) : null}
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;
