import Card from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { workflowDefinitions } from '../lib/settingsData';

const statusStyles = {
  active: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40',
  paused: 'bg-amber-50 text-amber-600 dark:bg-amber-950/40',
  draft: 'bg-slate-100 text-slate-600 dark:bg-slate-800/60'
};

const Workflows = () => {
  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Workflows</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          Multi-step automations with clear approvals at each stage.
        </p>
      </div>

      <Card className="space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              Active workflows
            </h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              Review triggers and steps before enabling automation.
            </p>
          </div>
          <Button type="button" variant="outline">
            Create workflow
          </Button>
        </div>
        <div className="space-y-4">
          {workflowDefinitions.map((workflow) => (
            <div
              key={workflow.id}
              className="rounded-2xl border border-slate-200 bg-white p-4 text-sm shadow-sm dark:border-slate-800 dark:bg-slate-950"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    {workflow.name}
                  </p>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                    {workflow.description}
                  </p>
                </div>
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyles[workflow.status]}`}
                >
                  {workflow.status}
                </span>
              </div>
              <div className="mt-4 grid gap-4 md:grid-cols-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Trigger
                  </p>
                  <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">
                    {workflow.trigger}
                  </p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Steps
                  </p>
                  <ul className="mt-1 space-y-1 text-sm text-slate-700 dark:text-slate-300">
                    {workflow.steps.map((step) => (
                      <li key={step}>• {step}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
                <span>{workflow.lastUpdated}</span>
                <div className="flex flex-wrap gap-2">
                  <Button type="button" variant="ghost" size="sm">
                    View approvals
                  </Button>
                  <Button type="button" variant="outline" size="sm">
                    Edit workflow
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </section>
  );
};

export default Workflows;
