import { useState } from 'react';
import { Bell, ChevronDown, CircleHelp, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getUserInitials, useUser } from '../../context/UserContext';
import { DropdownMenu } from '../ui/DropdownMenu';

type TopbarProps = {
  title?: string;
  primaryActionLabel?: string;
  onPrimaryAction?: () => void;
};

const Topbar = ({ title, primaryActionLabel = 'New', onPrimaryAction }: TopbarProps) => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { user } = useUser();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (isLoggingOut) {
      return;
    }

    setIsLoggingOut(true);
    try {
      await logout();
      navigate('/login', { replace: true });
    } finally {
      setIsLoggingOut(false);
      setIsMenuOpen(false);
    }
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex h-16 items-center justify-between border-b border-slate-200 bg-slate-50 px-4">
      <div className="flex min-w-0 items-center gap-4">
        <div className="text-xl font-bold tracking-tight text-slate-900">XPF</div>
        <button
          type="button"
          className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
        >
          The Accurate Accountant
        </button>
      </div>

      <div className="flex-1 px-6">
        <h1 className="truncate text-center text-sm font-semibold text-slate-700">{title}</h1>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          className="rounded-md p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
        </button>
        <button
          type="button"
          className="rounded-md p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
          aria-label="Help"
        >
          <CircleHelp className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={onPrimaryAction}
          className="inline-flex items-center gap-1 rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
        >
          <Plus className="h-4 w-4" />
          {primaryActionLabel}
        </button>

        <DropdownMenu
          isOpen={isMenuOpen}
          onOpenChange={setIsMenuOpen}
          trigger={
            <button
              type="button"
              className="ml-1 inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-2 py-1.5 text-sm text-slate-700 transition hover:bg-slate-100"
              aria-label="Open user menu"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white">
                {getUserInitials(user.name)}
              </span>
              <ChevronDown className="h-4 w-4 text-slate-500" />
            </button>
          }
        >
          <button
            type="button"
            className="w-full rounded-lg px-3 py-2 text-left text-sm text-slate-600 hover:bg-slate-100"
            onClick={() => {
              navigate('/profile');
              setIsMenuOpen(false);
            }}
          >
            Profile
          </button>
          <button
            type="button"
            className="w-full rounded-lg px-3 py-2 text-left text-sm text-slate-600 hover:bg-slate-100"
            onClick={() => {
              navigate('/settings');
              setIsMenuOpen(false);
            }}
          >
            Settings
          </button>
          <button
            type="button"
            className="w-full rounded-lg px-3 py-2 text-left text-sm text-rose-600 hover:bg-rose-50"
            onClick={() => void handleLogout()}
          >
            {isLoggingOut ? 'Logging out…' : 'Logout'}
          </button>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Topbar;
