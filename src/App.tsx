import { useEffect, useMemo, useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { TopNav } from './components/TopNav';
import { BillingView } from './views/BillingView';
import { AccountView } from './views/AccountView';
import { SettingsView } from './views/SettingsView';
import { TeamView } from './views/TeamView';
import { DashboardView } from './views/DashboardView';
import { LoginView } from './views/LoginView';
import { MainView, SettingsTab } from './types';
import { authenticate, clearSession, getStoredSession, storeSession } from './services/auth';

const App = () => {
  const [currentView, setCurrentView] = useState<MainView>('overview');
  const [currentSettingsTab, setCurrentSettingsTab] = useState<SettingsTab>('preferences');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [session, setSession] = useState(() => getStoredSession());
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window === 'undefined') {
      return false;
    }
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
  });

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

  const handleLogin = (username: string, password: string) => {
    setLoginError(null);
    const nextSession = authenticate(username, password);
    if (!nextSession) {
      setLoginError('That username or password did not match the master account.');
      return;
    }

    storeSession(nextSession);
    setSession(nextSession);
  };

  const handleLogout = () => {
    clearSession();
    setSession(null);
    setCurrentView('overview');
  };

  if (!session) {
    return <LoginView onLogin={handleLogin} error={loginError} />;
  }

  return (
    <div className="min-h-screen px-4 py-6 transition-colors duration-300 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <TopNav
          currentView={currentView}
          onChangeView={(view) => setCurrentView(view)}
          isDarkMode={isDarkMode}
          onToggleDarkMode={() => setIsDarkMode((prev) => !prev)}
          onLogout={handleLogout}
          username={session.username}
        />
        {currentView === 'settings' ? (
          <div className="rounded-[40px] border border-white/60 bg-white/80 p-4 shadow-[0_35px_80px_rgba(15,23,42,0.15)] backdrop-blur-2xl sm:p-6">
            <div className="flex flex-col gap-6 lg:flex-row">
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
                    className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/70 px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm"
                  >
                    ☰ Settings menu
                  </button>
                </div>
                {content}
              </main>
            </div>
          </div>
        ) : (
          <main className="w-full">
            <div className="rounded-[40px] border border-white/60 bg-white/80 p-4 shadow-[0_35px_80px_rgba(15,23,42,0.15)] backdrop-blur-2xl sm:p-6">
              {content}
            </div>
          </main>
        )}
      </div>
    </div>
  );
};

export default App;
