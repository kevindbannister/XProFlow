import {
  Inbox,
  GitBranch,
  PenSquare,
  Clock3,
  BriefcaseBusiness,
  Settings,
  CircleHelp,
  Moon,
  Sun,
  ChevronDown,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { classNames } from '../../lib/utils';
import { Avatar } from '../ui/Avatar';
import { getUserInitials, useUser } from '../../context/UserContext';
import { DropdownMenu } from '../ui/DropdownMenu';
import { useAuth } from '../../context/AuthContext';
import { applyThemeMode, getInitialThemeMode, type ThemeMode } from '../../lib/theme';

const iconNavigation = [
  { label: 'Inbox', to: '/inbox', icon: Inbox },
  { label: 'Rules', to: '/rules', icon: GitBranch },
  { label: 'Drafting', to: '/settings/drafts', icon: PenSquare },
  { label: 'Writing Style', to: '/writing-style', icon: PenSquare },
  { label: 'Signature', to: '/signature-time-zone', icon: Clock3 },
  { label: 'Professional Content', to: '/settings/professional-context', icon: BriefcaseBusiness },
  { label: 'Settings', to: '/account-settings', icon: Settings },
] as const;

const inboxContextItems = ['Inbox', 'To Respond', 'Comment', 'Notification', 'Meeting Update', 'Awaiting Reply'];
const inboxFolders = ['Drafts', 'Sent', 'Archive', 'Spam', 'Trash'];

const defaultContextLinks = [
  { label: 'Dashboard', to: '/dashboard' },
  { label: 'Labels', to: '/labels' },
  { label: 'Workflows', to: '/workflows' },
  { label: 'Profile', to: '/profile' },
  { label: 'Firm Settings', to: '/settings/firm' },
  { label: 'Billing', to: '/billing' },
];

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useUser();
  const { logout } = useAuth();
  const [themeMode, setThemeMode] = useState<ThemeMode>(getInitialThemeMode);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  useEffect(() => {
    applyThemeMode(themeMode);
  }, [themeMode]);

  const handleLogout = async () => {
    await logout();
    setIsUserMenuOpen(false);
    navigate('/login', { replace: true });
  };

  const isInboxRoute = location.pathname.startsWith('/inbox');
  const contextLinks = useMemo(
    () => defaultContextLinks.filter((item) => item.to !== location.pathname),
    [location.pathname]
  );

  return (
    <>
      <aside className="flex h-screen w-16 flex-col items-center justify-between border-r bg-white py-4 dark:border-slate-800 dark:bg-slate-950">
        <nav className="flex flex-col items-center gap-2">
          {iconNavigation.map((item) => (
            <NavLink
              key={item.label}
              to={item.to}
              aria-label={item.label}
              className={({ isActive }) =>
                classNames(
                  'flex h-10 w-10 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-900',
                  isActive && 'bg-slate-900 text-white hover:bg-slate-900 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-100'
                )
              }
            >
              <item.icon className="h-4 w-4" strokeWidth={1.9} />
            </NavLink>
          ))}
        </nav>

        <div className="flex flex-col items-center gap-2">
          <button
            type="button"
            aria-label={themeMode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            onClick={() => setThemeMode((currentMode) => (currentMode === 'dark' ? 'light' : 'dark'))}
            className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-900"
          >
            {themeMode === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          <DropdownMenu
            isOpen={isUserMenuOpen}
            onOpenChange={setIsUserMenuOpen}
            trigger={(
              <button
                type="button"
                aria-label="Open user menu"
                className="rounded-full border border-transparent p-0.5 transition hover:border-slate-300/60"
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
      </aside>

      <aside className="h-screen w-64 border-r bg-white px-4 py-6 dark:border-slate-800 dark:bg-slate-950">
        {isInboxRoute ? (
          <div className="flex h-full flex-col">
            <div className="space-y-1">
              {inboxContextItems.map((item) => (
                <button
                  key={item}
                  type="button"
                  className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-900"
                >
                  <span>{item}</span>
                  {item === 'Comment' ? (
                    <span className="rounded-full bg-violet-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-violet-700 dark:bg-violet-900/60 dark:text-violet-200">
                      AI
                    </span>
                  ) : null}
                </button>
              ))}
            </div>

            <div className="mt-6 border-t border-slate-200 pt-4 dark:border-slate-800">
              <h3 className="px-3 text-xs font-semibold uppercase tracking-wide text-slate-400">Folders</h3>
              <div className="mt-2 space-y-1">
                {inboxFolders.map((folder) => (
                  <button
                    key={folder}
                    type="button"
                    className="w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-900"
                  >
                    {folder}
                  </button>
                ))}
              </div>
            </div>

            <NavLink
              to="/integrations"
              className="mt-auto flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-900"
            >
              <CircleHelp className="h-4 w-4" />
              Help
            </NavLink>
          </div>
        ) : (
          <div className="flex h-full flex-col">
            <h2 className="px-3 text-sm font-semibold text-slate-800 dark:text-slate-100">Navigation</h2>
            <div className="mt-3 space-y-1">
              {contextLinks.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    classNames(
                      'flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-900',
                      isActive && 'bg-slate-100 text-slate-900 dark:bg-slate-900 dark:text-slate-100'
                    )
                  }
                >
                  <span>{item.label}</span>
                  <ChevronDown className="h-4 w-4 -rotate-90" />
                </NavLink>
              ))}
            </div>

            <NavLink
              to="/integrations"
              className="mt-auto flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-900"
            >
              <CircleHelp className="h-4 w-4" />
              Help
            </NavLink>
          </div>
        )}
      </aside>
    </>
  );
};

export default Sidebar;
