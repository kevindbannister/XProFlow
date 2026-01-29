import { NavLink } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  Filter,
  GitBranch,
  Home,
  ListChecks,
  Plug,
  Settings,
  Tag
} from 'lucide-react';
import { xProFlowBlue } from '../../lib/designTokens';
import { classNames } from '../../lib/utils';
import { xProFlowLogoDark, xProFlowLogoLight } from './logoAssets';

const navigation = [
  { label: 'Dashboard', to: '/dashboard', icon: Home },
  { label: 'Onboarding', to: '/onboarding', icon: ListChecks },
  { label: 'Labels', to: '/labels', icon: Tag },
  { label: 'Rules', to: '/rules', icon: Filter },
  { label: 'Integrations', to: '/integrations', icon: Plug },
  { label: 'Workflows', to: '/workflows', icon: GitBranch },
  { label: 'Drafts', to: '/settings/drafts', icon: Settings },
  { label: 'Settings', to: '/settings', icon: Settings }
];

const secondaryLinks = ['Invite your team', 'Get a free month', 'Settings', 'Help'];

type SidebarProps = {
  collapsed: boolean;
  onToggle: () => void;
  theme: 'dark' | 'light';
};

const Sidebar = ({ collapsed, onToggle, theme }: SidebarProps) => {
  const logoSrc = theme === 'dark' ? xProFlowLogoLight : xProFlowLogoDark;
  return (
    <aside
      className={classNames(
        'sidebar-surface fixed inset-y-0 left-0 z-40 flex flex-col border-r py-8 transition-all',
        collapsed ? 'w-20 px-4' : 'w-72 px-6'
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className={classNames('space-y-2', collapsed ? 'text-center' : '')}>
          <img
            src={logoSrc}
            alt="XProFlow"
            className={classNames(
              'object-contain',
              collapsed ? 'h-8 w-8' : 'h-10 w-full max-w-[200px]'
            )}
          />
          {!collapsed && (
            <span className="inline-flex w-fit items-center rounded-full border border-slate-200 bg-white px-2.5 py-0.5 text-xs font-medium text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">
              Basic
            </span>
          )}
        </div>
        <button
          type="button"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          onClick={onToggle}
          className="rounded-lg border border-slate-200 bg-white p-1 text-slate-600 transition hover:text-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:text-slate-100"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      <nav className="mt-8 flex flex-1 flex-col gap-1">
        {navigation.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.label}
              to={item.to}
              className={({ isActive }: { isActive: boolean }) =>
                classNames(
                  'nav-link group relative flex items-center gap-3 rounded-lg border border-transparent py-2 text-sm font-medium transition',
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

      {!collapsed && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Try XProFlow Pro
            </p>
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-300">
              Unlock advanced insights, custom automations, and priority support.
            </p>
            <button
              className={classNames(
                'mt-3 w-full rounded-full px-3 py-2 text-xs font-semibold text-white transition hover:bg-sky-700',
                xProFlowBlue.focusRing,
                'bg-sky-600'
              )}
            >
              Upgrade to Pro
            </button>
          </div>
          <div className="flex flex-col gap-2">
            {secondaryLinks.map((link) => (
              <button
                key={link}
                className="text-left text-xs font-medium text-slate-500 transition hover:text-slate-700 dark:text-slate-300 dark:hover:text-slate-100"
              >
                {link}
              </button>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
