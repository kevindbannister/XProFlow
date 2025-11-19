import { FC, useState } from 'react';
import { MainView } from '../types';
import flowEmailLogo from '../assets/flow-email-logo.svg';

interface TopNavProps {
  currentView: MainView;
  onChangeView: (view: MainView) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

const navItems: { label: string; value: MainView }[] = [
  { label: 'Overview', value: 'overview' },
  { label: 'Settings', value: 'settings' },
  { label: 'Billing', value: 'billing' },
  { label: 'Team', value: 'team' },
  { label: 'Account', value: 'account' },
];

export const TopNav: FC<TopNavProps> = ({ currentView, onChangeView, isDarkMode, onToggleDarkMode }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSelect = (view: MainView) => {
    onChangeView(view);
    setMobileOpen(false);
  };

  return (
    <header className="w-full border-b border-slate-200 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/70 dark:border-slate-800 dark:bg-slate-950/80 dark:supports-[backdrop-filter]:bg-slate-950/60">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <img
            src={flowEmailLogo}
            alt="Flow Email logo"
            className="h-12 w-auto rounded-2xl border border-slate-100 bg-slate-950 p-1 shadow-[0_0_25px_rgba(59,130,246,0.35)] dark:border-slate-800"
            loading="lazy"
          />
          <div className="flex flex-col leading-tight">
            <span className="text-lg font-semibold uppercase tracking-wide text-slate-900 dark:text-white">Flow Email</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">Automation assistant</span>
          </div>
        </div>
        <nav className="hidden gap-4 md:flex">
          {navItems.map((item) => (
            <button
              key={item.value}
              onClick={() => handleSelect(item.value)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition hover:text-emerald-600 ${
                currentView === item.value
                  ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10'
                  : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>
        <div className="hidden items-center gap-3 md:flex">
          <button
            onClick={onToggleDarkMode}
            aria-pressed={isDarkMode}
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-emerald-400 dark:border-slate-700 dark:text-slate-200"
          >
            <span role="img" aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}>
              {isDarkMode ? '🌙' : '☀️'}
            </span>
            <span className="hidden sm:inline">{isDarkMode ? 'Dark' : 'Light'} mode</span>
          </button>
          <div className="text-right">
            <p className="text-sm font-semibold text-slate-900 dark:text-white">Kevin Brooks</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">kevin@firm.co.uk</p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
            KB
          </div>
        </div>
        <div className="flex items-center gap-3 md:hidden">
          <button
            onClick={onToggleDarkMode}
            aria-pressed={isDarkMode}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition hover:border-emerald-400 dark:border-slate-700 dark:text-slate-200"
            aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDarkMode ? '🌙' : '☀️'}
          </button>
          <button
            onClick={() => setMobileOpen((prev) => !prev)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-600 dark:border-slate-700 dark:text-slate-200"
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
        <div className="border-t border-slate-200 bg-white px-4 py-3 shadow-md dark:border-slate-800 dark:bg-slate-900 md:hidden">
          <div className="space-y-2">
            {navItems.map((item) => (
              <button
                key={item.value}
                onClick={() => handleSelect(item.value)}
                className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-left text-sm font-medium ${
                  currentView === item.value
                    ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10'
                    : 'text-slate-700 dark:text-slate-200'
                }`}
              >
                {item.label}
              </button>
            ))}
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-3 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-300">
              <p className="font-semibold text-slate-900 dark:text-white">Kevin Brooks</p>
              <p>kevin@firm.co.uk</p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
