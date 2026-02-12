import { Bell, ChevronDown, CircleHelp, Plus } from 'lucide-react';
import { Avatar } from '../ui/Avatar';
import { classNames } from '../../lib/utils';

type TopbarProps = {
  title?: string;
  primaryActionLabel?: string;
};

const iconButtonClassName =
  'inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 hover:text-slate-900';

const Topbar = ({ title, primaryActionLabel = 'Add' }: TopbarProps) => {
  return (
    <header className="fixed inset-x-0 top-0 z-50 h-16 border-b border-slate-200 bg-slate-50/95 backdrop-blur">
      <div className="flex h-full items-center justify-between gap-4 px-6">
        <div className="flex min-w-0 items-center gap-5">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold tracking-tight text-slate-900">XPF</span>
            <span className="hidden rounded-md border border-slate-200 bg-white px-2 py-1 text-xs font-medium text-slate-500 sm:inline-flex">
              Workspace
            </span>
          </div>
          <div className="hidden h-5 w-px bg-slate-200 md:block" />
          <p className="hidden text-sm font-semibold text-slate-700 md:block">{title ?? 'Overview'}</p>
        </div>

        <div className="flex items-center gap-2">
          <button type="button" className={classNames(iconButtonClassName)} aria-label="Notifications">
            <Bell className="h-4 w-4" strokeWidth={1.8} />
          </button>
          <button type="button" className={classNames(iconButtonClassName)} aria-label="Help">
            <CircleHelp className="h-4 w-4" strokeWidth={1.8} />
          </button>

          <button
            type="button"
            className="ml-1 inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-sm text-slate-700 transition hover:bg-slate-50"
            aria-label="Open user menu"
          >
            <Avatar fallback="AA" className="h-7 w-7 rounded-full bg-slate-200 text-[11px] font-semibold text-slate-700" />
            <span className="hidden font-medium lg:inline">The Accurate Accountant</span>
            <ChevronDown className="h-4 w-4 text-slate-500" strokeWidth={1.8} />
          </button>

          <button
            type="button"
            className="ml-2 inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
          >
            <Plus className="h-4 w-4" strokeWidth={2} />
            {primaryActionLabel}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
