import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

type ThemeMode = 'dark' | 'light';

const AppShell = () => {
  const [theme, setTheme] = useState<ThemeMode>('light');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    if (typeof window === 'undefined') {
      return false;
    }
    return localStorage.getItem('sidebarCollapsed') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', String(sidebarCollapsed));
  }, [sidebarCollapsed]);

  return (
    <div className="min-h-screen bg-gray-50 text-slate-900">
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed((current) => !current)}
      />
      <div
        className={`flex min-h-screen flex-1 flex-col ${sidebarCollapsed ? 'ml-20' : 'ml-72'}`}
      >
        <Topbar
          theme={theme}
          onToggleTheme={() =>
            setTheme((current) => (current === 'dark' ? 'light' : 'dark'))
          }
        />
        <main className="flex-1 space-y-6 px-8 py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppShell;
