import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import type { LucideIcon } from 'lucide-react';
import { Moon, PanelLeftClose, PanelLeftOpen, Sun } from 'lucide-react';
import { Avatar } from '../ui/Avatar';
import { DropdownMenu } from '../ui/DropdownMenu';
import { useAuth } from '../../context/AuthContext';
import { getUserInitials, useUser } from '../../context/UserContext';
import { classNames } from '../../lib/utils';
import { applyThemeMode, getInitialThemeMode, type ThemeMode } from '../../lib/theme';

export type SidebarNavItem = {
  id: string;
  label: string;
  icon: LucideIcon;
  to?: string;
  matchPrefix?: string;
};

type SidebarShellProps = {
  isCollapsed: boolean;
  onToggleCollapsed: () => void;
  items: SidebarNavItem[];
  manualActiveItemId?: string;
  onManualSelect?: (itemId: string) => void;
};

const itemClassName =
  'h-[2rem] min-h-[2rem] flex items-center gap-[0.625rem] px-[0.625rem] rounded-[10px] text-[12px] font-medium leading-5 text-content-secondary transition hover:bg-surface-hover dark:text-[#B8C4D6] dark:hover:bg-white/8';

export const SidebarShell = ({
  isCollapsed,
  onToggleCollapsed,
  items,
  manualActiveItemId,
  onManualSelect
}: SidebarShellProps) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { user } = useUser();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [themeMode, setThemeMode] = useState<ThemeMode>(getInitialThemeMode);

  useEffect(() => {
    applyThemeMode(themeMode);
  }, [themeMode]);

  const handleLogout = async () => {
    await logout();
    setIsUserMenuOpen(false);
    navigate('/login', { replace: true });
  };

  const toggleTheme = () => {
    setThemeMode((currentMode) => (currentMode === 'dark' ? 'light' : 'dark'));
  };

  return (
    <aside className="flex h-full flex-col bg-transparent pb-4 pt-4">
      <nav className="flex min-h-0 flex-1 flex-col gap-0 overflow-y-auto" aria-label="Primary navigation">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = item.to
            ? pathname === item.to || (item.matchPrefix ? pathname.startsWith(item.matchPrefix) : false)
            : manualActiveItemId === item.id;

          const sharedClassName = classNames(
            itemClassName,
            isCollapsed ? 'justify-center px-0' : 'justify-start',
            isActive && 'bg-gradient-to-r from-[#27B0FF] to-[#3B82F6] text-white shadow-[0_8px_24px_rgba(59,130,246,0.25)] dark:text-white'
          );

          if (item.to) {
            return (
              <Link
                key={item.id}
                to={item.to}
                className={sharedClassName}
                aria-label={isCollapsed ? item.label : undefined}
              >
                <Icon className="h-4 w-4 shrink-0" strokeWidth={1.8} />
                {!isCollapsed ? <span className="truncate">{item.label}</span> : null}
              </Link>
            );
          }

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onManualSelect?.(item.id)}
              className={classNames(sharedClassName, 'w-full')}
              aria-label={isCollapsed ? item.label : undefined}
            >
              <Icon className="h-4 w-4 shrink-0" strokeWidth={1.8} />
              {!isCollapsed ? <span className="truncate">{item.label}</span> : null}
            </button>
          );
        })}
      </nav>

      <div className="mt-4 space-y-1">
        <button
          type="button"
          onClick={toggleTheme}
          className={classNames(itemClassName, 'w-full', isCollapsed ? 'justify-center px-0' : 'justify-start')}
          aria-label={themeMode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          title={themeMode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {themeMode === 'dark' ? (
            <Sun className="h-5 w-5 shrink-0" strokeWidth={1.9} />
          ) : (
            <Moon className="h-5 w-5 shrink-0" strokeWidth={1.9} />
          )}
          {!isCollapsed ? <span className="truncate">{themeMode === 'dark' ? 'Light Mode' : 'Night Mode'}</span> : null}
        </button>

        <button
          type="button"
          onClick={onToggleCollapsed}
          className={classNames(itemClassName, 'w-full', isCollapsed ? 'justify-center px-0' : 'justify-start')}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? (
            <PanelLeftOpen className="h-5 w-5 shrink-0" strokeWidth={1.9} />
          ) : (
            <PanelLeftClose className="h-5 w-5 shrink-0" strokeWidth={1.9} />
          )}
          {!isCollapsed ? <span className="truncate">{isCollapsed ? 'Expand Menu' : 'Collapse Menu'}</span> : null}
        </button>

        <DropdownMenu
          isOpen={isUserMenuOpen}
          onOpenChange={setIsUserMenuOpen}
          trigger={(
            <button
              type="button"
              className={classNames(
                itemClassName,
                'w-full',
                isCollapsed ? 'justify-center px-0' : 'justify-start'
              )}
              aria-label="Open user menu"
              title={isCollapsed ? user.name : undefined}
            >
              <Avatar
                src={user.avatarUrl}
                alt={user.name}
                fallback={getUserInitials(user.name)}
                className="h-5 w-5 rounded-full bg-[#E6EAEE] text-[10px] font-semibold text-content-primary dark:bg-[#233044] dark:text-[#F3F7FD]"
              />
              {!isCollapsed ? <span className="truncate">{user.name}</span> : null}
            </button>
          )}
          align="left"
        >
          <Link
            to="/profile"
            className="flex w-full items-center rounded-xl px-3 py-2 text-left text-sm font-medium text-content-secondary transition hover:bg-surface-hover hover:text-content-primary dark:text-[#C9D6E6] dark:hover:bg-white/5 dark:hover:text-white"
          >
            Profile
          </Link>
          <button
            type="button"
            onClick={() => void handleLogout()}
            className="flex w-full items-center rounded-xl px-3 py-2 text-left text-sm font-medium text-content-secondary transition hover:bg-surface-hover hover:text-content-primary dark:text-[#C9D6E6] dark:hover:bg-white/5 dark:hover:text-white"
          >
            Log out
          </button>
        </DropdownMenu>
      </div>
    </aside>
  );
};
