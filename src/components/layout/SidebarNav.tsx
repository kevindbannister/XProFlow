import type { ComponentType } from 'react';
import { NavLink } from 'react-router-dom';
import { classNames } from '../../lib/utils';

export type SidebarNavItem = {
  label: string;
  to: string;
  icon: ComponentType<{ className?: string }>;
};

type SidebarNavProps = {
  items: SidebarNavItem[];
  collapsed: boolean;
  onNavigate?: () => void;
};

const SidebarNav = ({ items, collapsed, onNavigate }: SidebarNavProps) => (
  <nav className="mt-8 flex flex-1 flex-col gap-2">
    {items.map((item) => {
      const Icon = item.icon;
      return (
        <NavLink
          key={item.label}
          to={item.to}
          onClick={onNavigate}
          className={({ isActive }: { isActive: boolean }) =>
            classNames(
              'nav-link group relative flex items-center gap-3 border border-transparent text-sm font-medium transition',
              collapsed ? 'justify-center px-3 py-3' : 'px-4 py-2.5',
              isActive ? 'nav-link-active shadow-sm' : '',
              collapsed ? 'rounded-2xl' : 'rounded-full'
            )
          }
        >
          {({ isActive }: { isActive: boolean }) => (
            <>
              <Icon className={classNames('h-4 w-4', isActive ? 'text-current' : '')} />
              {!collapsed && <span>{item.label}</span>}
              {collapsed && (
                <span className="pointer-events-none absolute left-full top-1/2 ml-3 -translate-y-1/2 whitespace-nowrap rounded bg-slate-900 px-2 py-1 text-xs text-white opacity-0 transition group-hover:opacity-100 dark:bg-slate-800">
                  {item.label}
                </span>
              )}
            </>
          )}
        </NavLink>
      );
    })}
  </nav>
);

export default SidebarNav;
