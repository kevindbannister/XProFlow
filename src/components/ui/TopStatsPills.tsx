import { Clock, Mail, PoundSterling } from 'lucide-react';

type TopStats = {
  emailsProcessed: string;
  timeSaved: string;
  costSaved: string;
};

type TopStatsPillsProps = {
  stats: TopStats;
};

const pillBaseClasses =
  'chip-surface inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold theme-text-secondary transition-colors';

const tooltipBaseClasses =
  'pointer-events-none absolute right-0 top-full z-20 mt-2 w-56 origin-top-right rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-600 shadow-lg opacity-0 scale-95 transition duration-200 ease-out group-hover:opacity-100 group-hover:scale-100 group-focus-within:opacity-100 group-focus-within:scale-100';

export const TopStatsPills = ({ stats }: TopStatsPillsProps) => {
  const items = [
    {
      id: 'emails-processed',
      icon: Mail,
      label: 'Emails',
      value: stats.emailsProcessed,
      title: 'Emails processed',
      description: 'Total emails processed by XProFlow',
    },
    {
      id: 'time-saved',
      icon: Clock,
      label: 'Time saved',
      value: stats.timeSaved,
      title: 'Time saved',
      description: 'Estimated time saved through automation',
    },
    {
      id: 'cost-saved',
      icon: PoundSterling,
      label: 'Cost saved',
      value: stats.costSaved,
      title: 'Cost saved',
      description: 'Estimated cost savings based on time saved',
    },
  ];

  return (
    <div className="flex flex-wrap items-center justify-end gap-2">
      {items.map((item) => {
        const Icon = item.icon;
        const tooltipId = `top-stats-${item.id}`;

        return (
          <div key={item.id} className="group relative">
            <button type="button" className={pillBaseClasses} aria-describedby={tooltipId}>
              <Icon className="h-4 w-4 text-slate-400" strokeWidth={1.6} aria-hidden="true" />
              <span className="text-sm font-semibold theme-text-primary">{item.value}</span>
              <span className="hidden text-[11px] font-medium theme-text-muted sm:inline">
                {item.label}
              </span>
            </button>
            <div id={tooltipId} role="tooltip" className={tooltipBaseClasses}>
              <div className="text-[11px] font-semibold text-slate-800">{item.title}</div>
              <div className="mt-1 text-sm font-semibold text-slate-900">{item.value}</div>
              <div className="mt-1 text-[11px] text-slate-500">{item.description}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
