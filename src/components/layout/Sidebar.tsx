import { BellRing, Gauge, Inbox, Settings, Sparkles, type LucideIcon } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { classNames } from '../../lib/utils';

type NavItem = {
  label: string;
  to: string;
  icon: LucideIcon;
};

const primaryNavigation: NavItem[] = [
  { label: 'Dashboard', to: '/dashboard', icon: Gauge },
  { label: 'Inbox', to: '/inbox', icon: Inbox },
  { label: 'Rules', to: '/rules', icon: Sparkles },
];

const secondaryNavigation: NavItem[] = [
  { label: 'Settings', to: '/settings', icon: Settings },
  { label: 'Support', to: '/integrations', icon: BellRing },
];

const navItemClassName =
  'group relative flex h-10 w-10 items-center justify-center rounded-xl border transition-colors';

const SidebarNavItem = ({ item }: { item: NavItem }) => {
  const Icon = item.icon;

  return (
    <NavLink
      to={item.to}
      className={({ isActive }) =>
        classNames(
          navItemClassName,
          isActive
            ? 'border-slate-900 bg-slate-900 text-white'
            : 'border-transparent text-slate-500 hover:border-slate-200 hover:bg-white hover:text-slate-900'
        )
      }
      aria-label={item.label}
    >
      <Icon className="h-4 w-4" strokeWidth={1.9} />
      <span className="pointer-events-none absolute left-full ml-3 whitespace-nowrap rounded-md bg-slate-900 px-2 py-1 text-xs font-medium text-white opacity-0 shadow-sm transition-opacity group-hover:opacity-100">
        {item.label}
      </span>
    </NavLink>
  );
};

const Sidebar = () => {
  return (
    <aside className="fixed bottom-0 left-0 top-16 z-40 flex w-16 flex-col border-r border-slate-200 bg-slate-100">
      <div className="flex flex-1 flex-col items-center gap-3 py-4">
        {primaryNavigation.map((item) => (
          <SidebarNavItem key={item.label} item={item} />
        ))}
      </div>

      <div className="flex flex-col items-center gap-3 border-t border-slate-200 py-4">
        {secondaryNavigation.map((item) => (
          <SidebarNavItem key={item.label} item={item} />
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;
