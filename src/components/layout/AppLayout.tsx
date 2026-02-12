import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './MainTopBar';

const routeTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/inbox': 'Inbox',
  '/rules': 'Rules',
  '/settings': 'Settings',
  '/profile': 'Profile',
};

const AppLayout = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <TopBar title={routeTitles[location.pathname]} />
      <Sidebar />
      <main className="ml-16 mt-16 h-[calc(100vh-4rem)] overflow-y-auto px-6 py-6">
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;
