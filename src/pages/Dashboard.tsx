import { Clock, Mail, PoundSterling, X } from 'lucide-react';
import { useState } from 'react';
import StatChip from '../components/dashboard/StatChip';
import Card from '../components/ui/Card';
import { xProFlowBlue, xProFlowBlueChart } from '../lib/designTokens';

type KpiCardProps = {
  value: string;
  label: string;
  icon: JSX.Element;
};

const KpiCard = ({ value, label, icon }: KpiCardProps) => {
  return (
    <Card className="flex items-center gap-4 p-4">
      <div
        className={`${xProFlowBlue.iconBadge} ${xProFlowBlue.iconBadgeBorder} flex h-10 w-10 items-center justify-center rounded-xl`}
      >
        {icon}
      </div>
      <div>
        <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">{value}</p>
        <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
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
      <div className="flex items-center gap-2">
        <span className={`h-2 w-2 rounded-full ${xProFlowBlue.chartDot}`} />
        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{title}</p>
      </div>
      <div>
        <p className="text-2xl font-semibold text-slate-900 dark:text-slate-100">{value}</p>
        <p className="text-xs text-slate-500 dark:text-slate-400">{description}</p>
      </div>
    </Card>
  );
};

const Dashboard = () => {
  const [showToneCard, setShowToneCard] = useState(() => {
    if (typeof window === 'undefined') {
      return true;
    }
    return localStorage.getItem('showToneCard') !== 'false';
  });
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
    { label: 'Awaiting Response', value: 45, color: xProFlowBlueChart.primary },
    { label: 'FYI', value: 33, color: xProFlowBlueChart.secondary },
    { label: 'Marketing', value: 17, color: xProFlowBlueChart.tertiary }
  ];

  const donutRadius = 56;
  const donutStroke = 12;
  const donutCircumference = 2 * Math.PI * donutRadius;
  const donutTotal = emailMakeup.reduce((sum, item) => sum + item.value, 0);
  let donutOffset = 0;

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <StatChip label="1 week" />
          <StatChip label="167 words" />
          <StatChip label="89 WPM" />
        </div>
      </div>

      {showToneCard ? (
        <Card className="border-amber-200 bg-[#fff7db] dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-col gap-3">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                Make XProFlow sound like you
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Onboard your writing samples to teach XProFlow your tone, phrasing, and style
                preferences so every response sounds authentically yours.
              </p>
              <div>
                <button
                  className={`rounded-full bg-sky-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-700 ${xProFlowBlue.focusRing}`}
                >
                  Start now
                </button>
              </div>
            </div>
            <button
              className="flex h-8 w-8 items-center justify-center rounded-full text-slate-500 transition hover:bg-white/70 hover:text-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-100"
              aria-label="Dismiss tone setup card"
              onClick={() => {
                setShowToneCard(false);
                localStorage.setItem('showToneCard', 'false');
              }}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </Card>
      ) : null}

      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          Performance Summary
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {kpiStats.map((stat) => (
            <KpiCard key={stat.label} value={stat.value} label={stat.label} icon={stat.icon} />
          ))}
        </div>
      </div>

      <Card className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            Your Email Makeup
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
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
                  strokeWidth={donutStroke}
                  className="stroke-slate-200 dark:stroke-slate-700"
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
                    <span className="text-slate-600 dark:text-slate-300">{slice.label}</span>
                  </div>
                  <span className="font-semibold text-slate-900 dark:text-slate-100">
                    {slice.value}%
                  </span>
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

    </section>
  );
};

export default Dashboard;
