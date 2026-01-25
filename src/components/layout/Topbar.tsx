import { useState } from 'react';
import { Bell, HelpCircle, Menu, Search, ChevronDown, Sun, Moon } from 'lucide-react';
import { classNames } from '../../lib/utils';
import { Avatar } from '../ui/Avatar';
import { Button } from '../ui/Button';
import { DropdownMenu } from '../ui/DropdownMenu';

const userMenuItems = [
  { label: 'Profile', href: '#' },
  { label: 'Billing', href: '#' },
  { label: 'Logout', href: '#' }
];

type TopbarProps = {
  onMenuClick: () => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
};

const Topbar = ({ onMenuClick, theme, onToggleTheme }: TopbarProps) => {
  const [open, setOpen] = useState(false);

  return (
    <header className="topbar-surface flex flex-wrap items-center justify-between gap-4 rounded-[28px] border px-6 py-4 backdrop-blur-xl">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={onMenuClick}
          aria-label="Toggle sidebar"
        >
          <Menu className="h-5 w-5" />
        </Button>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-500">XProFlow</p>
          <h1 className="text-xl font-semibold theme-text-primary">Welcome back, Susan</h1>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          onClick={onToggleTheme}
        >
          {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>
        <Button variant="ghost" size="icon" aria-label="Search">
          <Search className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" aria-label="Notifications">
          <Bell className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" aria-label="Help">
          <HelpCircle className="h-5 w-5" />
        </Button>
        <DropdownMenu
          isOpen={open}
          onOpenChange={setOpen}
          trigger={
            <button
              className={classNames(
                'flex items-center gap-2 rounded-full border border-blue-200/70 bg-gradient-to-r from-blue-500 to-blue-600 px-3 py-1.5 text-sm font-semibold text-white shadow-[0_10px_20px_rgba(59,130,246,0.35)]',
                open && 'ring-2 ring-blue-200'
              )}
            >
              <Avatar fallback="SS" />
              Susan Smith
              <ChevronDown className="h-4 w-4" />
            </button>
          }
        >
          {userMenuItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="block rounded-lg px-3 py-2 text-sm theme-text-secondary hover:bg-blue-50"
            >
              {item.label}
            </a>
          ))}
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Topbar;
