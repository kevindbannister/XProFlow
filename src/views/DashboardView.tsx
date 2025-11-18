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
  <div className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-lg shadow-indigo-900/20 backdrop-blur">
    <p className="text-sm font-medium text-white/70">{metric.label}</p>
    <p className="mt-3 text-3xl font-semibold text-white">{metric.value}</p>
    <p className="mt-2 text-xs font-medium text-emerald-300">{metric.deltaText}</p>
  </div>
);

const QuickActionTile: FC<(typeof quickActions)[number]> = ({ title, description, cta, icon, onClick }) => (
  <div className="flex flex-col rounded-2xl border border-white/10 bg-white/5 p-5 shadow-lg shadow-indigo-900/20 backdrop-blur">
    <div className="flex items-center gap-3">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-xl">{icon}</div>
      <div>
        <p className="text-base font-semibold text-white">{title}</p>
        <p className="text-sm text-white/70">{description}</p>
      </div>
    </div>
    <div className="mt-4">
      <button
        onClick={onClick}
        className="inline-flex items-center justify-center rounded-full border border-white/30 px-4 py-2 text-sm font-semibold text-white transition hover:border-white/60"
      >
        {cta}
      </button>
    </div>
  </div>
);

export const DashboardView: FC = () => {
  const maxTrendValue = Math.max(...automationTrend.map((point) => point.value));

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 text-white">
      <div className="space-y-10">
        <section className="rounded-3xl border border-white/10 bg-gradient-to-r from-slate-900/80 via-indigo-900/70 to-purple-900/70 p-8 shadow-2xl shadow-indigo-900/30">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-wide text-emerald-300/80">Dashboard</p>
              <h1 className="mt-2 text-3xl font-semibold leading-tight text-white md:text-4xl">Welcome back, Kevin</h1>
              <p className="mt-2 text-base text-white/80">Gmail connected · Calendar not connected</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-violet-500 via-purple-500 to-blue-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-500/40">
                Continue setup
              </button>
              <button className="inline-flex items-center justify-center rounded-full border border-white/30 px-6 py-3 text-sm font-semibold text-white/90 transition hover:border-white/60">
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
              <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl shadow-indigo-900/20">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-semibold text-white/70">Automation activity</p>
                    <p className="text-lg font-semibold text-white">Last 7 days</p>
                  </div>
                  <span className="text-xs text-white/60">Live</span>
                </div>
                <div className="mt-6 h-36">
                  <div className="flex h-full items-end gap-3">
                    {automationTrend.map((point) => (
                      <div key={point.label} className="flex w-full flex-col items-center gap-2">
                        <div
                          className="w-full rounded-t-full bg-gradient-to-t from-emerald-400/40 to-emerald-300"
                          style={{ height: `${(point.value / maxTrendValue) * 100}%` }}
                        ></div>
                        <span className="text-xs text-white/60">{point.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl shadow-indigo-900/20">
                <p className="text-sm font-semibold text-white/70">Category breakdown</p>
                <p className="text-lg font-semibold text-white">Where FlowMail filed things</p>
                <div className="mt-6 space-y-4">
                  {categoryStats.map((category) => (
                    <div key={category.name}>
                      <div className="flex items-center justify-between text-sm text-white/80">
                        <span>{category.name}</span>
                        <span>{category.count}</span>
                      </div>
                      <div className="mt-2 h-2 rounded-full bg-white/10">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-sky-500 to-indigo-500"
                          style={{ width: `${category.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl shadow-indigo-900/20">
              <p className="text-sm font-semibold text-white/70">What FlowMail did for you this week</p>
              <p className="mt-3 text-4xl font-semibold text-white">This week FlowMail saved you 2h 18m</p>
              <ul className="mt-6 space-y-2 text-white/80">
                <li>• 318 emails analysed</li>
                <li>• 27 draft replies generated</li>
                <li>• 15 follow-ups created</li>
              </ul>
              <p className="mt-4 text-xs text-white/60">* Based on estimated automations and time saved.</p>
            </section>
          </div>

          <section className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl shadow-indigo-900/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-white/70">Quick actions</p>
                <p className="text-xl font-semibold text-white">Keep FlowMail tuned</p>
              </div>
              <span className="text-xs text-white/50">4 suggestions</span>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              {quickActions.map((action) => (
                <QuickActionTile key={action.title} {...action} />
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
