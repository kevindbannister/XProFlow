import { LayoutDashboard, Inbox, GitBranch, CircleHelp, PanelLeftClose, PanelLeftOpen, Tag, PenSquare, Clock3, AtSign, BriefcaseBusiness } from 'lucide-react';
import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { classNames } from '../../lib/utils';

const SIDEBAR_COLLAPSED_STORAGE_KEY = 'xproflow.sidebar.collapsed';

const primaryNavigation: Array<{ label: string; to: string; icon: typeof LayoutDashboard }> = [
  { label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
  { label: 'Inbox', to: '/inbox', icon: Inbox },
  { label: 'Labels', to: '/labels', icon: Tag },
  { label: 'Rules', to: '/rules', icon: GitBranch },
  { label: 'Drafting', to: '/settings/drafts', icon: PenSquare },
  { label: 'Writing Style', to: '/writing-style', icon: PenSquare },
  { label: 'Signature & Time Zone', to: '/signature-time-zone', icon: Clock3 },
  { label: 'Professional Context', to: '/settings/professional-context', icon: BriefcaseBusiness },
  { label: 'Account', to: '/account-settings', icon: AtSign },
];

const secondaryNavigation: Array<{ label: string; to: string; icon: typeof LayoutDashboard }> = [
  { label: 'Help', to: '/integrations', icon: CircleHelp },
];

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

  const renderItem = (label: string, to: string, Icon: typeof LayoutDashboard) => (
    <NavLink
      key={label}
      to={to}
      className={({ isActive }: { isActive: boolean }) =>
        classNames(
          'group relative flex h-8 w-full items-center rounded-lg border border-transparent px-2 transition hover:bg-slate-900/90 hover:text-white',
          isCollapsed ? 'justify-center' : 'justify-start gap-2',
          isActive
            ? 'border-slate-300/40 bg-slate-900 text-white hover:bg-slate-900 hover:text-white'
            : 'theme-text-muted'
        )
      }
      aria-label={label}
    >
      <Icon className="h-4 w-4 shrink-0" strokeWidth={1.8} />
      <span className="sidebar-label truncate text-xs font-medium">{label}</span>
    </NavLink>
  );

  return (
    <aside
      className={classNames(
        'sidebar-surface sidebar-shell fixed bottom-0 left-0 top-10 z-40 flex flex-col justify-between border-r py-2',
        isCollapsed ? 'w-12 px-2' : 'w-44 px-2'
      )}
      data-collapsed={isCollapsed}
    >
      <nav className="flex flex-col gap-1">
        {primaryNavigation.map((item) => renderItem(item.label, item.to, item.icon))}
      </nav>

      <div className="flex flex-col gap-2">
        <nav className="flex flex-col gap-1">
          {secondaryNavigation.map((item) => renderItem(item.label, item.to, item.icon))}
        </nav>

        <button
          type="button"
          onClick={toggleSidebar}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className={classNames(
            'flex h-8 w-full items-center rounded-lg border border-transparent px-2 theme-text-muted transition hover:bg-slate-900/90 hover:text-white',
            isCollapsed ? 'justify-center' : 'justify-start gap-2'
          )}
        >
          {isCollapsed ? <PanelLeftOpen className="h-4 w-4 shrink-0" /> : <PanelLeftClose className="h-4 w-4 shrink-0" />}
          <span className="sidebar-label truncate text-xs font-medium">{isCollapsed ? 'Expand' : 'Collapse'}</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
