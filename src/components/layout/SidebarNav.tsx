import type { LucideIcon } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { classNames } from '../../lib/utils';

type NavItem = {
  label: string;
  to: string;
  icon: LucideIcon;
};

type SidebarNavProps = {
  items: NavItem[];
  collapsed: boolean;
};

const SidebarNavItem = ({ item, collapsed }: { item: NavItem; collapsed: boolean }) => {
  const Icon = item.icon;
  return (
    <NavLink
      key={item.label}
      to={item.to}
      className={({ isActive }: { isActive: boolean }) =>
        classNames(
          'nav-link group relative flex items-center gap-3 rounded-full border border-transparent px-3 py-2.5 text-sm font-medium transition',
          collapsed ? 'justify-center px-2' : 'px-3',
          isActive ? 'nav-link-active' : ''
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
};

const SidebarNav = ({ items, collapsed }: SidebarNavProps) => {
  return (
    <nav className="mt-8 flex flex-1 flex-col gap-1.5">
      {items.map((item) => (
        <SidebarNavItem key={item.label} item={item} collapsed={collapsed} />
      ))}
    </nav>
  );
};

export default SidebarNav;
