import { Clock3, Coins, Mail, TrendingUp } from 'lucide-react';
import Card from '../components/ui/Card';

type MetricCard = {
  id: 'emails' | 'time' | 'cost';
  icon: typeof Mail;
  title: string;
  value: string;
  subtitle: string;
  footerLabel: string;
  footerValue: string;
};

const metrics: MetricCard[] = [
  {
    id: 'emails',
    icon: Mail,
    title: 'Emails Processed',
    value: '1,284',
    subtitle: '19% vs previous period',
    footerLabel: 'Weekly trend',
    footerValue: 'Steady increase'
  },
  {
    id: 'time',
    icon: Clock3,
    title: 'Time Saved',
    value: '26h 15m',
    subtitle: 'Saved time this week',
    footerLabel: 'Efficiency boost',
    footerValue: '4h 30m'
  },
  {
    id: 'cost',
    icon: Coins,
    title: 'Cost Saved',
    value: '£1,975',
    subtitle: 'Estimated savings',
    footerLabel: 'Savings rate',
    footerValue: '£75 / hour'
  }
];

const Dashboard = () => {
  return (
    <section aria-label="Dashboard main content" className="space-y-6 lg:space-y-8">
      <div className="flex justify-center">
        <button
          type="button"
          className="chip-surface theme-text-secondary rounded-full border px-4 py-2 text-sm font-semibold shadow-sm transition hover:brightness-105"
        >
          Selected Period: Last 7 Days ▾
        </button>
      </div>

      <div className="grid gap-4 lg:grid-cols-3 lg:gap-6">
        {metrics.map((metric) => {
          const Icon = metric.icon;

          return (
            <Card key={metric.id} className="space-y-5 p-5 lg:p-6">
              <div className="flex justify-center">
                <span className="rounded-2xl border border-[var(--outline-border)] bg-[var(--soft-bg)] p-3">
                  <Icon className="h-8 w-8 text-[var(--accent)]" strokeWidth={2.1} />
                </span>
              </div>

              <div className="space-y-3 text-center">
                <h2 className="theme-text-primary text-xl font-semibold">{metric.title}</h2>
                <div className="border-t border-[var(--table-divider)]" />
                <p className="theme-text-primary text-4xl font-semibold tracking-tight lg:text-5xl">
                  {metric.value}
                </p>
                <p className="theme-text-secondary flex items-center justify-center gap-1.5 text-sm">
                  {metric.id === 'emails' ? (
                    <TrendingUp className="h-4 w-4 text-emerald-500" />
                  ) : null}
                  <span>{metric.subtitle}</span>
                </p>
              </div>

              <div className="border-t border-[var(--table-divider)] pt-4">
                {metric.id === 'emails' ? (
                  <svg
                    aria-hidden="true"
                    className="h-14 w-full text-[var(--accent)]"
                    viewBox="0 0 260 70"
                    fill="none"
                  >
                    <path
                      d="M3 56C18 58 24 46 39 44C54 42 58 60 74 55C90 50 100 30 116 35C132 40 136 54 150 48C164 42 166 26 179 27C192 28 195 40 209 33C223 26 240 32 257 18"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                    <path d="M3 66H257" stroke="currentColor" strokeWidth="1.25" opacity="0.35" />
                  </svg>
                ) : null}

                <div className="theme-text-secondary flex items-center justify-between text-sm">
                  <span>{metric.footerLabel}</span>
                  <span className="theme-text-primary font-semibold">{metric.footerValue}</span>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </section>
  );
};

export default Dashboard;
