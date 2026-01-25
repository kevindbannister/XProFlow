import { NavLink } from 'react-router-dom';
import { Home, Mail, Settings } from 'lucide-react';
import { classNames } from '../../lib/utils';

const navigation = [
  { label: 'Dashboard', to: '/dashboard', icon: Home },
  { label: 'Email Setup', to: '/email-setup', icon: Mail },
  { label: 'Settings', to: '/settings', icon: Settings }
];

type SidebarProps = {
  isOpen: boolean;
  onClose: () => void;
};

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  return (
    <>
      <div
        className={classNames(
          'theme-overlay fixed inset-0 z-30 backdrop-blur-sm transition-opacity md:hidden',
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        )}
        onClick={onClose}
      />
      <aside
        className={classNames(
          'sidebar-surface fixed left-0 top-0 z-40 flex h-full w-72 flex-col gap-6 border px-6 py-8 transition-transform md:static md:h-auto md:w-64 md:rounded-[32px] md:border',
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        )}
      >
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 text-white shadow-[0_10px_20px_rgba(59,130,246,0.35)]">
            <span className="text-lg font-semibold">X</span>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-500">XProFlow</p>
            <p className="text-base font-semibold theme-text-primary">Email Intelligence</p>
          </div>
        </div>

        <nav className="flex flex-1 flex-col gap-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.label}
                to={item.to}
                className={({ isActive }) =>
                  classNames(
                    'nav-link flex items-center gap-3 rounded-full px-4 py-2.5 text-sm font-medium transition',
                    isActive
                      ? 'nav-link-active'
                      : ''
                  )
                }
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        <div className="panel-surface rounded-2xl border p-4 text-xs theme-text-secondary">
          <p className="font-medium theme-text-primary">Next sync</p>
          <p className="mt-1 text-sm font-semibold text-blue-600">Today · 3:00 PM</p>
          <p className="mt-3 text-xs theme-text-muted">3 accounts connected</p>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
