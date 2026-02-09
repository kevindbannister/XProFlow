import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { classNames } from '../../lib/utils';

type ThemeMode = 'dark' | 'light';

const AppShell = () => {
  const [theme, setTheme] = useState<ThemeMode>('light');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    if (typeof window === 'undefined') {
      return false;
    }
    return localStorage.getItem('sidebarCollapsed') === 'true';
  });
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const location = useLocation();
  const { user } = useUser();
  const firstName = user.name.split(' ')[0];
  const topbarTitle =
    location.pathname === '/dashboard' ? `Welcome back, ${firstName}` : undefined;

  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', String(sidebarCollapsed));
  }, [sidebarCollapsed]);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', theme === 'dark');
    root.classList.toggle('theme-dark', theme === 'dark');
    root.classList.toggle('theme-light', theme === 'light');
  }, [theme]);

  useEffect(() => {
    document.body.classList.toggle('overflow-hidden', mobileSidebarOpen);
    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, [mobileSidebarOpen]);

  return (
    <div className="relative min-h-screen overflow-hidden app-shell-bg text-slate-900 dark:text-slate-100">
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed((current) => !current)}
        theme={theme}
        className="hidden lg:flex"
      />
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 theme-overlay"
            onClick={() => setMobileSidebarOpen(false)}
            aria-label="Close sidebar overlay"
          />
          <Sidebar
            collapsed={false}
            onToggle={() => undefined}
            theme={theme}
            className="relative h-full w-72"
            showClose
            showCollapseToggle={false}
            onClose={() => setMobileSidebarOpen(false)}
          />
        </div>
      )}
      <div
        className={classNames(
          'relative z-10 flex min-h-screen flex-1 flex-col',
          sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-72'
        )}
      >
        <Topbar
          theme={theme}
          onToggleTheme={() =>
            setTheme((current) => (current === 'dark' ? 'light' : 'dark'))
          }
          title={topbarTitle}
          onOpenSidebar={() => setMobileSidebarOpen(true)}
        />
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-10 lg:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppShell;
