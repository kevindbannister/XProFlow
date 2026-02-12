import { type LucideIcon, Gauge, Inbox, LifeBuoy, Settings, Workflow } from 'lucide-react';
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
  { label: 'Rules', to: '/rules', icon: Workflow }
];

const secondaryNavigation: NavItem[] = [
  { label: 'Settings', to: '/settings', icon: Settings },
  { label: 'Support', to: '/settings', icon: LifeBuoy }
];

const NavIcon = ({ item }: { item: NavItem }) => {
  const Icon = item.icon;

  return (
    <NavLink
      to={item.to}
      aria-label={item.label}
      className={({ isActive }) =>
        classNames(
          'group relative flex h-10 w-10 items-center justify-center rounded-xl border transition',
          isActive
            ? 'border-slate-900 bg-slate-900 text-white'
            : 'border-transparent text-slate-500 hover:border-slate-200 hover:bg-white hover:text-slate-900'
        )
      }
    >
      <Icon className="h-5 w-5" strokeWidth={1.8} />
      <span className="pointer-events-none absolute left-12 top-1/2 z-50 -translate-y-1/2 rounded-md border border-slate-200 bg-white px-2 py-1 text-xs font-medium text-slate-700 opacity-0 shadow-sm transition group-hover:opacity-100">
        {item.label}
      </span>
    </NavLink>
  );
};

const Sidebar = () => {
  return (
    <aside className="fixed left-0 top-16 z-40 flex h-[calc(100vh-4rem)] w-16 flex-col border-r border-slate-200 bg-slate-50 py-4">
      <nav className="flex flex-1 flex-col items-center gap-2">
        {primaryNavigation.map((item) => (
          <NavIcon key={item.label} item={item} />
        ))}
      </nav>

      <nav className="flex flex-col items-center gap-2">
        {secondaryNavigation.map((item) => (
          <NavIcon key={item.label} item={item} />
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
