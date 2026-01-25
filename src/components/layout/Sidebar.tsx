import { NavLink } from 'react-router-dom';
import { classNames } from '../../lib/utils';

const navigation = [
  { label: 'Dashboard', to: '/' },
  { label: 'Inbox', to: '/inbox' },
  { label: 'Settings', to: '/settings' }
];

const Sidebar = () => {
  return (
    <aside className="hidden w-64 flex-col border-r border-slate-800 bg-slate-900/70 p-6 md:flex">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-widest text-slate-400">Flowiee</p>
          <p className="text-lg font-semibold text-white">Client Triage</p>
        </div>
      </div>
      <nav className="mt-10 space-y-2">
        {navigation.map((item) => (
          <NavLink
            key={item.label}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              classNames(
                'block rounded-lg px-3 py-2 text-sm font-medium transition',
                isActive ? 'bg-slate-800 text-white' : 'text-slate-300 hover:bg-slate-800/60'
              )
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="mt-auto rounded-lg border border-slate-800 bg-slate-900/60 p-4 text-xs text-slate-400">
        <p>Next sync: 3:00 PM</p>
        <p>3 team members online</p>
      </div>
    </aside>
  );
};

export default Sidebar;
