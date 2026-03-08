import { useEffect, useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  Bell,
  BriefcaseBusiness,
  CircleHelp,
  FileText,
  GitBranch,
  Inbox,
  Mail,
  MessageCircle,
  Moon,
  PenSquare,
  Settings,
  Sun,
  Trash2,
  Archive,
  Send,
  ShieldAlert,
  Building2,
  AtSign,
  Clock3,
  Tag,
  Sparkles,
  Bot,
  PanelLeftClose,
  PanelLeftOpen,
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

const settingsRoutes = [
  '/labels',
  '/rules',
  '/settings/drafts',
  '/writing-style',
  '/signature-time-zone',
  '/settings/professional-context',
  '/account-settings',
  '/settings/firm',
];

const iconNav = [
  { label: 'Inbox', to: '/inbox', icon: Inbox },
  { label: 'Automation', to: '/rules', icon: Bot },
  { label: 'Content', to: '/settings/drafts', icon: PenSquare },
] as const;

const SIDEBAR_COLLAPSED_STORAGE_KEY = 'xproflow.sidebar.collapsed';

const inboxGroups = [
  {
    items: [
      { label: 'Inbox', icon: Mail },
      { label: 'To Respond', icon: MessageCircle },
      { label: 'Comment', icon: MessageCircle },
      { label: 'Notification', icon: Bell },
      { label: 'Meeting Update', icon: Sparkles },
      { label: 'Awaiting Reply', icon: MessageCircle },
    ],
  },
  {
    items: [
      { label: 'Drafts', icon: FileText },
      { label: 'Sent', icon: Send },
      { label: 'Archive', icon: Archive },
      { label: 'Spam', icon: ShieldAlert },
      { label: 'Trash', icon: Trash2 },
    ],
  },
  {
    items: [{ label: 'Help', icon: CircleHelp }],
  },
] as const;

const settingsItems = [
  { label: 'Labels', to: '/labels', icon: Tag },
  { label: 'Rules', to: '/rules', icon: GitBranch },
  { label: 'Drafting', to: '/settings/drafts', icon: PenSquare },
  { label: 'Writing Style', to: '/writing-style', icon: PenSquare },
  { label: 'Signature & Time Zone', to: '/signature-time-zone', icon: Clock3 },
  { label: 'Professional Context', to: '/settings/professional-context', icon: BriefcaseBusiness },
  { label: 'Account', to: '/account-settings', icon: AtSign },
  { label: 'Firm Settings', to: '/settings/firm', icon: Building2 },
] as const;

const iconButtonClassName =
  'theme-text-muted flex h-10 w-10 items-center justify-center rounded-xl border border-transparent transition hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-900 dark:hover:text-white';

const ContextSidebar = ({ locationPath, isCollapsed }: { locationPath: string; isCollapsed: boolean }) => {
  const isInbox = locationPath.startsWith('/inbox');
  const isSettings = settingsRoutes.some((route) => locationPath.startsWith(route));

  return (
    <aside
      className={classNames(
        'border-r bg-white/95 py-5 dark:bg-slate-950 dark:border-slate-800 transition-all duration-200 backdrop-blur-sm',
        isCollapsed ? 'w-0 overflow-hidden border-r-0 px-0' : 'w-64 px-3'
      )}
    >
      {isInbox ? (
        <nav className="flex h-full flex-col gap-4" aria-label="Inbox folders">
          {inboxGroups.map((group, index) => (
            <div key={index} className="border-b border-slate-200 pb-3 last:border-b-0 dark:border-slate-800">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = item.label === 'Inbox';
                const hasCountBadge = item.label === 'To Respond';
                const hasAiBadge = item.label === 'Comment';
                return (
                  <button
                    key={item.label}
                    type="button"
                    className={classNames(
                      'flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm',
                      isActive
                        ? 'bg-gradient-to-r from-sky-500 to-blue-500 text-white shadow-sm'
                        : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-900'
                    )}
                  >
                    <Icon className={classNames('h-5 w-5', isActive ? 'text-white' : 'text-slate-500')} />
                    <span className="flex-1 text-left font-medium">{item.label}</span>
                    {hasCountBadge ? (
                      <span className="rounded-md bg-amber-400 px-2 py-0.5 text-xs font-semibold text-white">2</span>
                    ) : null}
                    {hasAiBadge ? (
                      <span className="rounded-md bg-sky-500 px-2 py-0.5 text-xs font-semibold text-white">AI</span>
                    ) : null}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>
      ) : isSettings ? (
        <nav className="flex flex-col gap-1" aria-label="Settings navigation">
          {settingsItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.label}
                to={item.to}
                className={({ isActive }) =>
                  classNames(
                    'flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition',
                    isActive
                      ? 'bg-gradient-to-r from-sky-500 to-blue-500 text-white'
                      : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-900'
                  )
                }
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      ) : (
        <div className="text-sm text-slate-500 dark:text-slate-400">Select an area from the left sidebar.</div>
      )}
    </aside>
  );
};

const AppLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const meta = routeMeta[location.pathname];
  const { user } = useUser();
  const { logout } = useAuth();
  const [themeMode, setThemeMode] = useState<ThemeMode>(getInitialThemeMode);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(() => {
    const savedValue = localStorage.getItem(SIDEBAR_COLLAPSED_STORAGE_KEY);
    return savedValue === 'true';
  });

  useEffect(() => {
    applyThemeMode(themeMode);
  }, [themeMode]);

  useEffect(() => {
    localStorage.setItem(SIDEBAR_COLLAPSED_STORAGE_KEY, String(isSidebarCollapsed));
  }, [isSidebarCollapsed]);

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
      <div
        className={classNames(
          'flex flex-col bg-white dark:bg-slate-950 border-r dark:border-slate-800 transition-all duration-200',
          isSidebarCollapsed ? 'w-16' : 'w-80'
        )}
      >
        <div className="flex h-16 items-center border-b border-slate-200 px-4 dark:border-slate-800">
          <AppLogo className="h-8 w-auto" />
        </div>

        <div className="flex min-h-0 flex-1">
          <aside className="w-16 border-r bg-white flex flex-col justify-between py-4 items-center dark:bg-slate-950 dark:border-slate-800">
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
              <NavLink
                to="/labels"
                aria-label="Settings"
                className={({ isActive }) =>
                  classNames(
                    'flex h-10 w-10 items-center justify-center rounded-xl transition',
                    isActive
                      ? 'bg-gradient-to-b from-sky-500 to-blue-500 text-white'
                      : 'theme-text-muted hover:bg-slate-100 dark:hover:bg-slate-900'
                  )
                }
              >
                <Settings className="h-5 w-5" />
              </NavLink>
              <button type="button" aria-label="Notifications" className={iconButtonClassName}>
                <Bell className="h-4 w-4" />
              </button>
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
                aria-label={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                onClick={() => setIsSidebarCollapsed((currentState) => !currentState)}
                className={iconButtonClassName}
              >
                {isSidebarCollapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
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

          <ContextSidebar locationPath={location.pathname} isCollapsed={isSidebarCollapsed} />
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
    </div>
  );
};

export default AppLayout;
