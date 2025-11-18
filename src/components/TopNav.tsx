import { FC, useState } from 'react';
import { MainView } from '../types';

interface TopNavProps {
  currentView: MainView;
  onChangeView: (view: MainView) => void;
}

const navItems: { label: string; value: MainView }[] = [
  { label: 'Overview', value: 'overview' },
  { label: 'Settings', value: 'settings' },
  { label: 'Billing', value: 'billing' },
  { label: 'Team', value: 'team' },
  { label: 'Account', value: 'account' },
];

export const TopNav: FC<TopNavProps> = ({ currentView, onChangeView }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSelect = (view: MainView) => {
    onChangeView(view);
    setMobileOpen(false);
  };

  return (
    <header className="w-full border-b border-slate-200 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/70">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600">✉️⚡</div>
          <div className="flex flex-col leading-none">
            <span className="text-lg font-semibold text-slate-900">FlowMail AI</span>
            <span className="text-xs text-slate-500">Automation assistant</span>
          </div>
        </div>
        <nav className="hidden gap-4 md:flex">
          {navItems.map((item) => (
            <button
              key={item.value}
              onClick={() => handleSelect(item.value)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition hover:text-emerald-600 ${
                currentView === item.value ? 'bg-emerald-50 text-emerald-600' : 'text-slate-600'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>
        <div className="hidden items-center gap-3 md:flex">
          <div className="text-right">
            <p className="text-sm font-semibold text-slate-900">Kevin Brooks</p>
            <p className="text-xs text-slate-500">kevin@firm.co.uk</p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
            KB
          </div>
        </div>
        <div className="flex items-center gap-3 md:hidden">
          <button
            onClick={() => setMobileOpen((prev) => !prev)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-600"
            aria-label="Toggle navigation"
          >
            ☰
          </button>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
            KB
          </div>
        </div>
      </div>
      {mobileOpen && (
        <div className="border-t border-slate-200 bg-white px-4 py-3 shadow-md md:hidden">
          <div className="space-y-2">
            {navItems.map((item) => (
              <button
                key={item.value}
                onClick={() => handleSelect(item.value)}
                className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-left text-sm font-medium ${
                  currentView === item.value ? 'bg-emerald-50 text-emerald-600' : 'text-slate-700'
                }`}
              >
                {item.label}
              </button>
            ))}
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-3 text-sm text-slate-600">
              <p className="font-semibold text-slate-900">Kevin Brooks</p>
              <p>kevin@firm.co.uk</p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
