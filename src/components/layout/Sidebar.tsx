import {
  LayoutDashboard,
  Inbox,
  GitBranch,
  CircleHelp,
  PanelLeftClose,
  PanelLeftOpen,
  Tag,
  PenSquare,
  Clock3,
  AtSign,
  BriefcaseBusiness,
  Settings,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { classNames } from '../../lib/utils';

const SIDEBAR_COLLAPSED_STORAGE_KEY = 'xproflow.sidebar.collapsed';
const SIDEBAR_VISIBLE_ITEMS_STORAGE_KEY = 'xproflow.sidebar.visible-items';

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
  const [isMenuEditorOpen, setIsMenuEditorOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(() => {
    const savedValue = localStorage.getItem(SIDEBAR_COLLAPSED_STORAGE_KEY);
    return savedValue === 'true';
  });

  const [visiblePrimaryItems, setVisiblePrimaryItems] = useState<string[]>(() => {
    const savedValue = localStorage.getItem(SIDEBAR_VISIBLE_ITEMS_STORAGE_KEY);

    if (!savedValue) {
      return primaryNavigation.map((item) => item.label);
    }

    try {
      const parsed = JSON.parse(savedValue);
      if (!Array.isArray(parsed)) {
        return primaryNavigation.map((item) => item.label);
      }

      return parsed.filter((label): label is string =>
        primaryNavigation.some((item) => item.label === label)
      );
    } catch {
      return primaryNavigation.map((item) => item.label);
    }
  });

  useEffect(() => {
    localStorage.setItem(SIDEBAR_COLLAPSED_STORAGE_KEY, String(isCollapsed));
  }, [isCollapsed]);

  useEffect(() => {
    localStorage.setItem(SIDEBAR_VISIBLE_ITEMS_STORAGE_KEY, JSON.stringify(visiblePrimaryItems));
  }, [visiblePrimaryItems]);

  const toggleSidebar = () => {
    setIsCollapsed((currentState) => !currentState);
  };

  const toggleMenuItem = (label: string) => {
    setVisiblePrimaryItems((currentItems) => {
      if (currentItems.includes(label)) {
        if (currentItems.length === 1) {
          return currentItems;
        }
        return currentItems.filter((itemLabel) => itemLabel !== label);
      }

      return [...currentItems, label];
    });
  };

  const visibleNavigation = primaryNavigation.filter((item) =>
    visiblePrimaryItems.includes(item.label)
  );

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
        {visibleNavigation.map((item) => renderItem(item.label, item.to, item.icon))}
      </nav>

      <div className="relative flex flex-col gap-2">
        <button
          type="button"
          onClick={() => setIsMenuEditorOpen((currentState) => !currentState)}
          aria-expanded={isMenuEditorOpen}
          aria-label="Customize sidebar menu"
          className={classNames(
            'flex h-8 w-full items-center rounded-lg border border-transparent px-2 theme-text-muted transition hover:bg-slate-900/90 hover:text-white',
            isCollapsed ? 'justify-center' : 'justify-start gap-2'
          )}
        >
          <Settings className="h-4 w-4 shrink-0" />
          <span className="sidebar-label truncate text-xs font-medium">Admin Menu</span>
        </button>

        {isMenuEditorOpen ? (
          <div
            className={classNames(
              'sidebar-surface absolute bottom-28 z-50 rounded-lg border border-slate-700/40 p-3 shadow-xl',
              isCollapsed ? 'left-0 w-52' : 'left-0 w-full min-w-52'
            )}
          >
            <p className="mb-2 text-xs font-semibold theme-text">Choose sidebar items</p>
            <div className="flex max-h-52 flex-col gap-1 overflow-y-auto">
              {primaryNavigation.map((item) => {
                const isChecked = visiblePrimaryItems.includes(item.label);
                const isLastChecked = isChecked && visiblePrimaryItems.length === 1;

                return (
                  <label key={item.label} className="flex cursor-pointer items-center gap-2 rounded px-1 py-1 text-xs theme-text-muted hover:bg-slate-900/70 hover:text-white">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      disabled={isLastChecked}
                      onChange={() => toggleMenuItem(item.label)}
                      className="h-3.5 w-3.5 rounded border-slate-500 bg-transparent"
                    />
                    <span className="truncate">{item.label}</span>
                  </label>
                );
              })}
            </div>
          </div>
        ) : null}

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
