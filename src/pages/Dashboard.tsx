import { ChevronDown, Clock3, Coins, Mail, PoundSterling, TrendingUp } from 'lucide-react';
import Card from '../components/ui/Card';

type MetricCard = {
  id: 'emails' | 'time' | 'cost';
  icon: typeof Mail;
  title: string;
  value: string;
  subtitle: string;
  footerPrefix?: string;
  footerHighlight?: string;
};

const metrics: MetricCard[] = [
  {
    id: 'emails',
    icon: Mail,
    title: 'Emails Processed',
    value: '1,284',
    subtitle: '18% vs previous period'
  },
  {
    id: 'time',
    icon: Clock3,
    title: 'Time Saved',
    value: '26h 15m',
    subtitle: 'Saved time this week',
    footerPrefix: 'Efficiency Boost',
    footerHighlight: '+4h 30m'
  },
  {
    id: 'cost',
    icon: PoundSterling,
    title: 'Cost Saved',
    value: '£1,975',
    subtitle: 'Estimated savings',
    footerPrefix: 'Savings Rate',
    footerHighlight: '£75 / hour'
  }
];

const Dashboard = () => {
  return (
    <section aria-label="Dashboard main content" className="space-y-8 lg:space-y-10">
      <div className="flex justify-center">
        <button
          type="button"
          className="inline-flex items-center gap-1 rounded-full border border-[var(--outline-border)] bg-[var(--outline-bg)] px-4 py-1.5 text-sm font-medium text-[var(--text-muted)]"
        >
          <span>Selected Period: Last 7 Days</span>
          <ChevronDown className="h-4 w-4" />
        </button>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {metrics.map((metric) => {
          const Icon = metric.icon;

          return (
            <Card
              key={metric.id}
              className="space-y-4 rounded-lg border border-slate-200/80 bg-white/80 p-5 shadow-[0_10px_30px_rgba(148,163,184,0.2)]"
            >
              <div className="flex justify-center">
                <Icon className="h-12 w-12 text-[#60a5fa]" strokeWidth={1.8} />
              </div>

              <div className="space-y-3 text-center">
                <h2 className="text-2xl font-semibold leading-tight text-[var(--text-secondary)]">
                  {metric.title}
                </h2>
                <div className="border-t border-[var(--table-divider)]" />
                <p className="text-5xl font-semibold leading-none tracking-tight text-[#5b667a] lg:text-6xl">
                  {metric.value}
                </p>
                <p className="flex items-center justify-center gap-1.5 text-xl text-[var(--text-muted)]">
                  {metric.id === 'emails' ? <TrendingUp className="h-4 w-4 text-emerald-500" /> : null}
                  <span>{metric.subtitle}</span>
                </p>
              </div>

              <div className="border-t border-[var(--table-divider)] pt-4">
                {metric.id === 'emails' ? (
                  <svg
                    aria-hidden="true"
                    className="mb-2 h-14 w-full text-[#3b82f6]"
                    viewBox="0 0 260 70"
                    fill="none"
                  >
                    <defs>
                      <linearGradient id="emailBars" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="currentColor" stopOpacity="0.22" />
                        <stop offset="100%" stopColor="currentColor" stopOpacity="0.04" />
                      </linearGradient>
                    </defs>
                    <path d="M3 66H257" stroke="currentColor" strokeWidth="1.25" opacity="0.35" />
                    <rect x="14" y="46" width="18" height="20" fill="url(#emailBars)" rx="3" />
                    <rect x="38" y="41" width="18" height="25" fill="url(#emailBars)" rx="3" />
                    <rect x="62" y="37" width="18" height="29" fill="url(#emailBars)" rx="3" />
                    <rect x="86" y="45" width="18" height="21" fill="url(#emailBars)" rx="3" />
                    <rect x="110" y="39" width="18" height="27" fill="url(#emailBars)" rx="3" />
                    <rect x="134" y="35" width="18" height="31" fill="url(#emailBars)" rx="3" />
                    <rect x="158" y="42" width="18" height="24" fill="url(#emailBars)" rx="3" />
                    <rect x="182" y="31" width="18" height="35" fill="url(#emailBars)" rx="3" />
                    <rect x="206" y="33" width="18" height="33" fill="url(#emailBars)" rx="3" />
                    <path
                      d="M3 53C18 54 24 43 39 41C54 39 58 57 74 52C90 47 100 27 116 32C132 37 136 51 150 45C164 39 166 23 179 24C192 25 195 37 209 30C223 23 240 29 257 15"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                  </svg>
                ) : (
                  <div className="flex items-center gap-2 text-lg text-[var(--text-secondary)]">
                    {metric.id === 'time' ? (
                      <Clock3 className="h-6 w-6 shrink-0 text-[var(--text-muted)]" />
                    ) : (
                      <Coins className="h-6 w-6 shrink-0 text-[var(--text-muted)]" />
                    )}
                    <span>{metric.footerPrefix}</span>
                    <span className="font-semibold text-emerald-500">{metric.footerHighlight}</span>
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      <p className="pt-2 text-center text-2xl text-[var(--text-secondary)] lg:text-4xl">
        Since joining XProFlow you've saved <span className="font-bold">184 hours</span> and{' '}
        <span className="font-bold text-emerald-500">£12,880.</span>
      </p>
    </section>
  );
};

export default Dashboard;
