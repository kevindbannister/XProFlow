import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Mic, Moon, PenTool, Sun } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getUserInitials, useUser } from '../../context/UserContext';
import { applyThemeMode, getInitialThemeMode, type ThemeMode } from '../../lib/theme';
import { Avatar } from '../ui/Avatar';
import { DropdownMenu } from '../ui/DropdownMenu';

export type SelectedModule = 'email' | 'voice' | 'letters';

type PrimaryNavProps = {
  selectedModule: SelectedModule;
  onSelectModule: (module: SelectedModule) => void;
};

const primaryModules = [
  { id: 'email', label: 'Email', icon: Mail },
  { id: 'voice', label: 'Voice', icon: Mic },
  { id: 'letters', label: 'Letters', icon: PenTool }
] satisfies Array<{
  id: SelectedModule;
  label: string;
  icon: typeof Mail;
}>;

const moduleAccentClassNames: Record<SelectedModule, string> = {
  email: 'ring-[#27B0FF]/30',
  voice: 'ring-emerald-400/30',
  letters: 'ring-amber-400/30'
};

const PrimaryNav = ({ selectedModule, onSelectModule }: PrimaryNavProps) => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { user } = useUser();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [themeMode, setThemeMode] = useState<ThemeMode>(getInitialThemeMode);

  useEffect(() => {
    applyThemeMode(themeMode);
  }, [themeMode]);

  const handleLogout = async () => {
    await logout();
    setIsUserMenuOpen(false);
    navigate('/login', { replace: true });
  };

  return (
    <aside
      className="xp-rail flex h-full shrink-0 flex-col items-center border-r border-slate-200/70 bg-white/80 pb-4 pt-20 dark:border-slate-800 dark:bg-[#111926]"
      style={{ width: 'var(--rail-width, 48px)' }}
      aria-label="Primary navigation"
    >
      <nav className="flex w-full flex-1 flex-col items-center gap-2">
        {primaryModules.map((module) => {
          const Icon = module.icon;
          const isActive = module.id === selectedModule;

          return (
            <button
              key={module.id}
              type="button"
              className={`xp-rail-item flex h-8 w-full items-center justify-center transition ${
                isActive
                  ? 'rounded-r-xl bg-gradient-to-r from-[#27B0FF] to-[#3B82F6] text-white shadow-[0_10px_24px_rgba(59,130,246,0.24)] hover:brightness-[1.03]'
                  : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white'
              }`}
              data-active={isActive}
              aria-pressed={isActive}
              aria-label={module.label}
              title={module.label}
              onClick={() => onSelectModule(module.id)}
            >
              <span
                className={`flex h-6 w-6 items-center justify-center rounded-lg transition ${
                  isActive
                    ? 'bg-white/18 text-white'
                    : `bg-slate-100 text-slate-600 ring-1 ${moduleAccentClassNames[module.id]} dark:bg-slate-800 dark:text-slate-200`
                }`}
              >
                <Icon className="h-4 w-4" strokeWidth={2} />
              </span>
            </button>
          );
        })}
      </nav>

      <div className="flex flex-col items-center gap-3 px-2 pt-4">
        <button
          type="button"
          className="xp-rail-item flex h-8 w-8 items-center justify-center rounded-xl text-slate-500 transition hover:bg-gradient-to-r hover:from-[#27B0FF] hover:to-[#3B82F6] hover:text-white hover:shadow-[0_10px_24px_rgba(59,130,246,0.24)] hover:brightness-[1.03] dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
          aria-label={themeMode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          title={themeMode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          onClick={() => setThemeMode((currentMode) => (currentMode === 'dark' ? 'light' : 'dark'))}
        >
          {themeMode === 'dark' ? (
            <Sun className="h-5 w-5" strokeWidth={1.8} />
          ) : (
            <Moon className="h-5 w-5" strokeWidth={1.8} />
          )}
        </button>

        <DropdownMenu
          isOpen={isUserMenuOpen}
          onOpenChange={setIsUserMenuOpen}
          align="left"
          side="right"
          trigger={(
            <button
              type="button"
              className="xp-rail-item flex h-8 w-8 items-center justify-center rounded-xl text-slate-500 transition hover:bg-gradient-to-r hover:from-[#27B0FF] hover:to-[#3B82F6] hover:text-white hover:shadow-[0_10px_24px_rgba(59,130,246,0.24)] hover:brightness-[1.03] dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
              aria-label="Open user menu"
              title={user.name}
            >
              <Avatar
                src={user.avatarUrl}
                alt={user.name}
                fallback={getUserInitials(user.name)}
                className="h-6 w-6 bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-100"
              />
            </button>
          )}
        >
          <Link
            to="/profile"
            className="flex w-full items-center rounded-xl px-3 py-2 text-left text-sm font-medium text-content-secondary transition hover:bg-surface-hover hover:text-content-primary dark:text-[#C9D6E6] dark:hover:bg-white/5 dark:hover:text-white"
          >
            Profile
          </Link>
          <button
            type="button"
            onClick={() => void handleLogout()}
            className="flex w-full items-center rounded-xl px-3 py-2 text-left text-sm font-medium text-content-secondary transition hover:bg-surface-hover hover:text-content-primary dark:text-[#C9D6E6] dark:hover:bg-white/5 dark:hover:text-white"
          >
            Log out
          </button>
        </DropdownMenu>
      </div>
    </aside>
  );
};

export default PrimaryNav;
