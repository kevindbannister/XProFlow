import { useEffect, useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  CircleHelp,
  Inbox,
  Home,
  Moon,
  Settings,
  Sun,
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
  '/home': { title: 'Home' },
  '/dashboard': { title: 'Dashboard' },
  '/rules': { title: 'Rules' },
  '/settings/drafts': { title: 'Drafting' },
  '/writing-style': { title: 'Writing Style' },
  '/signature-time-zone': { title: 'Signature & Time Zone' },
  '/account-settings': { title: 'Account' },
  '/onboarding/professional-context': { title: 'Professional Context' },
  '/settings/professional-context': { title: 'Professional Context' },
  '/settings/firm': { title: 'Firm Settings' },
  '/profile': { title: 'Profile' },
};

const iconNav = [
  { label: 'Home', to: '/home', icon: Home },
  { label: 'Inbox', to: '/inbox', icon: Inbox },
] as const;


const iconButtonClassName =
  'theme-text-muted flex h-10 w-10 items-center justify-center rounded-xl border border-transparent transition hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-900 dark:hover:text-white';

const AppLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const meta = routeMeta[location.pathname];
  const { user } = useUser();
  const { logout } = useAuth();
  const [themeMode, setThemeMode] = useState<ThemeMode>(getInitialThemeMode);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
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
    <div className="flex h-screen theme-text-primary bg-slate-50 dark:bg-slate-950">
      <div className="flex w-16 flex-col border-r bg-white transition-all duration-200 dark:border-slate-800 dark:bg-slate-950">
        <div className="flex h-16 items-center justify-center border-b border-slate-200 px-2 dark:border-slate-800">
          <AppLogo className="h-8 w-auto" />
        </div>

        <div className="flex min-h-0 flex-1">
          <aside className="w-16 bg-white flex flex-col justify-between py-4 items-center dark:bg-slate-950">
            <div className="flex flex-col items-center gap-2" aria-label="Primary areas" role="navigation">
              {iconNav.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.label}
                    to={item.to}
                    aria-label={item.label}
                    className={({ isActive }) =>
                      classNames(
                        'flex h-10 w-10 items-center justify-center rounded-xl transition',
                        isActive
                          ? 'bg-gradient-to-b from-sky-500 to-blue-500 text-white'
                          : 'theme-text-muted hover:bg-slate-100 dark:hover:bg-slate-900'
                      )
                    }
                  >
                    <Icon className="h-5 w-5" />
                  </NavLink>
                );
              })}
            </div>
            <div className="flex flex-col items-center gap-2">
              <button
                type="button"
                aria-label={themeMode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                onClick={toggleTheme}
                className={iconButtonClassName}
              >
                {themeMode === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </button>
              <button type="button" aria-label="Help" className={iconButtonClassName}>
                <CircleHelp className="h-4 w-4" />
              </button>
              <button
                type="button"
                aria-label="Open settings"
                onClick={() => setSettingsOpen(true)}
                className={iconButtonClassName}
              >
                <Settings className="h-4 w-4" />
              </button>
              <DropdownMenu
                isOpen={isUserMenuOpen}
                onOpenChange={setIsUserMenuOpen}
                align="left"
                side="right"
                trigger={(
                  <button type="button" aria-label="Open user menu" className="rounded-full border border-transparent p-0.5 transition hover:border-slate-300/40">
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
          </aside>
        </div>
      </div>

      <main className="flex-1 overflow-auto bg-white p-6 dark:bg-slate-950">
        {meta?.title ? (
          <header className="mb-6">
            <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">{meta.title}</h1>
          </header>
        ) : null}
        <Outlet />
      </main>

      <SettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />
    </div>
  );
};

export default AppLayout;
