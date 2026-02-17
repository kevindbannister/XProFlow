import { useEffect, useState } from 'react';
import { Bell, ChevronDown, CircleHelp, Moon, Sun } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Avatar } from '../ui/Avatar';
import { getUserInitials, useUser } from '../../context/UserContext';
import { useAuth } from '../../context/AuthContext';
import AppLogo from '../branding/AppLogo';
import { DropdownMenu } from '../ui/DropdownMenu';
import { applyThemeMode, getInitialThemeMode, type ThemeMode } from '../../lib/theme';

const topbarIconButtonClassName =
  'theme-text-muted flex h-8 w-8 items-center justify-center rounded-lg border border-transparent transition hover:bg-slate-900/90 hover:text-white';

const Topbar = () => {
  const { user } = useUser();
  const { logout } = useAuth();
  const navigate = useNavigate();
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
    <header className="topbar-surface fixed inset-x-0 top-0 z-50 flex h-11 items-center justify-between border-b px-3 backdrop-blur-sm">
      <div className="flex min-w-0 items-center gap-2">
        <AppLogo className="h-6 w-auto" />
      </div>

      <div className="flex items-center gap-0">
        <button
          type="button"
          aria-label="Notifications"
          className={topbarIconButtonClassName}
        >
          <Bell className="h-4 w-4" />
        </button>
        <button
          type="button"
          aria-label={themeMode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          onClick={toggleTheme}
          className={topbarIconButtonClassName}
        >
          {themeMode === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>
        <button
          type="button"
          aria-label="Help"
          className={topbarIconButtonClassName}
        >
          <CircleHelp className="h-4 w-4" />
        </button>

        <div className="ml-1 inline-flex items-center gap-2 rounded-lg border border-transparent px-1.5 py-1 text-left">
          <Avatar
            src={user.avatarUrl}
            alt={`${user.name} avatar`}
            fallback={getUserInitials(user.name)}
            className="h-6 w-6 rounded-full bg-slate-200/70 text-xs font-semibold text-slate-700 dark:bg-slate-700 dark:text-slate-100"
          />
          <DropdownMenu
            isOpen={isUserMenuOpen}
            onOpenChange={setIsUserMenuOpen}
            trigger={(
              <button
                type="button"
                aria-label="Open user menu"
                className="inline-flex items-center gap-1 rounded-lg border border-transparent px-1 py-0.5 text-left transition hover:border-slate-300/40 hover:bg-slate-100/40"
              >
                <span className="hidden min-w-0 sm:flex sm:flex-col">
                  <span className="theme-text-secondary truncate text-xs font-medium leading-tight">{user.name}</span>
                  {user.email ? (
                    <span className="theme-text-muted truncate text-[11px] leading-tight">{user.email}</span>
                  ) : null}
                </span>
                <ChevronDown className="theme-text-muted h-4 w-4" />
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
      </div>
    </header>
  );
};

export default Topbar;
