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
          'fixed inset-0 z-30 bg-slate-900/30 backdrop-blur-sm transition-opacity md:hidden',
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        )}
        onClick={onClose}
      />
      <aside
        className={classNames(
          'fixed left-0 top-0 z-40 flex h-full w-72 flex-col gap-6 border border-white/40 bg-gradient-to-b from-white/80 via-blue-50/90 to-blue-100/80 px-6 py-8 shadow-[0_20px_60px_rgba(83,118,191,0.25)] transition-transform md:static md:h-auto md:w-64 md:rounded-[32px] md:border-white/50',
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        )}
      >
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 text-white shadow-[0_10px_20px_rgba(59,130,246,0.35)]">
            <span className="text-lg font-semibold">X</span>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-500">XProFlow</p>
            <p className="text-base font-semibold text-slate-900">Email Intelligence</p>
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
                    'flex items-center gap-3 rounded-full px-4 py-2.5 text-sm font-medium transition',
                    isActive
                      ? 'bg-white text-blue-600 shadow-[0_12px_24px_rgba(96,140,220,0.2)]'
                      : 'text-slate-600 hover:bg-white/70'
                  )
                }
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        <div className="rounded-2xl border border-white/60 bg-white/70 p-4 text-xs text-slate-600 shadow-sm">
          <p className="font-medium text-slate-700">Next sync</p>
          <p className="mt-1 text-sm font-semibold text-blue-600">Today · 3:00 PM</p>
          <p className="mt-3 text-xs text-slate-500">3 accounts connected</p>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
