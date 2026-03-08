import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';

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
  const isInboxRoute = location.pathname.startsWith('/inbox');

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 dark:bg-slate-900 dark:text-slate-100">
      <Sidebar />
      <main className="flex-1 overflow-auto p-6">
        {!isInboxRoute && meta?.title ? (
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
