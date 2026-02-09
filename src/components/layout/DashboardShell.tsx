import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import PageContainer from './PageContainer';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

type ThemeMode = 'dark' | 'light';

const DashboardShell = () => {
  const [theme, setTheme] = useState<ThemeMode>('light');
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
    location.pathname === '/dashboard' ? `Welcome back, ${firstName}` : undefined;
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

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
        theme={theme}
        mobileOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
      />
      {isMobileSidebarOpen ? (
        <button
          type="button"
          aria-label="Close sidebar"
          className="fixed inset-0 z-30 bg-transparent theme-overlay md:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      ) : null}
      <div
        className={`relative z-10 flex min-h-screen flex-1 flex-col transition-all ${
          sidebarCollapsed ? 'md:ml-24' : 'md:ml-[19rem]'
        }`}
      >
        <Topbar
          theme={theme}
          onToggleTheme={() =>
            setTheme((current) => (current === 'dark' ? 'light' : 'dark'))
          }
          title={topbarTitle}
          onOpenSidebar={() => setIsMobileSidebarOpen(true)}
        />
        <main className="flex-1">
          <PageContainer className="space-y-6">
            <Outlet />
          </PageContainer>
        </main>
      </div>
    </div>
  );
};

export default DashboardShell;
