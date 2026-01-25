import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

const AppShell = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="relative min-h-screen text-slate-900">
      <div className="app-shell-bg pointer-events-none absolute inset-0 -z-10" />
      <div className="relative mx-auto flex min-h-screen max-w-[1440px] gap-6 px-4 py-6 sm:px-6">
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        <div className="flex flex-1 flex-col">
          <Topbar onMenuClick={() => setIsSidebarOpen((open) => !open)} />
          <main className="mt-6 flex-1 space-y-6 pb-10">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default AppShell;
