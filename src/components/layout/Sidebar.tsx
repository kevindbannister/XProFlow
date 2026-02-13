import { LayoutDashboard, Inbox, GitBranch, Settings, CircleHelp } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { classNames } from '../../lib/utils';

const primaryNavigation = [
  { label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
  { label: 'Inbox', to: '/inbox', icon: Inbox },
  { label: 'Rules', to: '/rules', icon: GitBranch },
];

const secondaryNavigation = [
  { label: 'Help', to: '/integrations', icon: CircleHelp },
  { label: 'Settings', to: '/settings', icon: Settings },
];

const iconButtonStyles =
  'group relative flex h-7 w-7 items-center justify-center rounded-lg border border-transparent text-slate-500 transition hover:bg-slate-100 hover:text-slate-800';

const Sidebar = () => {
  const renderItem = (label: string, to: string, Icon: typeof LayoutDashboard) => (
    <NavLink
      key={label}
      to={to}
      className={({ isActive }: { isActive: boolean }) =>
        classNames(
          iconButtonStyles,
          isActive && 'border-slate-200 bg-slate-900 text-white hover:bg-slate-900 hover:text-white'
        )
      }
      aria-label={label}
    >
      <Icon className="h-4 w-4" strokeWidth={1.8} />
      <span className="pointer-events-none absolute left-8 top-1/2 hidden -translate-y-1/2 rounded-md border border-slate-200 bg-white px-2 py-1 text-xs font-medium text-slate-700 shadow-sm group-hover:block">
        {label}
      </span>
    </NavLink>
  );

  return (
    <aside className="fixed bottom-0 left-0 top-10 z-40 flex w-12 flex-col items-center justify-between border-r border-slate-200 bg-slate-50 py-2">
      <nav className="flex flex-col items-center gap-1">
        {primaryNavigation.map((item) => renderItem(item.label, item.to, item.icon))}
      </nav>

      <nav className="flex flex-col items-center gap-1">
        {secondaryNavigation.map((item) => renderItem(item.label, item.to, item.icon))}
      </nav>
    </aside>
  );
};

export default Sidebar;
