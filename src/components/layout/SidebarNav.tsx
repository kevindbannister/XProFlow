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
};

const SidebarNav = ({ items, collapsed }: SidebarNavProps) => {
  return (
    <nav className="mt-8 flex flex-1 flex-col gap-1">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.label}
            to={item.to}
            className={({ isActive }: { isActive: boolean }) =>
              classNames(
                'nav-link group relative flex items-center gap-3 rounded-full border border-transparent py-2 text-sm font-medium transition',
                collapsed ? 'justify-center px-2' : 'px-3',
                isActive ? 'nav-link-active shadow-sm' : ''
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
};

export default SidebarNav;
