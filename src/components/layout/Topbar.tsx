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

  useEffect(() => {
    if (isSearchOpen) {
      searchInputRef.current?.focus();
    }
  }, [isSearchOpen]);

  return (
    <header className="flex items-center justify-between border-b border-gray-200 bg-white px-8 py-4 dark:border-slate-800 dark:bg-slate-950">
      <div className="text-lg font-semibold text-slate-900 dark:text-slate-100">{title}</div>
      <div className="flex items-center gap-3">
        <div className="relative flex items-center">
          <input
            ref={searchInputRef}
            type="search"
            placeholder="Search"
            className={classNames(
              'absolute right-10 h-9 rounded-full border border-gray-200 bg-white px-4 text-sm text-gray-700 shadow-sm outline-none transition-all duration-300 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100',
              isSearchOpen
                ? 'w-56 opacity-100'
                : 'w-0 opacity-0 pointer-events-none border-transparent px-0 shadow-none'
            )}
          />
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-500 transition hover:text-gray-700 dark:border-slate-800 dark:text-slate-300 dark:hover:text-slate-100"
            aria-label={isSearchOpen ? 'Close search' : 'Open search'}
            onClick={() => setIsSearchOpen((prev) => !prev)}
          >
            <Search className="h-4 w-4" />
          </button>
        </div>
        <button
          className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-500 transition hover:text-gray-700 dark:border-slate-800 dark:text-slate-300 dark:hover:text-slate-100"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
        </button>
        <button
          className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-500 transition hover:text-gray-700 dark:border-slate-800 dark:text-slate-300 dark:hover:text-slate-100"
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          onClick={onToggleTheme}
        >
          {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>
        <div className="flex items-center gap-3 rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 dark:border-slate-800 dark:bg-slate-900">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-xs font-semibold text-gray-700 dark:bg-slate-800 dark:text-slate-100">
            SS
          </span>
          <span className="text-sm font-medium text-gray-700 dark:text-slate-100">
            Susan Smith
          </span>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
