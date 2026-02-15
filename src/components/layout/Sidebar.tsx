import { LayoutDashboard, Inbox, GitBranch, Settings, CircleHelp } from 'lucide-react';
import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { classNames } from '../../lib/utils';

const SIDEBAR_COLLAPSED_STORAGE_KEY = 'xproflow.sidebar.collapsed';

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
  'group relative flex h-7 w-7 items-center justify-center rounded-lg border border-transparent theme-text-muted transition hover:bg-slate-100/60 hover:text-slate-100';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(() => {
    const savedValue = localStorage.getItem(SIDEBAR_COLLAPSED_STORAGE_KEY);
    return savedValue === 'true';
  });

  useEffect(() => {
    localStorage.setItem(SIDEBAR_COLLAPSED_STORAGE_KEY, String(isCollapsed));
  }, [isCollapsed]);

  const toggleSidebar = () => {
    setIsCollapsed((currentState) => !currentState);
  };

  useEffect(() => {
    const onToggleShortcut = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'b') {
        event.preventDefault();
        toggleSidebar();
      }
    };

    window.addEventListener('keydown', onToggleShortcut);
    return () => window.removeEventListener('keydown', onToggleShortcut);
  }, []);

  const renderItem = (label: string, to: string, Icon: typeof LayoutDashboard) => (
    <NavLink
      key={label}
      to={to}
      className={({ isActive }: { isActive: boolean }) =>
        classNames(
          iconButtonStyles,
          isActive && 'border-slate-300/40 bg-slate-900 text-white hover:bg-slate-900 hover:text-white'
        )
      }
      aria-label={label}
    >
      <Icon className="h-4 w-4" strokeWidth={1.8} />
      <span className="sidebar-label dropdown-surface pointer-events-none absolute left-8 top-1/2 -translate-y-1/2 rounded-md border px-2 py-1 text-xs font-medium theme-text-secondary shadow-sm">
        {label}
      </span>
    </NavLink>
  );

  return (
    <aside
      className={classNames(
        'sidebar-surface sidebar-shell fixed bottom-0 left-0 top-10 z-40 flex flex-col items-center justify-between border-r py-2',
        isCollapsed ? 'w-12' : 'w-44'
      )}
      data-collapsed={isCollapsed}
    >
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
