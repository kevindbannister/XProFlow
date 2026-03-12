import { useEffect, useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
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
  'theme-text-muted flex items-center rounded-xl transition hover:bg-slate-100 dark:hover:bg-slate-900';

const AppLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const meta = routeMeta[location.pathname];
  const { user } = useUser();
  const { logout } = useAuth();
  const [themeMode, setThemeMode] = useState<ThemeMode>(getInitialThemeMode);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
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
      <div className={classNames(
        'flex flex-col border-r bg-white transition-all duration-200 dark:border-slate-800 dark:bg-slate-950',
        isSidebarExpanded ? 'w-56' : 'w-16'
      )}>
        <div className={classNames(
          'flex h-16 border-b border-slate-200 px-2 dark:border-slate-800',
          isSidebarExpanded ? 'items-center justify-start' : 'items-center justify-center'
        )}>
          <AppLogo className="h-8 w-auto" />
        </div>

        <div className="flex min-h-0 flex-1">
          <aside className={classNames(
            'flex w-full flex-col justify-between bg-white py-4 dark:bg-slate-950',
            isSidebarExpanded ? 'px-3' : 'items-center'
          )}>
            <div className={classNames('flex gap-2', isSidebarExpanded ? 'flex-col' : 'flex-col items-center')} aria-label="Primary areas" role="navigation">
              {iconNav.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.label}
                    to={item.to}
                    aria-label={item.label}
                    className={({ isActive }) =>
                      classNames(
                        'flex items-center rounded-xl transition',
                        isSidebarExpanded ? 'h-10 w-full justify-start gap-2 px-3' : 'h-10 w-10 justify-center',
                        isActive
                          ? 'bg-gradient-to-b from-sky-500 to-blue-500 text-white'
                          : 'theme-text-muted hover:bg-slate-100 dark:hover:bg-slate-900'
                      )
                    }
                  >
                    <Icon className="h-5 w-5" />
                    {isSidebarExpanded ? <span className="text-sm font-medium">{item.label}</span> : null}
                  </NavLink>
                );
              })}
            </div>
            <div className={classNames('flex flex-col gap-2', isSidebarExpanded ? '' : 'items-center')}>
              <button
                type="button"
                aria-label={themeMode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                onClick={toggleTheme}
                className={classNames(iconButtonClassName, isSidebarExpanded ? 'h-10 w-full justify-start gap-2 px-3' : 'h-10 w-10 justify-center')}
              >
                {themeMode === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                {isSidebarExpanded ? (
                  <span className="text-sm font-medium">{themeMode === 'dark' ? 'Light mode' : 'Dark mode'}</span>
                ) : null}
              </button>
              <button type="button" aria-label="Help" className={classNames(iconButtonClassName, isSidebarExpanded ? 'h-10 w-full justify-start gap-2 px-3' : 'h-10 w-10 justify-center')}>
                <CircleHelp className="h-5 w-5" />
                {isSidebarExpanded ? <span className="text-sm font-medium">Help</span> : null}
              </button>
              <button
                type="button"
                aria-label="Open settings"
                onClick={() => setSettingsOpen(true)}
                className={classNames(iconButtonClassName, isSidebarExpanded ? 'h-10 w-full justify-start gap-2 px-3' : 'h-10 w-10 justify-center')}
              >
                <Settings className="h-5 w-5" />
                {isSidebarExpanded ? <span className="text-sm font-medium">Settings</span> : null}
              </button>
              <button
                type="button"
                aria-label={isSidebarExpanded ? 'Collapse left menu' : 'Expand left menu'}
                onClick={() => setIsSidebarExpanded((currentState) => !currentState)}
                className={classNames(iconButtonClassName, isSidebarExpanded ? 'h-10 w-full justify-start gap-2 px-3' : 'h-10 w-10 justify-center')}
              >
                {isSidebarExpanded ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
                {isSidebarExpanded ? <span className="text-sm font-medium">Collapse menu</span> : null}
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
