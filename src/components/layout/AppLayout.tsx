import { useEffect, useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  CalendarClock,
  CircuitBoard,
  LayoutDashboard,
  Moon,
  PenSquare,
  Signature,
  SlidersHorizontal,
  Sparkles,
  Sun,
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

const iconButtonClassName =
  'theme-text-muted flex items-center rounded-xl transition hover:bg-slate-100 dark:hover:bg-slate-900';

const AppLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const meta = routeMeta[location.pathname];
  const { user } = useUser();
  const { logout } = useAuth();
  const [themeMode, setThemeMode] = useState<ThemeMode>(getInitialThemeMode);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

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
      <div className="flex w-64 flex-col border-r bg-white dark:border-slate-800 dark:bg-slate-950">
        <div className="flex h-16 items-center border-b border-slate-200 px-4 dark:border-slate-800">
          <AppLogo className="h-8 w-auto" />
        </div>

        <aside className="flex min-h-0 flex-1 flex-col justify-between p-3">
          <nav className="flex flex-col gap-1" aria-label="Primary navigation" role="navigation">
            {sidebarNav.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.label}
                  to={item.to}
                  className={({ isActive }) =>
                    classNames(
                      'flex h-10 items-center gap-2 rounded-xl px-3 text-sm font-medium transition',
                      isActive
                        ? 'bg-gradient-to-b from-sky-500 to-blue-500 text-white'
                        : 'theme-text-muted hover:bg-slate-100 dark:hover:bg-slate-900'
                    )
                  }
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>

          <button
            type="button"
            aria-label={themeMode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            onClick={toggleTheme}
            className={classNames(iconButtonClassName, 'h-10 w-full justify-start gap-2 px-3')}
          >
            {themeMode === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            <span className="text-sm font-medium">{themeMode === 'dark' ? 'Light mode' : 'Dark mode'}</span>
          </button>
        </aside>
      </div>

      <main className="flex-1 overflow-auto bg-white p-6 dark:bg-slate-950">
        <div className="mb-6 flex items-center justify-between">
          {meta?.title ? (
            <header>
              <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">{meta.title}</h1>
            </header>
          ) : <div />}

          <DropdownMenu
            isOpen={isUserMenuOpen}
            onOpenChange={setIsUserMenuOpen}
            trigger={(
              <button
                type="button"
                aria-label="Open user menu"
                className="rounded-full border border-transparent p-0.5 transition hover:border-slate-300/40"
              >
                <Avatar
                  src={user.avatarUrl}
                  alt={`${user.name} avatar`}
                  fallback={getUserInitials(user.name)}
                  className="h-9 w-9 rounded-full bg-slate-200/70 text-xs font-semibold text-slate-700 dark:bg-slate-700 dark:text-slate-100"
                />
              </button>
            )}
          >
            <div className="px-3 py-2">
              <p className="theme-text-secondary text-sm font-medium">{user.name}</p>
              {user.email ? <p className="theme-text-muted text-xs">{user.email}</p> : null}
            </div>
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

        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;
