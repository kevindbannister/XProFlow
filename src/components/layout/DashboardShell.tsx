import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import PageContainer from './PageContainer';

type ThemeMode = 'dark' | 'light';

const DashboardShell = () => {
  const [theme, setTheme] = useState<ThemeMode>('light');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    if (typeof window === 'undefined') {
      return false;
    }
    return localStorage.getItem('sidebarCollapsed') === 'true';
  });
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
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
    setIsMobileSidebarOpen(false);
  }, [location.pathname]);

  return (
    <div className="relative min-h-screen overflow-hidden app-shell-bg text-slate-900 dark:text-slate-100">
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed((current) => !current)}
        theme={theme}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />
      {isMobileSidebarOpen ? (
        <button
          type="button"
          aria-label="Close sidebar overlay"
          className="theme-overlay fixed inset-0 z-30 lg:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      ) : null}
      <div
        className={`relative z-10 flex min-h-screen flex-1 flex-col transition-[margin] duration-300 ${
          sidebarCollapsed ? 'lg:ml-[6rem]' : 'lg:ml-[19rem]'
        }`}
      >
        <div className="px-6 pt-6 lg:px-10 lg:pt-8">
          <Topbar
            theme={theme}
            onToggleTheme={() =>
              setTheme((current) => (current === 'dark' ? 'light' : 'dark'))
            }
            onOpenSidebar={() => setIsMobileSidebarOpen(true)}
            title={topbarTitle}
          />
        </div>
        <PageContainer className="pt-6 lg:pt-8">
          <Outlet />
        </PageContainer>
      </div>
    </div>
  );
};

export default DashboardShell;
