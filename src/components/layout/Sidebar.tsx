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
import SidebarNav from './SidebarNav';

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
  className?: string;
  showCollapseToggle?: boolean;
  onNavigate?: () => void;
};

const Sidebar = ({
  collapsed,
  onToggle,
  theme,
  className,
  showCollapseToggle = true,
  onNavigate
}: SidebarProps) => {
  const logoSrc = theme === 'dark' ? xProFlowLogoLight : xProFlowLogoDark;
  return (
    <aside
      className={classNames(
        'sidebar-surface fixed bottom-4 left-4 top-4 z-40 flex flex-col border py-6 transition-all',
        collapsed ? 'w-20 px-3' : 'w-72 px-5',
        className
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
        {showCollapseToggle ? (
          <button
            type="button"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            onClick={onToggle}
            className="icon-button-ghost"
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        ) : null}
      </div>

      <SidebarNav items={navigation} collapsed={collapsed} onNavigate={onNavigate} />

      {!collapsed && (
        <div className="space-y-4">
          <div className="card-soft border p-4">
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
