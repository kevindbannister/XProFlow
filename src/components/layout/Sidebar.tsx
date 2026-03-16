import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  BriefcaseBusiness,
  CalendarClock,
  CircuitBoard,
  CreditCard,
  Inbox,
  LayoutDashboard,
  Moon,
  PanelLeftClose,
  PanelLeftOpen,
  PenSquare,
  Signature,
  SlidersHorizontal,
  Sparkles,
  Sun,
  UserRound,
  Workflow,
  Wrench
} from 'lucide-react';
import AppLogo from '../branding/AppLogo';
import { Avatar } from '../ui/Avatar';
import { DropdownMenu } from '../ui/DropdownMenu';
import { useAuth } from '../../context/AuthContext';
import { getUserInitials, useUser } from '../../context/UserContext';
import { classNames } from '../../lib/utils';
import { applyThemeMode, getInitialThemeMode, type ThemeMode } from '../../lib/theme';

type NavItem = {
  label: string;
  to: string;
  icon: typeof LayoutDashboard;
  matchPrefix?: string;
};

const navItems: NavItem[] = [
  { label: 'Dashboard', to: '/dashboard' as const, icon: LayoutDashboard },
  { label: 'Inbox', to: '/inbox' as const, icon: Inbox },
  { label: 'Categorisation', to: '/categorisation' as const, icon: Workflow },
  { label: 'Rules', to: '/rules' as const, icon: SlidersHorizontal },
  { label: 'Drafting', to: '/drafting' as const, icon: PenSquare },
  { label: 'Writing Style', to: '/writing-style' as const, icon: Sparkles },
  { label: 'Signature', to: '/signature' as const, icon: Signature },
  { label: 'Scheduling', to: '/scheduling' as const, icon: CalendarClock },
  { label: 'Integrations', to: '/integrations' as const, icon: CircuitBoard },
  { label: 'Pro Context', to: '/professional-context' as const, icon: Wrench },
  { label: 'Account', to: '/account' as const, icon: UserRound },
  { label: 'Billing', to: '/billing' as const, icon: CreditCard },
  { label: 'Onboarding', to: '/onboarding' as const, icon: BriefcaseBusiness, matchPrefix: '/onboarding/' }
] as const;

const itemClassName =
  'h-7 min-h-7 flex items-center gap-2 px-2 rounded-[10px] text-xs font-medium leading-4 text-content-secondary transition hover:bg-surface-hover dark:text-[#A9B7C9] dark:hover:bg-white/5';

type SidebarProps = {
  isCollapsed: boolean;
  onToggleCollapsed: () => void;
};

const Sidebar = ({ isCollapsed, onToggleCollapsed }: SidebarProps) => {
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
    <aside
      className={classNames(
        'flex h-screen flex-col bg-transparent pb-4 pl-2 pt-9 transition-[width,padding] duration-200',
        isCollapsed ? 'w-[46px] min-w-[46px] pr-0.5' : 'w-[202px] min-w-[202px] pr-3'
      )}
    >
      <div className={classNames(isCollapsed ? 'flex justify-center px-0' : 'px-2')}>
        <AppLogo className="h-8 w-auto" />
      </div>

      <nav className="mt-8 flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto" aria-label="Primary navigation">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.to || (item.matchPrefix ? pathname.startsWith(item.matchPrefix) : false);

          return (
            <Link
              key={item.to}
              to={item.to}
              className={classNames(
                itemClassName,
                isCollapsed ? 'justify-center px-0' : 'justify-start',
                isActive && 'bg-gradient-to-r from-[#27B0FF] to-[#3B82F6] text-white shadow-[0_8px_24px_rgba(59,130,246,0.25)]'
              )}
              aria-label={isCollapsed ? item.label : undefined}
            >
              <Icon className="h-4 w-4 shrink-0" strokeWidth={1.8} />
              {!isCollapsed ? <span className="truncate">{item.label}</span> : null}
            </Link>
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
            <Sun className="h-4 w-4 shrink-0" strokeWidth={1.8} />
          ) : (
            <Moon className="h-4 w-4 shrink-0" strokeWidth={1.8} />
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
            <PanelLeftOpen className="h-4 w-4 shrink-0" strokeWidth={1.8} />
          ) : (
            <PanelLeftClose className="h-4 w-4 shrink-0" strokeWidth={1.8} />
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

export default Sidebar;
