import { NavLink } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Mail, Settings } from 'lucide-react';
import { useUser } from '../../context/UserContext';
import { classNames } from '../../lib/utils';

const navigation = [
  { label: 'Inbox', to: '/inbox', icon: Mail },
  { label: 'Settings', to: '/settings', icon: Settings }
];

type SidebarProps = {
  collapsed: boolean;
  onToggle: () => void;
};

const Sidebar = ({ collapsed, onToggle }: SidebarProps) => {
  const { user } = useUser();
  return (
    <aside
      className={classNames(
        'sidebar-surface fixed inset-y-0 left-0 z-40 flex flex-col border-r py-8 transition-all',
        collapsed ? 'w-16 px-3' : 'w-56 px-4'
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className={classNames('flex items-center', collapsed ? 'justify-center' : '')}>
          <span
            className={classNames(
              'text-lg font-semibold tracking-[0.2em] text-slate-900 dark:text-slate-100',
              collapsed ? 'text-base' : ''
            )}
          >
            XPF
          </span>
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

      <nav className="mt-8 flex flex-1 flex-col gap-3">
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

      <div className={classNames('mt-6 flex items-center', collapsed ? 'justify-center' : 'px-2')}>
        <img
          src={user.avatarUrl}
          alt={`${user.name} avatar`}
          className="h-9 w-9 rounded-full border border-white/60 object-cover shadow-sm dark:border-slate-900"
        />
      </div>
    </aside>
  );
};

export default Sidebar;
