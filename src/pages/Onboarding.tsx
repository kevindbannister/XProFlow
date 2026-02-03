import Card from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import {
  onboardingAccounts,
  onboardingPreferences,
  onboardingSteps
} from '../lib/settingsData';

const statusStyles = {
  complete: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40',
  'in-progress': 'text-amber-600 bg-amber-50 dark:bg-amber-950/40',
  todo: 'text-slate-600 bg-slate-100 dark:bg-slate-800/60'
};

const Onboarding = () => {
  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
          Onboarding
        </h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          Configure X-ProFlow to mirror your workflows while keeping every decision explicit and
          reversible.
        </p>
      </div>

      <Card className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            Setup checklist
          </h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            Finish each step to enable drafting, labeling, and workflows.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {onboardingSteps.map((step) => (
            <div
              key={step.id}
              className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    {step.title}
                  </p>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                    {step.description}
                  </p>
                </div>
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyles[step.status]}`}
                >
                  {step.status.replace('-', ' ')}
                </span>
              </div>
              <div className="mt-4">
                <Button type="button" variant="outline" size="sm">
                  {step.actionLabel}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
        <Card className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              Connected inboxes
            </h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              Confirm permissions for every inbox X-ProFlow can read or draft in.
            </p>
          </div>
          <div className="space-y-3">
            {onboardingAccounts.map((account) => (
              <div
                key={account.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm dark:border-slate-800 dark:bg-slate-950"
              >
                <div>
                  <p className="font-semibold text-slate-900 dark:text-slate-100">
                    {account.provider}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{account.address}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                    {account.status.replace('-', ' ')}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {account.lastSync}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-3">
            <Button type="button">Add inbox</Button>
            <Button type="button" variant="outline">
              Review permissions
            </Button>
          </div>
        </Card>

        <Card className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              Control preferences
            </h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              Decide which automations run automatically versus waiting for approval.
            </p>
          </div>
          <div className="space-y-3">
            {onboardingPreferences.map((preference) => (
              <div
                key={preference.id}
                className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-950"
              >
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    {preference.title}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {preference.description}
                  </p>
                </div>
                <label className="relative inline-flex cursor-pointer items-center">
                  <input type="checkbox" defaultChecked={preference.enabled} className="peer sr-only" />
                  <span className="toggle-off relative h-6 w-11 rounded-full transition peer-checked:bg-blue-600">
                    <span className="toggle-knob absolute left-0.5 top-0.5 h-5 w-5 rounded-full shadow transition peer-checked:translate-x-5" />
                  </span>
                </label>
              </div>
            ))}
          </div>
          <Button type="button" variant="outline" className="w-full">
            Save preference changes
          </Button>
        </Card>
      </div>
    </section>
  );
};

export default Onboarding;
