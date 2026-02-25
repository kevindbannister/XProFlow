import { Clock3, Mail, PoundSterling, TrendingUp } from 'lucide-react';

type DashboardCard = {
  title: string;
  value: string;
  subtitle: string;
  detail: string;
  icon: typeof Mail;
};

const dashboardCards: DashboardCard[] = [
  {
    title: 'Emails Processed',
    value: '1,284',
    subtitle: '↑ 19% vs previous period',
    detail: 'Steady throughput across all inbox workflows',
    icon: Mail,
  },
  {
    title: 'Time Saved',
    value: '26h 15m',
    subtitle: 'Saved time this week',
    detail: 'Efficiency boost of 4h 30m since last period',
    icon: Clock3,
  },
  {
    title: 'Cost Saved',
    value: '£1,975',
    subtitle: 'Estimated savings',
    detail: 'Savings rate £75 / hour from automation',
    icon: PoundSterling,
  },
];

const Dashboard = () => {
  return (
    <section
      aria-label="Dashboard main content"
      className="relative -mx-6 -mb-6 -mt-2 min-h-[calc(100vh-9rem)] overflow-hidden px-6 pb-10 pt-4"
    >
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/FlowBackground.svg')" }}
        aria-hidden
      />
      <div
        className="absolute inset-0 bg-gradient-to-b from-slate-900/55 via-indigo-950/50 to-slate-950/70"
        aria-hidden
      />

      <div className="relative z-10 space-y-8">
        <div className="inline-flex items-center rounded-full border border-indigo-200/40 bg-white/20 px-4 py-2 text-xs font-medium text-slate-100 shadow-[0_8px_25px_rgba(76,29,149,0.35)] backdrop-blur-xl">
          Selected Period: Last 7 Days
        </div>

        <div className="grid gap-5 xl:grid-cols-3">
          {dashboardCards.map((card) => {
            const Icon = card.icon;

            return (
              <article
                key={card.title}
                className="group rounded-2xl border border-white/30 bg-white/12 p-5 text-slate-50 shadow-[0_22px_40px_rgba(15,23,42,0.35)] backdrop-blur-2xl transition hover:-translate-y-0.5 hover:border-fuchsia-300/45 hover:shadow-[0_30px_50px_rgba(109,40,217,0.35)]"
              >
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-indigo-200/50 bg-gradient-to-br from-cyan-400 via-indigo-500 to-fuchsia-500 text-white shadow-[0_12px_26px_rgba(79,70,229,0.4)]">
                  <Icon className="h-7 w-7" />
                </div>

                <h2 className="text-2xl font-semibold tracking-tight text-slate-50">{card.title}</h2>

                <div className="my-4 h-px bg-gradient-to-r from-sky-200/70 via-indigo-300/35 to-transparent" />

                <p className="text-5xl font-semibold leading-none text-white">{card.value}</p>
                <p className="mt-3 text-sm font-medium text-cyan-100">{card.subtitle}</p>

                <div className="my-5 h-px bg-gradient-to-r from-sky-200/70 via-indigo-300/35 to-transparent" />

                <div className="flex items-start gap-2 text-sm text-indigo-100/95">
                  <TrendingUp className="mt-0.5 h-4 w-4 shrink-0 text-cyan-200" />
                  <p>{card.detail}</p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
