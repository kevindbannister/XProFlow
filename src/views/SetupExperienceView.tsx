import { FC, useMemo, useState } from 'react';

type SetupExperienceViewProps = {
  connectedProvider: string | null;
  onConnectProvider: (provider: string) => void;
  onFinish: () => void;
  onBackToDashboard: () => void;
};

type EmailAssumptions = {
  averageReadSeconds: number;
  averageResponseMinutes: number;
  responseRate: number;
  periodMonths: number;
};

const EMAIL_ASSUMPTIONS: EmailAssumptions = {
  averageReadSeconds: 45,
  averageResponseMinutes: 2.5,
  responseRate: 0.35,
  periodMonths: 12,
};

const formatNumber = (value: number) => new Intl.NumberFormat('en-GB').format(Math.round(value));
const formatHours = (value: number) => `${value.toFixed(1)}h`;

export const SetupExperienceView: FC<SetupExperienceViewProps> = ({
  connectedProvider,
  onConnectProvider,
  onFinish,
  onBackToDashboard,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const isInboxConnected = Boolean(connectedProvider);
  const assumptions = EMAIL_ASSUMPTIONS;
  const estimatedEmailVolume = 12480;

  const estimatedHistory = useMemo(() => {
    const totalEmails = estimatedEmailVolume;
    const readHours = (totalEmails * assumptions.averageReadSeconds) / 3600;
    const responseHours = (totalEmails * assumptions.responseRate * assumptions.averageResponseMinutes) / 60;
    const totalHours = readHours + responseHours;
    return {
      totalEmails,
      readHours,
      responseHours,
      totalHours,
    };
  }, [assumptions, estimatedEmailVolume]);

  const steps = [
    {
      id: 'intro',
      eyebrow: 'Step 1',
      label: 'Intro',
      title: 'Your inbox isn’t disorganised. It’s unmeasured.',
      description:
        'Email creates hidden time and cost that rarely make it into planning. Flowiee makes that impact visible so you can control it with confidence.',
      content: (
        <div className="space-y-6">
          <div className="relative flex aspect-video items-center justify-center overflow-hidden rounded-[24px] bg-gradient-to-br from-slate-100 via-white to-sky-100 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">
            <div className="absolute inset-0 opacity-60 mix-blend-multiply dark:opacity-40">
              <div className="absolute left-6 top-6 h-16 w-28 rounded-2xl bg-white/70 dark:bg-slate-800/70" />
              <div className="absolute bottom-6 right-6 h-12 w-20 rounded-2xl bg-white/70 dark:bg-slate-800/70" />
            </div>
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/90 text-3xl text-slate-700 shadow-md dark:bg-slate-950/80 dark:text-slate-200">
              ▶
            </div>
          </div>
          <div className="rounded-[22px] border border-slate-200/70 bg-slate-50/80 p-5 text-sm text-slate-500 dark:border-slate-800/70 dark:bg-slate-950/60 dark:text-slate-300">
            Expect a short guided setup: connect your inbox, review the impact estimates, and decide how you want Flowiee to help.
          </div>
        </div>
      ),
    },
    {
      id: 'connect',
      eyebrow: 'Step 2',
      label: 'Connect inbox',
      title: 'Connect your inbox to reveal the last 12 months.',
      description:
        'Bring in Gmail or Outlook so we can estimate volume, time, and the cost of staying on top of email.',
      content: (
        <div className="space-y-5">
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => onConnectProvider('Gmail')}
              className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-900 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-slate-200 dark:hover:text-white"
            >
              Connect Gmail
            </button>
            <button
              type="button"
              onClick={() => onConnectProvider('Outlook')}
              className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-900 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-slate-200 dark:hover:text-white"
            >
              Connect Outlook
            </button>
          </div>
          {isInboxConnected ? (
            <div className="rounded-2xl border border-emerald-200/60 bg-emerald-50/80 p-4 text-sm text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-200">
              Connected to {connectedProvider}. Reviewing the last {assumptions.periodMonths} months now.
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-200/70 bg-slate-50/80 p-4 text-sm text-slate-500 dark:border-slate-800/70 dark:bg-slate-950/40 dark:text-slate-400">
              No inbox connected yet. You can still proceed and connect later.
            </div>
          )}
        </div>
      ),
    },
    {
      id: 'impact',
      eyebrow: 'Step 3',
      label: 'Measure impact',
      title: 'Your email footprint, summarised.',
      description: `Based on the last ${assumptions.periodMonths} months, here is the time your inbox demands.`,
      content: (
        <div className="space-y-5">
          {isInboxConnected ? (
            <>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-200/60 bg-slate-50/80 p-4 dark:border-slate-800/70 dark:bg-slate-950/40">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Emails received</p>
                  <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">
                    {formatNumber(estimatedHistory.totalEmails)}
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-200/60 bg-slate-50/80 p-4 dark:border-slate-800/70 dark:bg-slate-950/40">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Reading time</p>
                  <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">
                    {formatHours(estimatedHistory.readHours)}
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-200/60 bg-slate-50/80 p-4 dark:border-slate-800/70 dark:bg-slate-950/40">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Response time</p>
                  <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">
                    {formatHours(estimatedHistory.responseHours)}
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-200/60 bg-slate-50/80 p-4 dark:border-slate-800/70 dark:bg-slate-950/40">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Total time on email</p>
                  <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">
                    {formatHours(estimatedHistory.totalHours)}
                  </p>
                </div>
              </div>
              <p className="text-xs text-slate-400">
                Assumptions: {assumptions.averageReadSeconds}s average read time, {assumptions.averageResponseMinutes}{' '}
                minutes average response time, {Math.round(assumptions.responseRate * 100)}% of emails require a response.
              </p>
            </>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-200/70 bg-slate-50/80 p-6 text-sm text-slate-500 dark:border-slate-800/70 dark:bg-slate-950/40 dark:text-slate-400">
              Connect an inbox to see a personalised impact snapshot here.
            </div>
          )}
        </div>
      ),
    },
    {
      id: 'control',
      eyebrow: 'Step 4',
      label: 'Control panel',
      title: 'Decide how Flowiee should help next.',
      description:
        'Choose the first optimisations to make in your dashboard so the experience matches your priorities.',
      content: (
        <div className="grid gap-4 md:grid-cols-2">
          {[
            {
              title: 'Tune categories',
              description: 'Define how Flowiee should triage new email so you can focus faster.',
            },
            {
              title: 'Refine draft tone',
              description: 'Set the AI reply voice and prompt style that feels like you.',
            },
            {
              title: 'Connect the calendar',
              description: 'Let Flowiee surface time slots and protect focus time.',
            },
            {
              title: 'Invite a teammate',
              description: 'Share setup steps so everyone sees the same priorities.',
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-[22px] border border-slate-200/70 bg-slate-50/80 p-5 text-sm text-slate-600 shadow-sm dark:border-slate-800/70 dark:bg-slate-950/50 dark:text-slate-300"
            >
              <p className="text-base font-semibold text-slate-900 dark:text-white">{item.title}</p>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{item.description}</p>
            </div>
          ))}
        </div>
      ),
    },
  ];

  const step = steps[currentStep];
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">New user experience</p>
          <h1 className="mt-3 text-3xl font-semibold text-slate-900 dark:text-white">Flowiee setup</h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Complete one step at a time. Only the current step is visible until you click next.
          </p>
        </div>
        <button
          type="button"
          onClick={onBackToDashboard}
          className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-900 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-slate-200 dark:hover:text-white"
        >
          Back to dashboard
        </button>
      </div>

      <div className="rounded-[32px] border border-white/70 bg-white/90 p-8 shadow-[0_35px_90px_rgba(15,23,42,0.12)] dark:border-slate-800/60 dark:bg-slate-900/70 dark:shadow-black/40">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">{step.eyebrow}</p>
            <h2 className="mt-3 text-2xl font-semibold text-slate-900 dark:text-white">{step.title}</h2>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{step.description}</p>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
            {steps.map((item, index) => (
              <span
                key={item.id}
                className={`rounded-full px-3 py-1 ${
                  index === currentStep
                    ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                    : 'bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-400'
                }`}
              >
                {index + 1}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-8">{step.content}</div>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => setCurrentStep((prev) => Math.max(prev - 1, 0))}
            disabled={isFirstStep}
            className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-5 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-900 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-slate-200 dark:hover:text-white"
          >
            Back
          </button>
          {isLastStep ? (
            <button
              type="button"
              onClick={onFinish}
              className="inline-flex items-center justify-center rounded-full bg-slate-900 px-6 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
            >
              Finish setup
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1))}
              className="inline-flex items-center justify-center rounded-full bg-slate-900 px-6 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
