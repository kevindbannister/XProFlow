import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import ContentArea from './ContentArea';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { classNames } from '../../lib/utils';

type ThemeMode = 'dark' | 'light';

const DashboardShell = () => {
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
    setMobileSidebarOpen(false);
  }, [location.pathname]);

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
        theme={theme}
        className="hidden md:flex"
      />
      <div
        className={classNames(
          'relative z-10 flex min-h-screen flex-1 flex-col transition-[margin] duration-300',
          sidebarCollapsed ? 'md:ml-[7rem]' : 'md:ml-[19rem]'
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
        <ContentArea>
          <Outlet />
        </ContentArea>
      </div>
      <div
        className={classNames(
          'fixed inset-0 z-40 bg-slate-950/30 opacity-0 transition md:hidden',
          mobileSidebarOpen ? 'opacity-100' : 'pointer-events-none'
        )}
        onClick={() => setMobileSidebarOpen(false)}
      />
      <Sidebar
        collapsed={false}
        onToggle={() => undefined}
        theme={theme}
        showCollapseToggle={false}
        onNavigate={() => setMobileSidebarOpen(false)}
        className={classNames(
          'sidebar-mobile bottom-0 left-0 top-0 z-50 w-72 shadow-2xl transition-transform md:hidden',
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      />
    </div>
  );
};

export default DashboardShell;
