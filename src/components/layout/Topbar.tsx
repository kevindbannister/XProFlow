import { useEffect, useRef, useState } from 'react';
import { Bell, Moon, Search, Sun } from 'lucide-react';
import { classNames } from '../../lib/utils';

type TopbarProps = {
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  title?: string;
};

const Topbar = ({ theme, onToggleTheme, title }: TopbarProps) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const kpiHighlights = [
    { label: 'Emails processed', value: '1,284' },
    { label: 'Time saved', value: '14h 32m' },
    { label: 'Cost saved', value: '£1,284' }
  ];

  useEffect(() => {
    if (isSearchOpen) {
      searchInputRef.current?.focus();
    }
  }, [isSearchOpen]);

  return (
    <header className="flex items-start justify-between border-b border-gray-200 bg-white px-8 py-4">
      <div className="text-lg font-semibold text-slate-900">{title}</div>
      <div className="flex flex-col items-end gap-3">
        <div className="flex flex-wrap items-center justify-end gap-2">
          {kpiHighlights.map((kpi) => (
            <div
              key={kpi.label}
              className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1 text-xs text-gray-500"
            >
              <span className="font-semibold text-slate-900">{kpi.value}</span>
              <span>{kpi.label}</span>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <div className="relative flex items-center">
            <input
              ref={searchInputRef}
              type="search"
              placeholder="Search"
              className={classNames(
                'absolute right-10 h-9 rounded-full border border-gray-200 bg-white px-4 text-sm text-gray-700 shadow-sm outline-none transition-all duration-300',
                isSearchOpen
                  ? 'w-56 opacity-100'
                  : 'w-0 opacity-0 pointer-events-none border-transparent px-0 shadow-none'
              )}
            />
            <button
              type="button"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-500 transition hover:text-gray-700"
              aria-label={isSearchOpen ? 'Close search' : 'Open search'}
              onClick={() => setIsSearchOpen((prev) => !prev)}
            >
              <Search className="h-4 w-4" />
            </button>
          </div>
          <button
            className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-500 transition hover:text-gray-700"
            aria-label="Notifications"
          >
            <Bell className="h-4 w-4" />
          </button>
          <button
            className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-500 transition hover:text-gray-700"
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            onClick={onToggleTheme}
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <div className="flex items-center gap-3 rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-xs font-semibold text-gray-700">
              SS
            </span>
            <span className="text-sm font-medium text-gray-700">Susan Smith</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
