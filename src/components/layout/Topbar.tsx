import { useEffect, useRef, useState } from 'react';
import { Bell, ChevronDown, Menu, Moon, Sun } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AvatarUploadModal } from '../profile/AvatarUploadModal';
import { Avatar } from '../ui/Avatar';
import { DropdownMenu } from '../ui/DropdownMenu';
import IconButton from '../ui/IconButton';
import { classNames } from '../../lib/utils';
import { useAuth } from '../../context/AuthContext';
import { getUserInitials, useUser } from '../../context/UserContext';

type TopbarProps = {
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  title?: string;
  onOpenSidebar?: () => void;
};

const Topbar = ({ theme, onToggleTheme, title, onOpenSidebar }: TopbarProps) => {
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
    <header className="topbar-surface sticky top-4 z-20 mx-4 flex items-center justify-between rounded-[28px] border px-4 py-4 shadow-lg sm:px-6">
      <div className="flex items-center gap-3">
        <IconButton
          icon={<Menu className="h-4 w-4" />}
          label="Open navigation menu"
          className="md:hidden"
          onClick={onOpenSidebar}
        />
        <div className="theme-text-primary text-lg font-semibold sm:text-xl">{title}</div>
      </div>
      <div className="flex items-center gap-3">
        <div className="relative flex items-center">
          <input
            ref={searchInputRef}
            type="search"
            placeholder="Search"
            className={classNames(
              'absolute right-10 h-9 rounded-full border px-4 text-sm shadow-sm outline-none transition-all duration-300 input-surface',
              isSearchOpen
                ? 'w-56 opacity-100'
                : 'w-0 opacity-0 pointer-events-none border-transparent px-0 shadow-none'
            )}
          />
          <IconButton
            icon={<Bell className="h-4 w-4" />}
            label={isSearchOpen ? 'Close search' : 'Open search'}
            onClick={() => setIsSearchOpen((prev) => !prev)}
          />
        </div>
        <IconButton icon={<Bell className="h-4 w-4" />} label="Notifications" />
        <IconButton
          icon={theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          onClick={onToggleTheme}
        />
        <DropdownMenu
          isOpen={isProfileOpen}
          onOpenChange={setIsProfileOpen}
          align="right"
          trigger={
            <button
              type="button"
              className="flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-200 input-surface"
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
                void logout().finally(() => {
                  setIsProfileOpen(false);
                  navigate('/login');
                });
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
