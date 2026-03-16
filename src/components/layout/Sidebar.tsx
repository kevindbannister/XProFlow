import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  BriefcaseBusiness,
  CalendarClock,
  CircuitBoard,
  CreditCard,
  Inbox,
  LayoutDashboard,
  PenSquare,
  Settings,
  Signature,
  SlidersHorizontal,
  Sparkles,
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

type SidebarProps = {
  onOpenSettings?: () => void;
};

const itemClassName =
  'h-7 min-h-7 flex items-center gap-2 px-2 rounded-[16px] text-xs font-medium leading-4 text-content-secondary transition hover:bg-surface-hover';

const Sidebar = ({ onOpenSettings }: SidebarProps) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { user } = useUser();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    setIsUserMenuOpen(false);
    navigate('/login', { replace: true });
  };

  return (
    <aside className="flex h-screen w-[200px] min-w-[200px] flex-col bg-surface-page px-3 pb-4 pt-9">
      <div className="px-2">
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
                isActive && 'bg-white text-content-primary shadow-[0_1px_2px_rgba(18,29,49,0.05)]'
              )}
            >
              <Icon className="h-4 w-4 shrink-0" strokeWidth={1.8} />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-4 space-y-1">
        <button type="button" onClick={onOpenSettings} className={itemClassName}>
          <Settings className="h-4 w-4 shrink-0" strokeWidth={1.8} />
          <span className="truncate">Settings</span>
        </button>

        <DropdownMenu
          isOpen={isUserMenuOpen}
          onOpenChange={setIsUserMenuOpen}
          trigger={(
            <button type="button" className={classNames(itemClassName, 'w-full justify-start')}>
              <Avatar
                src={user.avatarUrl}
                alt={user.name}
                fallback={getUserInitials(user.name)}
                className="h-5 w-5 rounded-full bg-[#E6EAEE] text-[10px] font-semibold text-content-primary"
              />
              <span className="truncate">{user.name}</span>
            </button>
          )}
          align="left"
        >
          <Link
            to="/profile"
            className="flex w-full items-center rounded-xl px-3 py-2 text-left text-sm font-medium text-content-secondary transition hover:bg-surface-hover hover:text-content-primary"
          >
            Profile
          </Link>
          <button
            type="button"
            onClick={() => void handleLogout()}
            className="flex w-full items-center rounded-xl px-3 py-2 text-left text-sm font-medium text-content-secondary transition hover:bg-surface-hover hover:text-content-primary"
          >
            Log out
          </button>
        </DropdownMenu>
      </div>
    </aside>
  );
};

export default Sidebar;
