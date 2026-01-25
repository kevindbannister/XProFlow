import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

type ThemeMode = 'dark' | 'light';

const AppShell = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [theme, setTheme] = useState<ThemeMode>(() => {
    if (typeof window === 'undefined') {
      return 'dark';
    }

    const storedTheme = window.localStorage.getItem('theme');
    return storedTheme === 'light' ? 'light' : 'dark';
  });

  useEffect(() => {
    document.body.classList.remove('theme-dark', 'theme-light');
    document.body.classList.add(`theme-${theme}`);
    window.localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <div className="relative min-h-screen theme-text-primary">
      <div className="app-shell-bg pointer-events-none absolute inset-0 -z-10" />
      <div className="relative mx-auto flex min-h-screen max-w-[1440px] gap-6 px-4 py-6 sm:px-6">
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        <div className="flex flex-1 flex-col">
          <Topbar
            onMenuClick={() => setIsSidebarOpen((open) => !open)}
            theme={theme}
            onToggleTheme={() =>
              setTheme((current) => (current === 'dark' ? 'light' : 'dark'))
            }
          />
          <main className="mt-6 flex-1 space-y-6 pb-10">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default AppShell;
