import { FC } from 'react';

export type Metric = {
  id: string;
  label: string;
  value: string;
  deltaText: string;
};

export type AutomationPoint = {
  label: string;
  value: number;
};

export type CategoryStat = {
  name: string;
  count: number;
  percentage: number;
};

const metrics: Metric[] = [
  { id: 'analysed', label: 'Emails analysed today', value: '82', deltaText: '+12% vs last week' },
  { id: 'categorized', label: 'Emails categorised', value: '61', deltaText: '+8% vs last week' },
  { id: 'drafts', label: 'AI draft replies generated', value: '19', deltaText: '+21% vs last week' },
  { id: 'followups', label: 'Follow-ups created', value: '11', deltaText: '+5% vs last week' },
];

const automationTrend: AutomationPoint[] = [
  { label: 'Mon', value: 28 },
  { label: 'Tue', value: 42 },
  { label: 'Wed', value: 36 },
  { label: 'Thu', value: 51 },
  { label: 'Fri', value: 48 },
  { label: 'Sat', value: 22 },
  { label: 'Sun', value: 30 },
];

const categoryStats: CategoryStat[] = [
  { name: 'To respond', count: 124, percentage: 42 },
  { name: 'Awaiting reply', count: 63, percentage: 21 },
  { name: 'Actioned', count: 52, percentage: 18 },
  { name: 'Marketing', count: 32, percentage: 11 },
  { name: 'FYI', count: 23, percentage: 8 },
];

const quickActions = [
  {
    title: 'Connect another account',
    description: 'Bring in Yahoo, Outlook or any IMAP inbox.',
    cta: 'Connect',
    icon: '🔗',
    onClick: () => console.log('TODO: connect another account'),
  },
  {
    title: 'Adjust categories',
    description: 'Tune how FlowMail sorts your messages.',
    cta: 'Edit',
    icon: '🗂️',
    onClick: () => console.log('TODO: adjust categories'),
  },
  {
    title: 'Review draft prompt',
    description: 'Improve AI tone and messaging guidance.',
    cta: 'Review',
    icon: '✍️',
    onClick: () => console.log('TODO: review draft prompt'),
  },
  {
    title: 'Check integrations',
    description: 'Confirm CRM and calendar automations.',
    cta: 'View',
    icon: '⚙️',
    onClick: () => console.log('TODO: check integrations'),
  },
];

const MetricCard: FC<{ metric: Metric }> = ({ metric }) => (
  <div className="rounded-[28px] border border-white/70 bg-white/90 p-5 shadow-[0_25px_50px_rgba(15,23,42,0.08)] backdrop-blur">
    <p className="text-sm font-medium text-slate-500">{metric.label}</p>
    <p className="mt-3 text-3xl font-semibold text-slate-900">{metric.value}</p>
    <p className="mt-2 text-xs font-semibold text-emerald-500">{metric.deltaText}</p>
  </div>
);

const QuickActionTile: FC<(typeof quickActions)[number]> = ({ title, description, cta, icon, onClick }) => (
  <div className="flex flex-col rounded-[28px] border border-white/70 bg-white/90 p-5 shadow-[0_25px_60px_rgba(15,23,42,0.08)]">
    <div className="flex items-center gap-3">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-100 via-indigo-50 to-violet-100 text-xl">
        {icon}
      </div>
      <div>
        <p className="text-base font-semibold text-slate-900">{title}</p>
        <p className="text-sm text-slate-500">{description}</p>
      </div>
    </div>
    <div className="mt-4">
      <button
        onClick={onClick}
        className="inline-flex items-center justify-center rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-900 hover:text-slate-900"
      >
        {cta}
      </button>
    </div>
  </div>
);

export const DashboardView: FC = () => {
  const maxTrendValue = Math.max(...automationTrend.map((point) => point.value));

  return (
    <div className="space-y-10 text-slate-800">
      <section className="rounded-[32px] border border-white/70 bg-gradient-to-br from-white via-slate-50 to-[#e4f3ff] p-8 shadow-[0_35px_90px_rgba(15,23,42,0.15)]">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-sky-500">Dashboard</p>
            <h1 className="mt-2 text-3xl font-semibold leading-tight text-slate-900 md:text-4xl">Welcome back, Kevin</h1>
            <p className="mt-2 text-base text-slate-500">Gmail connected · Calendar not connected</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-sky-500 via-indigo-500 to-violet-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30">
              Continue setup
            </button>
            <button className="inline-flex items-center justify-center rounded-full border border-white/70 bg-white/70 px-6 py-3 text-sm font-semibold text-slate-700 shadow-sm">
              View all settings
            </button>
          </div>
        </div>
      </section>

      <section>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {metrics.map((metric) => (
            <MetricCard key={metric.id} metric={metric} />
          ))}
        </div>
      </section>

      <div className="grid gap-8 lg:grid-cols-[2fr,1fr]">
        <div className="space-y-8">
          <section className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-[32px] border border-white/70 bg-white/90 p-6 shadow-[0_30px_60px_rgba(15,23,42,0.1)]">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-500">Automation activity</p>
                  <p className="text-lg font-semibold text-slate-900">Last 7 days</p>
                </div>
                <span className="text-xs text-emerald-500">Live</span>
              </div>
              <div className="mt-6 h-36">
                <div className="flex h-full items-end gap-3">
                  {automationTrend.map((point) => (
                    <div key={point.label} className="flex w-full flex-col items-center gap-2">
                      <div
                        className="w-full rounded-t-[20px] bg-gradient-to-t from-sky-200 to-sky-500"
                        style={{ height: `${(point.value / maxTrendValue) * 100}%` }}
                      ></div>
                      <span className="text-xs text-slate-500">{point.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="rounded-[32px] border border-white/70 bg-white/90 p-6 shadow-[0_30px_60px_rgba(15,23,42,0.1)]">
              <p className="text-sm font-semibold text-slate-500">Category breakdown</p>
              <p className="text-lg font-semibold text-slate-900">Where FlowMail filed things</p>
              <div className="mt-6 space-y-4">
                {categoryStats.map((category) => (
                  <div key={category.name}>
                    <div className="flex items-center justify-between text-sm text-slate-600">
                      <span>{category.name}</span>
                      <span>{category.count}</span>
                    </div>
                    <div className="mt-2 h-2 rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-sky-400 via-indigo-400 to-violet-400"
                        style={{ width: `${category.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="rounded-[32px] border border-white/70 bg-white/90 p-6 shadow-[0_30px_70px_rgba(15,23,42,0.12)]">
            <p className="text-sm font-semibold text-slate-500">What FlowMail did for you this week</p>
            <p className="mt-3 text-4xl font-semibold text-slate-900">This week FlowMail saved you 2h 18m</p>
            <ul className="mt-6 space-y-2 text-slate-600">
              <li>• 318 emails analysed</li>
              <li>• 27 draft replies generated</li>
              <li>• 15 follow-ups created</li>
            </ul>
            <p className="mt-4 text-xs text-slate-400">* Based on estimated automations and time saved.</p>
          </section>
        </div>

        <section className="rounded-[32px] border border-white/70 bg-white/90 p-6 shadow-[0_35px_80px_rgba(15,23,42,0.12)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-500">Quick actions</p>
              <p className="text-xl font-semibold text-slate-900">Keep FlowMail tuned</p>
            </div>
            <span className="text-xs text-slate-400">4 suggestions</span>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            {quickActions.map((action) => (
              <QuickActionTile key={action.title} {...action} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};
