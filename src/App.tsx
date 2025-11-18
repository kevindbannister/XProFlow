import { useEffect, useMemo, useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { TopNav } from './components/TopNav';
import { BillingView } from './views/BillingView';
import { AccountView } from './views/AccountView';
import { SettingsView } from './views/SettingsView';
import { TeamView } from './views/TeamView';
import { DashboardView } from './views/DashboardView';
import { MainView, SettingsTab } from './types';

const App = () => {
  const [currentView, setCurrentView] = useState<MainView>('overview');
  const [currentSettingsTab, setCurrentSettingsTab] = useState<SettingsTab>('preferences');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window === 'undefined') {
      return false;
    }
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
  });
  const isDashboard = currentView === 'overview';

  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDarkMode]);

  const content = useMemo(() => {
    switch (currentView) {
      case 'overview':
        return <DashboardView />;
      case 'settings':
        return <SettingsView currentTab={currentSettingsTab} />;
      case 'billing':
        return <BillingView />;
      case 'team':
        return <TeamView />;
      case 'account':
        return <AccountView />;
      default:
        return null;
    }
  }, [currentSettingsTab, currentView]);

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        isDashboard ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950' : 'bg-slate-100 dark:bg-slate-950'
      }`}
    >
      <TopNav
        currentView={currentView}
        onChangeView={(view) => setCurrentView(view)}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode((prev) => !prev)}
      />
      {currentView === 'settings' ? (
        <div className="mx-auto flex w-full max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:px-8">
          <Sidebar
            currentTab={currentSettingsTab}
            onSelectTab={(tab) => setCurrentSettingsTab(tab)}
            mobileOpen={sidebarOpen}
            setMobileOpen={setSidebarOpen}
          />
          <main className="flex-1">
            <div className="lg:hidden">
              <button
                onClick={() => setSidebarOpen(true)}
                className="mb-4 inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition dark:border-slate-700 dark:text-slate-200"
              >
                ☰ Settings menu
              </button>
            </div>
            {content}
          </main>
        </div>
      ) : (
        <main className="w-full">
          {isDashboard ? (
            content
          ) : (
            <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">{content}</div>
          )}
        </main>
      )}
    </div>
  );
};

export default App;
