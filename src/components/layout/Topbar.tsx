import { Bell, ChevronDown, CircleHelp, Plus } from 'lucide-react';
import { Button } from '../ui/Button';
import { Avatar } from '../ui/Avatar';
import { getUserInitials, useUser } from '../../context/UserContext';

type TopbarProps = {
  title?: string;
  primaryActionLabel?: string;
};

const Topbar = ({ title, primaryActionLabel = 'New' }: TopbarProps) => {
  const { user } = useUser();

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex h-16 items-center justify-between border-b border-slate-200 bg-slate-50/95 px-5 backdrop-blur-sm">
      <div className="flex min-w-0 items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold tracking-wide text-slate-900">XPF</span>
          <span className="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-600">
            Workspace
          </span>
        </div>
        {title ? <h1 className="truncate text-sm font-semibold text-slate-700">{title}</h1> : null}
      </div>

      <div className="flex items-center gap-1">
        <Button
          type="button"
          variant="default"
          size="sm"
          className="mr-2 inline-flex items-center gap-1 rounded-lg px-3 py-2"
          aria-label={`${primaryActionLabel} action`}
        >
          <Plus className="h-4 w-4" />
          {primaryActionLabel}
        </Button>

        <button
          type="button"
          aria-label="Notifications"
          className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
        >
          <Bell className="h-4 w-4" />
        </button>
        <button
          type="button"
          aria-label="Help"
          className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
        >
          <CircleHelp className="h-4 w-4" />
        </button>

        <button
          type="button"
          aria-label="Open user menu"
          className="ml-1 inline-flex items-center gap-2 rounded-lg border border-transparent px-2 py-1.5 text-left transition hover:border-slate-200 hover:bg-white"
        >
          <Avatar
            src={user.avatarUrl}
            alt={`${user.name} avatar`}
            fallback={getUserInitials(user.name)}
            className="h-8 w-8 rounded-full bg-slate-200 text-xs font-semibold text-slate-700"
          />
          <span className="hidden text-sm font-medium text-slate-700 lg:inline">{user.name}</span>
          <ChevronDown className="h-4 w-4 text-slate-500" />
        </button>
      </div>
    </header>
  );
};

export default Topbar;
