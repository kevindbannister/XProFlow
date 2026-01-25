import { NavLink } from 'react-router-dom';
import { Home, Mail, Settings } from 'lucide-react';
import { classNames } from '../../lib/utils';

const navigation = [
  { label: 'Dashboard', to: '/dashboard', icon: Home },
  { label: 'Email Setup', to: '/email-setup', icon: Mail },
  { label: 'Settings', to: '/settings', icon: Settings }
];

const secondaryLinks = ['Invite your team', 'Get a free month', 'Settings', 'Help'];

const Sidebar = () => {
  return (
    <aside className="fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-gray-200 bg-[#f5f5f5] px-6 py-8">
      <div className="space-y-2">
        <p className="text-lg font-semibold text-slate-900">XProFlow</p>
        <span className="inline-flex w-fit items-center rounded-full border border-slate-200 bg-white px-2.5 py-0.5 text-xs font-medium text-slate-600">
          Basic
        </span>
      </div>

      <nav className="mt-8 flex flex-1 flex-col gap-1">
        {navigation.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.label}
              to={item.to}
              className={({ isActive }) =>
                classNames(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-white hover:text-slate-900',
                  isActive ? 'border border-slate-200 bg-white text-slate-900 shadow-sm' : ''
                )
              }
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </NavLink>
          );
        })}
      </nav>

      <div className="space-y-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-sm font-semibold text-slate-900">Try XProFlow Pro</p>
          <p className="mt-2 text-xs text-slate-500">
            Unlock advanced insights, custom automations, and priority support.
          </p>
          <button className="mt-3 w-full rounded-full bg-slate-900 px-3 py-2 text-xs font-semibold text-white">
            Upgrade to Pro
          </button>
        </div>
        <div className="flex flex-col gap-2">
          {secondaryLinks.map((link) => (
            <button
              key={link}
              className="text-left text-xs font-medium text-slate-500 transition hover:text-slate-700"
            >
              {link}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
