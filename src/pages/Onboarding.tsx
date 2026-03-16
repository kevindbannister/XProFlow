import { Link } from 'react-router-dom';
import Card from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { FilterPill } from '../components/ui/FilterPill';
import { PageHeader } from '../components/ui/PageHeader';
import {
  onboardingAccounts,
  onboardingPreferences,
  onboardingSteps
} from '../lib/settingsData';

const statusStyles = {
  complete: 'text-emerald-700 bg-emerald-50',
  'in-progress': 'text-amber-700 bg-amber-50',
  todo: 'text-content-secondary bg-surface-page'
};

const Onboarding = () => {
  return (
    <section className="flex w-full max-w-6xl flex-col gap-5">
      <PageHeader
        title="Onboarding"
        subtitle="Configure XProFlow to mirror your workflows while keeping every decision explicit and reversible."
        action={(
          <div className="flex flex-wrap gap-2">
            <FilterPill active>Workspace setup</FilterPill>
            <FilterPill>Guided flow</FilterPill>
          </div>
        )}
      />

      <Card className="space-y-3 bg-gradient-to-r from-[#F5FBFF] via-white to-[#F2F7FF]">
        <div className="inline-flex w-fit rounded-full bg-gradient-to-r from-[#27B0FF] to-[#3B82F6] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-white shadow-[0_8px_20px_rgba(59,130,246,0.18)]">
          Guided setup
        </div>
        <h2 className="text-lg font-semibold text-content-primary">Help XProFlow write like your finance team</h2>
        <p className="text-sm text-content-secondary">Capture your role, audiences, tone and risk posture in under 3 minutes.</p>
        <Link to="/onboarding/professional-context" className="inline-flex w-fit rounded-full bg-gradient-to-r from-[#27B0FF] to-[#3B82F6] px-4 py-2 text-sm font-medium text-white shadow-[0_10px_24px_rgba(59,130,246,0.24)]">Open Professional Context setup</Link>
      </Card>

      <Card className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-content-primary">
            Setup checklist
          </h2>
          <p className="mt-1 text-sm text-content-secondary">
            Finish each step to enable drafting, labeling, and workflows.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {onboardingSteps.map((step) => (
            <div
              key={step.id}
              className="rounded-[12px] bg-surface-page p-4 shadow-card"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-content-primary">
                    {step.title}
                  </p>
                  <p className="mt-1 text-sm text-content-secondary">
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
            <h2 className="text-lg font-semibold text-content-primary">
              Connected inboxes
            </h2>
            <p className="mt-1 text-sm text-content-secondary">
              Confirm permissions for every inbox X-ProFlow can read or draft in.
            </p>
          </div>
          <div className="space-y-3">
            {onboardingAccounts.map((account) => (
              <div
                key={account.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-[12px] bg-surface-page px-4 py-3 text-sm shadow-card"
              >
                <div>
                  <p className="font-semibold text-content-primary">
                    {account.provider}
                  </p>
                  <p className="text-xs text-content-secondary">{account.address}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-semibold text-content-primary">
                    {account.status.replace('-', ' ')}
                  </p>
                  <p className="text-xs text-content-secondary">
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
            <h2 className="text-lg font-semibold text-content-primary">
              Control preferences
            </h2>
            <p className="mt-1 text-sm text-content-secondary">
              Decide which automations run automatically versus waiting for approval.
            </p>
          </div>
          <div className="space-y-3">
            {onboardingPreferences.map((preference) => (
              <div
                key={preference.id}
                className="flex items-center justify-between gap-3 rounded-[12px] bg-surface-page px-4 py-3 shadow-card"
              >
                <div>
                  <p className="text-sm font-semibold text-content-primary">
                    {preference.title}
                  </p>
                  <p className="text-xs text-content-secondary">
                    {preference.description}
                  </p>
                </div>
                <label className="relative inline-flex cursor-pointer items-center">
                  <input type="checkbox" defaultChecked={preference.enabled} className="peer sr-only" />
                  <span className="relative h-6 w-11 rounded-full bg-border-medium transition peer-checked:bg-content-primary">
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
