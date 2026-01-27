import Card from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ruleDefinitions } from '../lib/settingsData';

const Rules = () => {
  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Rules</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          Define automation rules with explicit approvals and clear outcomes.
        </p>
      </div>

      <Card className="space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              Automation rules
            </h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              Each rule lists its trigger, conditions, and actions so nothing runs implicitly.
            </p>
          </div>
          <Button type="button" variant="outline">
            Create rule
          </Button>
        </div>
        <div className="space-y-4">
          {ruleDefinitions.map((rule) => (
            <div
              key={rule.id}
              className="rounded-2xl border border-slate-200 bg-white p-4 text-sm shadow-sm dark:border-slate-800 dark:bg-slate-950"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    {rule.name}
                  </p>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                    {rule.description}
                  </p>
                </div>
                <label className="relative inline-flex cursor-pointer items-center">
                  <input type="checkbox" defaultChecked={rule.enabled} className="peer sr-only" />
                  <span className="toggle-off relative h-6 w-11 rounded-full transition peer-checked:bg-blue-600">
                    <span className="toggle-knob absolute left-0.5 top-0.5 h-5 w-5 rounded-full shadow transition peer-checked:translate-x-5" />
                  </span>
                </label>
              </div>
              <div className="mt-4 grid gap-4 md:grid-cols-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Trigger
                  </p>
                  <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">
                    {rule.trigger}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Conditions
                  </p>
                  <ul className="mt-1 space-y-1 text-sm text-slate-700 dark:text-slate-300">
                    {rule.conditions.map((condition) => (
                      <li key={condition}>• {condition}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Actions
                  </p>
                  <ul className="mt-1 space-y-1 text-sm text-slate-700 dark:text-slate-300">
                    {rule.actions.map((action) => (
                      <li key={action}>• {action}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
                <span>{rule.lastRun}</span>
                <Button type="button" variant="ghost" size="sm">
                  Review approvals
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </section>
  );
};

export default Rules;
