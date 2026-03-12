import { useEffect, useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  CalendarClock,
  ChevronLeft,
  ChevronRight,
  CircuitBoard,
  LayoutDashboard,
  Moon,
  PenSquare,
  Signature,
  SlidersHorizontal,
  Sparkles,
  Sun,
  Settings,
  UserRound,
  Workflow,
  Wrench,
} from 'lucide-react';
import AppLogo from '../branding/AppLogo';
import { Avatar } from '../ui/Avatar';
import { DropdownMenu } from '../ui/DropdownMenu';
import { getUserInitials, useUser } from '../../context/UserContext';
import { useAuth } from '../../context/AuthContext';
import { applyThemeMode, getInitialThemeMode, type ThemeMode } from '../../lib/theme';
import { classNames } from '../../lib/utils';
import { SettingsModal } from '../settings/SettingsModal';

const routeMeta: Record<string, { title: string }> = {
  '/dashboard': { title: 'Dashboard' },
  '/categorisation': { title: 'Categorisation' },
  '/rules': { title: 'Rules' },
  '/drafting': { title: 'Drafting' },
  '/writing-style': { title: 'Writing Style' },
  '/signature': { title: 'Signature' },
  '/scheduling': { title: 'Scheduling' },
  '/integrations': { title: 'Integrations' },
  '/professional-context': { title: 'Professional Context' },
  '/account': { title: 'Account' },
};

const sidebarNav = [
  { label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
  { label: 'Categorisation', to: '/categorisation', icon: Workflow },
  { label: 'Rules', to: '/rules', icon: SlidersHorizontal },
  { label: 'Drafting', to: '/drafting', icon: PenSquare },
  { label: 'Writing Style', to: '/writing-style', icon: Sparkles },
  { label: 'Signature', to: '/signature', icon: Signature },
  { label: 'Scheduling', to: '/scheduling', icon: CalendarClock },
  { label: 'Integrations', to: '/integrations', icon: CircuitBoard },
  { label: 'Professional Context', to: '/professional-context', icon: Wrench },
  { label: 'Account', to: '/account', icon: UserRound },
] as const;

const AppLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const meta = routeMeta[location.pathname];
  const { user } = useUser();
  const { logout } = useAuth();
  const [themeMode, setThemeMode] = useState<ThemeMode>(getInitialThemeMode);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    applyThemeMode(themeMode);
  }, [themeMode]);

  const toggleTheme = () => {
    setThemeMode((currentMode) => (currentMode === 'dark' ? 'light' : 'dark'));
  };

  const handleLogout = async () => {
    await logout();
    setIsUserMenuOpen(false);
    navigate('/login', { replace: true });
  };

  return (
    <div className="flex h-screen bg-slate-50 theme-text-primary dark:bg-slate-950">
      <div
        className={classNames(
          'flex flex-col border-r bg-white transition-all duration-200 dark:border-slate-800 dark:bg-slate-950',
          isSidebarExpanded ? 'w-64' : 'w-16'
        )}
      >
        <div
          className={classNames(
            'flex h-16 border-b border-slate-200 px-3 dark:border-slate-800',
            isSidebarExpanded ? 'items-center justify-between' : 'items-center justify-center'
          )}
        >
          <AppLogo className="h-8 w-auto" />
          {isSidebarExpanded ? (
            <button
              type="button"
              aria-label="Collapse sidebar"
              onClick={() => setIsSidebarExpanded(false)}
              className="rounded-lg p-2 theme-text-muted transition hover:bg-slate-100 dark:hover:bg-slate-900"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
          ) : null}
        </div>

        <aside className={classNames('flex min-h-0 flex-1 flex-col justify-between py-3', isSidebarExpanded ? 'px-3' : 'px-2')}>
          <nav className="flex flex-col gap-1" aria-label="Primary navigation" role="navigation">
            {sidebarNav.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.label}
                  to={item.to}
                  aria-label={item.label}
                  className={({ isActive }) =>
                    classNames(
                      'flex h-10 items-center rounded-xl text-sm font-medium transition',
                      isSidebarExpanded ? 'justify-start gap-2 px-3' : 'justify-center',
                      isActive
                        ? 'bg-gradient-to-b from-sky-500 to-blue-500 text-white'
                        : 'theme-text-muted hover:bg-slate-100 dark:hover:bg-slate-900'
                    )
                  }
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {isSidebarExpanded ? <span className="truncate">{item.label}</span> : null}
                </NavLink>
              );
            })}
          </nav>

          <div className="flex flex-col gap-2">
            <button
              type="button"
              aria-label={themeMode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              onClick={toggleTheme}
              className={classNames(
                'theme-text-muted flex h-10 items-center rounded-xl transition hover:bg-slate-100 dark:hover:bg-slate-900',
                isSidebarExpanded ? 'w-full justify-start gap-2 px-3' : 'w-full justify-center'
              )}
            >
              {themeMode === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              {isSidebarExpanded ? (
                <span className="text-sm font-medium">{themeMode === 'dark' ? 'Light mode' : 'Dark mode'}</span>
              ) : null}
            </button>

            {isSidebarExpanded ? (
              <button
                type="button"
                aria-label="Collapse sidebar"
                onClick={() => setIsSidebarExpanded(false)}
                className="theme-text-muted flex h-10 items-center justify-start gap-2 rounded-xl px-3 transition hover:bg-slate-100 dark:hover:bg-slate-900"
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="text-sm font-medium">Collapse</span>
              </button>
            ) : (
              <button
                type="button"
                aria-label="Expand sidebar"
                onClick={() => setIsSidebarExpanded(true)}
                className="theme-text-muted flex h-10 w-full items-center justify-center rounded-xl transition hover:bg-slate-100 dark:hover:bg-slate-900"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            )}


            <button
              type="button"
              aria-label="Open settings"
              onClick={() => setSettingsOpen(true)}
              className={classNames(
                'theme-text-muted flex h-10 items-center rounded-xl transition hover:bg-slate-100 dark:hover:bg-slate-900',
                isSidebarExpanded ? 'w-full justify-start gap-2 px-3' : 'w-full justify-center'
              )}
            >
              <Settings className="h-4 w-4" />
              {isSidebarExpanded ? <span className="text-sm font-medium">Settings</span> : null}
            </button>

            <DropdownMenu
              isOpen={isUserMenuOpen}
              onOpenChange={setIsUserMenuOpen}
              trigger={(
                <button
                  type="button"
                  aria-label="Open user menu"
                  className={classNames(
                    'flex w-full items-center rounded-xl border border-transparent p-2 transition hover:border-slate-300/40 hover:bg-slate-100 dark:hover:bg-slate-900',
                    isSidebarExpanded ? 'justify-start gap-2' : 'justify-center'
                  )}
                >
                  <Avatar
                    src={user.avatarUrl}
                    alt={`${user.name} avatar`}
                    fallback={getUserInitials(user.name)}
                    className="h-8 w-8 rounded-full bg-slate-200/70 text-xs font-semibold text-slate-700 dark:bg-slate-700 dark:text-slate-100"
                  />
                  {isSidebarExpanded ? (
                    <span className="min-w-0 text-left">
                      <span className="block truncate text-sm font-medium theme-text-secondary">{user.name}</span>
                      {user.email ? <span className="block truncate text-xs theme-text-muted">{user.email}</span> : null}
                    </span>
                  ) : null}
                </button>
              )}
            >
              <button
                type="button"
                role="menuitem"
                onClick={() => void handleLogout()}
                className="theme-text-secondary flex w-full items-center rounded-lg px-3 py-2 text-left text-sm transition hover:bg-slate-100/70 hover:text-slate-900 dark:hover:bg-slate-700/60 dark:hover:text-slate-100"
              >
                Log out
              </button>
            </DropdownMenu>
          </div>
        </aside>
      </div>

      <main className="flex-1 overflow-auto bg-white p-6 dark:bg-slate-950">
        {meta?.title ? (
          <header className="mb-6">
            <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">{meta.title}</h1>
          </header>
        ) : null}
        <Outlet />
      </main>

      <SettingsModal isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </div>
  );
};

export default AppLayout;
