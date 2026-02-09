import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

type ThemeMode = 'dark' | 'light';

const AppShell = () => {
  const theme: ThemeMode = 'light';
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    if (typeof window === 'undefined') {
      return false;
    }
    return localStorage.getItem('sidebarCollapsed') === 'true';
  });
  const location = useLocation();
  const { user } = useUser();
  const firstName = user.name.split(' ')[0];
  const topbarTitle =
    location.pathname === '/inbox' ? `Welcome back, ${firstName}` : undefined;

  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', String(sidebarCollapsed));
  }, [sidebarCollapsed]);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', theme === 'dark');
    root.classList.toggle('theme-dark', theme === 'dark');
    root.classList.toggle('theme-light', theme === 'light');
  }, [theme]);

  return (
    <div className="relative min-h-screen overflow-hidden app-shell-bg text-slate-900 dark:text-slate-100">
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed((current) => !current)}
      />
      <div
        className="relative z-10 flex min-h-screen flex-1 flex-col ml-20"
      >
        <Topbar title={topbarTitle} />
        <main className="flex-1 space-y-6 px-8 py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppShell;
