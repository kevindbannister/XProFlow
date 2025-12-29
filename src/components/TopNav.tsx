import { FC, useState } from 'react';
import { MainView } from '../types';
import flowEmailLogo from '../assets/flow-email-logo.svg';

interface TopNavProps {
  currentView: MainView;
  onChangeView: (view: MainView) => void;
  navItems: { label: string; value: MainView }[];
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onLogout?: () => void;
  username?: string;
  showFeatureToggles?: boolean;
  featurePanelOpen?: boolean;
  onToggleFeaturePanel?: () => void;
}

export const TopNav: FC<TopNavProps> = ({
  currentView,
  onChangeView,
  navItems,
  isDarkMode,
  onToggleDarkMode,
  onLogout,
  username,
  showFeatureToggles,
  featurePanelOpen,
  onToggleFeaturePanel,
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSelect = (view: MainView) => {
    onChangeView(view);
    setMobileOpen(false);
  };

  return (
    <header className="w-full rounded-[32px] border border-white/60 bg-white/80 p-4 shadow-[0_25px_60px_rgba(15,23,42,0.12)] backdrop-blur-2xl">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <img
            src={flowEmailLogo}
            alt="Flowiee logo"
            className="h-12 w-auto rounded-2xl border border-white/70 bg-gradient-to-br from-slate-900 to-indigo-900 p-2 shadow-[0_10px_30px_rgba(79,70,229,0.35)]"
            loading="lazy"
          />
          <div className="flex flex-col leading-tight">
            <span className="text-lg font-semibold uppercase tracking-wide text-slate-900">Flowiee</span>
            <span className="text-xs text-slate-500">Automation assistant</span>
          </div>
        </div>
        <nav className="hidden items-center gap-1 rounded-full bg-slate-50/80 p-1 shadow-inner md:flex">
          {navItems.map((item) => (
            <button
              key={item.value}
              onClick={() => handleSelect(item.value)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                currentView === item.value ? 'bg-white text-slate-900 shadow' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>
        <div className="hidden items-center gap-3 md:flex">
          {showFeatureToggles ? (
            <button
              onClick={onToggleFeaturePanel}
              className={`inline-flex items-center justify-center rounded-full border border-white/70 px-4 py-2 text-sm font-semibold shadow-sm ${
                featurePanelOpen ? 'bg-slate-900 text-white' : 'bg-white/70 text-slate-700'
              }`}
            >
              Feature toggles
            </button>
          ) : null}
          {onLogout ? (
            <button
              onClick={onLogout}
              className="inline-flex items-center justify-center rounded-full border border-white/70 bg-white/70 px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm"
            >
              Log out
            </button>
          ) : null}
          <button
            onClick={onToggleDarkMode}
            aria-pressed={isDarkMode}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/70 text-lg text-slate-700 shadow-sm"
            aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDarkMode ? '🌙' : '☀️'}
          </button>
          <div className="text-right">
            <p className="text-sm font-semibold text-slate-900">{username ?? 'Kevin Brooks'}</p>
            <p className="text-xs text-slate-500">kevin@firm.co.uk</p>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-sm font-semibold text-white">
            {username ? username.slice(0, 2).toUpperCase() : 'KB'}
          </div>
        </div>
        <div className="flex flex-1 items-center justify-end gap-3 md:hidden">
          {showFeatureToggles ? (
            <button
              onClick={onToggleFeaturePanel}
              className={`inline-flex items-center justify-center rounded-full border border-white/70 px-3 py-2 text-xs font-semibold shadow-sm ${
                featurePanelOpen ? 'bg-slate-900 text-white' : 'bg-white/70 text-slate-700'
              }`}
            >
              Toggles
            </button>
          ) : null}
          <button
            onClick={onToggleDarkMode}
            aria-pressed={isDarkMode}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/70 text-slate-700 shadow-sm"
            aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDarkMode ? '🌙' : '☀️'}
          </button>
          <button
            onClick={() => setMobileOpen((prev) => !prev)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/70 text-slate-700 shadow-sm"
            aria-label="Toggle navigation"
          >
            ☰
          </button>
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-900 text-xs font-semibold text-white">
            {username ? username.slice(0, 2).toUpperCase() : 'KB'}
          </div>
        </div>
      </div>
      {mobileOpen && (
        <div className="mt-4 rounded-3xl border border-white/70 bg-white/90 p-4 shadow-inner md:hidden">
          <div className="space-y-2">
            {navItems.map((item) => (
              <button
                key={item.value}
                onClick={() => handleSelect(item.value)}
                className={`flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left text-sm font-medium ${
                  currentView === item.value ? 'bg-slate-100 text-slate-900' : 'text-slate-600'
                }`}
              >
                {item.label}
              </button>
            ))}
            {onLogout ? (
              <button
                onClick={onLogout}
                className="flex w-full items-center justify-between rounded-2xl border border-white/70 bg-white/80 px-4 py-3 text-left text-sm font-semibold text-slate-700"
              >
                Log out
              </button>
            ) : null}
            {showFeatureToggles ? (
              <button
                onClick={onToggleFeaturePanel}
                className="flex w-full items-center justify-between rounded-2xl border border-white/70 bg-white/70 px-4 py-3 text-left text-sm font-semibold text-slate-700"
              >
                Feature toggles
              </button>
            ) : null}
            <div className="rounded-2xl border border-white/60 bg-slate-50/80 p-3 text-sm text-slate-600">
              <p className="font-semibold text-slate-900">{username ?? 'Kevin Brooks'}</p>
              <p>kevin@firm.co.uk</p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
