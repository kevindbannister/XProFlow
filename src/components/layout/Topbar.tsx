import { useEffect, useRef, useState } from 'react';
import { Bell, ChevronDown, Moon, Sun } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AvatarUploadModal } from '../profile/AvatarUploadModal';
import { Avatar } from '../ui/Avatar';
import { DropdownMenu } from '../ui/DropdownMenu';
import { classNames } from '../../lib/utils';
import { useAuth } from '../../context/AuthContext';
import { getUserInitials, useUser } from '../../context/UserContext';

type TopbarProps = {
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  title?: string;
};

const Topbar = ({ theme, onToggleTheme, title }: TopbarProps) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const firstMenuItemRef = useRef<HTMLButtonElement>(null);
  const { user, updateAvatar } = useUser();
  const { logout } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (isSearchOpen) {
      searchInputRef.current?.focus();
    }
  }, [isSearchOpen]);

  useEffect(() => {
    if (isProfileOpen) {
      firstMenuItemRef.current?.focus();
    }
  }, [isProfileOpen]);

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
            <Bell className="h-4 w-4" />
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
        <DropdownMenu
          isOpen={isProfileOpen}
          onOpenChange={setIsProfileOpen}
          align="right"
          trigger={
            <button
              type="button"
              className="flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 text-sm font-medium text-gray-700 transition hover:border-blue-200 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-200 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
              aria-haspopup="menu"
              aria-expanded={isProfileOpen}
            >
              <Avatar
                src={user.avatarUrl}
                alt={user.name}
                fallback={getUserInitials(user.name)}
                className="h-8 w-8 rounded-full bg-gray-200 text-xs font-semibold text-gray-700 dark:bg-slate-800 dark:text-slate-100"
              />
              <span>{user.name}</span>
              <ChevronDown className="h-4 w-4 text-slate-400" />
            </button>
          }
        >
          <div className="space-y-1">
            <button
              type="button"
              ref={firstMenuItemRef}
              className="w-full rounded-xl px-3 py-2 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-900"
              onClick={() => {
                navigate('/profile');
                setIsProfileOpen(false);
              }}
            >
              Profile
            </button>
            <button
              type="button"
              className="w-full rounded-xl px-3 py-2 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-900"
              onClick={() => {
                setIsPhotoModalOpen(true);
                setIsProfileOpen(false);
              }}
            >
              Change photo
            </button>
            <button
              type="button"
              className="w-full rounded-xl px-3 py-2 text-left text-sm font-medium text-red-600 transition hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
              onClick={() => {
                logout();
                setIsProfileOpen(false);
                navigate('/login');
              }}
            >
              Logout
            </button>
          </div>
        </DropdownMenu>
      </div>
      <AvatarUploadModal
        open={isPhotoModalOpen}
        onClose={() => setIsPhotoModalOpen(false)}
        onSave={(avatarUrl) => updateAvatar(avatarUrl)}
      />
    </header>
  );
};

export default Topbar;
