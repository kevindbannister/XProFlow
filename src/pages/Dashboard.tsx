import { Clock, Mail, PoundSterling } from 'lucide-react';
import ActivityFeed from '../components/dashboard/ActivityFeed';
import StatChip from '../components/dashboard/StatChip';
import Card from '../components/ui/Card';

type KpiCardProps = {
  value: string;
  label: string;
  icon: JSX.Element;
};

const KpiCard = ({ value, label, icon }: KpiCardProps) => {
  return (
    <Card className="flex items-center gap-4 p-4">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
        {icon}
      </div>
      <div>
        <p className="text-lg font-semibold text-slate-900">{value}</p>
        <p className="text-xs text-slate-500">{label}</p>
      </div>
    </Card>
  );
};

type MetricCardProps = {
  title: string;
  value: string;
  description: string;
};

const MetricCard = ({ title, value, description }: MetricCardProps) => {
  return (
    <Card className="space-y-2 p-4">
      <p className="text-sm font-semibold text-slate-900">{title}</p>
      <div>
        <p className="text-2xl font-semibold text-slate-900">{value}</p>
        <p className="text-xs text-slate-500">{description}</p>
      </div>
    </Card>
  );
};

const Dashboard = () => {
  const activityItems = [
    { time: '01:11 PM', text: 'You are working in the XProFlow frontend.' },
    { time: '01:24 PM', text: 'Follow /codex/WORKING_RULES.md.' },
    { time: '01:32 PM', text: 'Implement ONLY the task below.' },
    { time: '01:45 PM', text: 'Keep edits minimal.' },
    { time: '02:02 PM', text: 'Output only changed files.' }
  ];

  const kpiStats = [
    {
      value: '1,284',
      label: 'Emails processed',
      icon: <Mail className="h-4 w-4" />
    },
    {
      value: '14h 32m',
      label: 'Time saved',
      icon: <Clock className="h-4 w-4" />
    },
    {
      value: '£1,284',
      label: 'Cost saved',
      icon: <PoundSterling className="h-4 w-4" />
    }
  ];

  const emailMakeup = [
    { label: 'Awaiting Response', value: 45, color: '#64748B' },
    { label: 'FYI', value: 33, color: '#94A3B8' },
    { label: 'Marketing', value: 17, color: '#CBD5E1' }
  ];

  const donutRadius = 56;
  const donutStroke = 12;
  const donutCircumference = 2 * Math.PI * donutRadius;
  const donutTotal = emailMakeup.reduce((sum, item) => sum + item.value, 0);
  let donutOffset = 0;

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold text-slate-900">Welcome back, Kev</h1>
        <div className="flex flex-wrap items-center gap-2">
          <StatChip label="1 week" />
          <StatChip label="167 words" />
          <StatChip label="89 WPM" />
        </div>
      </div>

      <Card className="border-amber-200 bg-[#fff7db]">
        <div className="flex flex-col gap-3">
          <h2 className="text-lg font-semibold text-slate-900">Make XProFlow sound like you</h2>
          <p className="text-sm text-slate-600">
            Onboard your writing samples to teach XProFlow your tone, phrasing, and style
            preferences so every response sounds authentically yours.
          </p>
          <div>
            <button className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white">
              Start now
            </button>
          </div>
        </div>
      </Card>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-slate-900">Performance Summary</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {kpiStats.map((stat) => (
            <KpiCard key={stat.label} value={stat.value} label={stat.label} icon={stat.icon} />
          ))}
        </div>
      </div>

      <Card className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Your Email Makeup</h2>
          <p className="mt-1 text-sm text-slate-500">
            Breakdown of emails received in the last 30 days
          </p>
        </div>
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_240px]">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            <div className="flex h-40 w-40 items-center justify-center">
              <svg width="160" height="160" viewBox="0 0 160 160" className="overflow-visible">
                <circle
                  cx="80"
                  cy="80"
                  r={donutRadius}
                  fill="none"
                  stroke="#E2E8F0"
                  strokeWidth={donutStroke}
                />
                {emailMakeup.map((slice) => {
                  const sliceLength = (slice.value / donutTotal) * donutCircumference;
                  const dashArray = `${sliceLength} ${donutCircumference - sliceLength}`;
                  const dashOffset = -(donutOffset / donutTotal) * donutCircumference;
                  donutOffset += slice.value;
                  return (
                    <circle
                      key={slice.label}
                      cx="80"
                      cy="80"
                      r={donutRadius}
                      fill="none"
                      stroke={slice.color}
                      strokeWidth={donutStroke}
                      strokeDasharray={dashArray}
                      strokeDashoffset={dashOffset}
                      strokeLinecap="round"
                      transform="rotate(-90 80 80)"
                    />
                  );
                })}
              </svg>
            </div>
            <div className="space-y-3">
              {emailMakeup.map((slice) => (
                <div key={slice.label} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: slice.color }}
                    />
                    <span className="text-slate-600">{slice.label}</span>
                  </div>
                  <span className="font-semibold text-slate-900">{slice.value}%</span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <MetricCard
              title="Writes Like You"
              value="87%"
              description="Emails drafted in your tone"
            />
            <MetricCard title="Sent Emails" value="462" description="Total emails sent" />
          </div>
        </div>
      </Card>

      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-slate-900">Today</h3>
        <ActivityFeed items={activityItems} />
      </div>
    </section>
  );
};

export default Dashboard;
