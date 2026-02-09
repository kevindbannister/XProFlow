import { NavLink } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Mail, Settings } from 'lucide-react';
import { Avatar } from '../ui/Avatar';
import { getUserInitials, useUser } from '../../context/UserContext';
import { classNames } from '../../lib/utils';

const navigation = [
  { label: 'Inbox', to: '/inbox', icon: Mail },
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
        collapsed ? 'w-20 px-3' : 'w-20 px-3'
      )}
    >
      <div className="flex items-center justify-center">
        <span className="text-lg font-semibold tracking-[0.3em] text-slate-900 dark:text-slate-100">
          XPF
        </span>
      </div>
      <button
        type="button"
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        onClick={onToggle}
        className="sr-only"
      >
        {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
      </button>

      <nav className="mt-8 flex flex-1 flex-col items-center gap-4">
        {navigation.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.label}
              to={item.to}
              className="group flex w-full items-center justify-center"
              aria-label={item.label}
            >
              {({ isActive }: { isActive: boolean }) => (
                <span
                  className={classNames(
                    'flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 shadow-sm transition dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300',
                    isActive
                      ? 'border-slate-300 bg-slate-900 text-white dark:border-slate-600 dark:bg-slate-100 dark:text-slate-900'
                      : 'group-hover:border-slate-300 group-hover:text-slate-900 dark:group-hover:border-slate-600 dark:group-hover:text-slate-100'
                  )}
                  title={item.label}
                >
                  <Icon className="h-5 w-5" strokeWidth={1.6} />
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      <div className="mt-auto flex items-center justify-center gap-3 px-2 pb-2">
        <NavLink
          to="/profile"
          className="group flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-slate-300 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 dark:hover:border-slate-600 dark:hover:text-slate-100"
          aria-label="Profile"
        >
          <span title="Profile" className="flex items-center justify-center">
            <Avatar
              src={user.avatarUrl}
              alt={`${user.name} avatar`}
              fallback={getUserInitials(user.name)}
              className="h-8 w-8 rounded-full bg-slate-100 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-100"
            />
          </span>
        </NavLink>
        <NavLink
          to="/settings"
          className={({ isActive }: { isActive: boolean }) =>
            classNames(
              'group flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 shadow-sm transition dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300',
              isActive
                ? 'border-slate-300 bg-slate-900 text-white dark:border-slate-600 dark:bg-slate-100 dark:text-slate-900'
                : 'hover:border-slate-300 hover:text-slate-900 dark:hover:border-slate-600 dark:hover:text-slate-100'
            )
          }
          aria-label="Settings"
        >
          <span title="Settings" className="flex items-center justify-center">
            <Settings className="h-5 w-5" strokeWidth={1.6} />
          </span>
        </NavLink>
      </div>
    </aside>
  );
};

export default Sidebar;
