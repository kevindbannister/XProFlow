import { Bell, CircleHelp, ChevronDown, Plus, UserRound } from 'lucide-react';
import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { Avatar } from '../ui/Avatar';
import { getUserInitials, useUser } from '../../context/UserContext';

type TopBarProps = {
  title?: string;
};

const pageConfig: Record<string, { title: string; actionLabel: string }> = {
  '/dashboard': { title: 'Dashboard', actionLabel: 'Add widget' },
  '/inbox': { title: 'Inbox', actionLabel: 'New message' },
  '/rules': { title: 'Rules', actionLabel: 'New rule' },
};

const TopBar = ({ title }: TopBarProps) => {
  const location = useLocation();
  const { user } = useUser();

  const { resolvedTitle, actionLabel } = useMemo(() => {
    const config = pageConfig[location.pathname];
    return {
      resolvedTitle: title ?? config?.title ?? 'Workspace',
      actionLabel: config?.actionLabel ?? 'Add new',
    };
  }, [location.pathname, title]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 h-16 border-b border-slate-200 bg-slate-50/95 backdrop-blur">
      <div className="flex h-full items-center justify-between px-6 pl-[5.25rem]">
        <div className="flex min-w-0 items-center gap-6">
          <div className="flex items-center gap-3">
            <span className="text-2xl font-black tracking-tight text-slate-900">XPF</span>
            <button
              type="button"
              className="hidden items-center gap-2 rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-600 transition hover:bg-slate-100 md:inline-flex"
            >
              The Accurate Accountant
              <ChevronDown className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="hidden h-4 w-px bg-slate-200 md:block" />
          <h1 className="truncate text-sm font-semibold text-slate-700 md:text-base">{resolvedTitle}</h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="hidden items-center gap-2 rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white transition hover:bg-slate-800 sm:inline-flex"
          >
            <Plus className="h-4 w-4" />
            {actionLabel}
          </button>

          <button
            type="button"
            aria-label="Notifications"
            className="rounded-md p-2 text-slate-500 transition hover:bg-slate-200 hover:text-slate-700"
          >
            <Bell className="h-4 w-4" />
          </button>
          <button
            type="button"
            aria-label="Help"
            className="rounded-md p-2 text-slate-500 transition hover:bg-slate-200 hover:text-slate-700"
          >
            <CircleHelp className="h-4 w-4" />
          </button>

          <div className="mx-1 h-5 w-px bg-slate-200" />

          <button
            type="button"
            className="flex items-center gap-2 rounded-md px-1 py-1 transition hover:bg-slate-100"
            aria-label="Open user menu"
          >
            <Avatar
              src={user.avatarUrl}
              alt={`${user.name} avatar`}
              fallback={getUserInitials(user.name)}
              className="h-8 w-8 rounded-full border border-slate-200 bg-white text-xs font-semibold text-slate-700"
            />
            <UserRound className="hidden h-4 w-4 text-slate-500 md:block" />
            <ChevronDown className="hidden h-4 w-4 text-slate-500 md:block" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
