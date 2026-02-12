import { CircleHelp, Gauge, Inbox, Settings, Workflow } from 'lucide-react';
import type { ComponentType } from 'react';
import { NavLink } from 'react-router-dom';
import { classNames } from '../../lib/utils';

const primaryNavigation = [
  { label: 'Dashboard', to: '/dashboard', icon: Gauge },
  { label: 'Inbox', to: '/inbox', icon: Inbox },
  { label: 'Rules', to: '/rules', icon: Workflow },
];

const secondaryNavigation = [
  { label: 'Settings', to: '/settings', icon: Settings },
];

const SidebarLink = ({ label, to, icon: Icon }: { label: string; to: string; icon: ComponentType<{ className?: string }> }) => (
  <NavLink
    to={to}
    aria-label={label}
    className={({ isActive }) =>
      classNames(
        'group relative flex h-10 w-10 items-center justify-center rounded-lg border text-slate-500 transition',
        isActive
          ? 'border-slate-300 bg-slate-900 text-white'
          : 'border-transparent hover:border-slate-200 hover:bg-slate-100 hover:text-slate-700'
      )
    }
  >
    <Icon className="h-5 w-5" />
    <span className="pointer-events-none absolute left-12 top-1/2 z-50 -translate-y-1/2 rounded-md border border-slate-200 bg-white px-2 py-1 text-xs font-medium text-slate-700 opacity-0 shadow-sm transition group-hover:opacity-100">
      {label}
    </span>
  </NavLink>
);

const Sidebar = () => {
  return (
    <aside className="fixed left-0 top-16 z-40 flex h-[calc(100vh-4rem)] w-16 flex-col items-center justify-between border-r border-slate-200 bg-slate-50 py-4">
      <nav className="flex flex-col items-center gap-2">
        {primaryNavigation.map((item) => (
          <SidebarLink key={item.label} {...item} />
        ))}
      </nav>

      <div className="flex flex-col items-center gap-2">
        {secondaryNavigation.map((item) => (
          <SidebarLink key={item.label} {...item} />
        ))}
        <button
          type="button"
          aria-label="Support"
          className="group relative flex h-10 w-10 items-center justify-center rounded-lg border border-transparent text-slate-500 transition hover:border-slate-200 hover:bg-slate-100 hover:text-slate-700"
        >
          <CircleHelp className="h-5 w-5" />
          <span className="pointer-events-none absolute left-12 top-1/2 z-50 -translate-y-1/2 rounded-md border border-slate-200 bg-white px-2 py-1 text-xs font-medium text-slate-700 opacity-0 shadow-sm transition group-hover:opacity-100">
            Support
          </span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
