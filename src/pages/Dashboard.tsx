import { Clock, Mail, PoundSterling, X } from 'lucide-react';
import { useState } from 'react';
import PageContainer from '../components/layout/PageContainer';
import Card from '../components/ui/Card';
import { xProFlowAccents, xProFlowBlue } from '../lib/designTokens';

type KpiCardProps = {
  value: string;
  label: string;
  icon: JSX.Element;
  accent?: {
    iconBadge: string;
    iconBadgeBorder: string;
  };
};

const KpiCard = ({ value, label, icon, accent = xProFlowAccents.blue }: KpiCardProps) => {
  return (
    <Card className="flex items-center gap-4 p-4">
      <div
        className={`${accent.iconBadge} ${accent.iconBadgeBorder} flex h-10 w-10 items-center justify-center rounded-xl`}
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
  accent?: {
    chartDot: string;
  };
};

const MetricCard = ({ title, value, description, accent = xProFlowAccents.blue }: MetricCardProps) => {
  return (
    <Card className="space-y-2 p-4">
      <div className="flex items-center gap-2">
        <span className={`h-2 w-2 rounded-full ${accent.chartDot}`} />
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
      icon: <Mail className="h-4 w-4" />,
      accent: xProFlowAccents.blue
    },
    {
      value: '14h 32m',
      label: 'Time saved',
      icon: <Clock className="h-4 w-4" />,
      accent: xProFlowAccents.teal
    },
    {
      value: '£1,284',
      label: 'Cost saved',
      icon: <PoundSterling className="h-4 w-4" />,
      accent: xProFlowAccents.amber
    }
  ];

  const emailMakeup = [
    { label: 'Awaiting Response', value: 45, color: xProFlowAccents.teal.chart },
    { label: 'FYI', value: 33, color: xProFlowAccents.amber.chart },
    { label: 'Marketing', value: 17, color: xProFlowAccents.violet.chart }
  ];

  const donutRadius = 56;
  const donutStroke = 12;
  const donutCircumference = 2 * Math.PI * donutRadius;
  const donutTotal = emailMakeup.reduce((sum, item) => sum + item.value, 0);
  let donutOffset = 0;

  return (
    <PageContainer>
      {showToneCard ? (
        <Card className="card-callout">
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
            <KpiCard
              key={stat.label}
              value={stat.value}
              label={stat.label}
              icon={stat.icon}
              accent={stat.accent}
            />
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
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.7fr)_minmax(0,0.6fr)]">
          <div className="flex items-center justify-center">
            <div className="flex h-44 w-44 items-center justify-center">
              <svg width="176" height="176" viewBox="0 0 160 160" className="overflow-visible">
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
          </div>
          <div className="space-y-4">
            {emailMakeup.map((slice) => (
              <div
                key={slice.label}
                className="flex items-center justify-between rounded-2xl border border-slate-200/70 bg-white/70 px-3 py-2 text-sm shadow-sm dark:border-slate-800 dark:bg-slate-900/70"
              >
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

    </PageContainer>
  );
};

export default Dashboard;
