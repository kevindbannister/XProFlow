import { Bell, Moon, Search, Sun } from 'lucide-react';

type TopbarProps = {
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
};

const Topbar = ({ theme, onToggleTheme }: TopbarProps) => {
  return (
    <header className="flex items-center justify-end border-b border-gray-200 bg-white px-8 py-4">
      <div className="flex items-center gap-3">
        <button
          className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-500 transition hover:text-gray-700"
          aria-label="Search"
        >
          <Search className="h-4 w-4" />
        </button>
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
    </header>
  );
};

export default Topbar;
