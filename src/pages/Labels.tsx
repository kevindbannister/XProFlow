import Card from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { labelDefinitions } from '../lib/settingsData';

const Labels = () => {
  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Labels</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          Review the labels X-ProFlow applies and decide which ones can run automatically.
        </p>
      </div>

      <Card className="space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              Smart label library
            </h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              Labels drive triage, routing, and workflow triggers.
            </p>
          </div>
          <Button type="button" variant="outline">
            Create label
          </Button>
        </div>
        <div className="space-y-3">
          {labelDefinitions.map((label) => (
            <div
              key={label.id}
              className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm dark:border-slate-800 dark:bg-slate-950"
            >
              <div className="flex items-center gap-3">
                <span
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: label.color }}
                />
                <div>
                  <p className="font-semibold text-slate-900 dark:text-slate-100">{label.name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{label.description}</p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                <span>{label.appliedCount} conversations</span>
                <span>{label.updatedAt}</span>
                <label className="relative inline-flex cursor-pointer items-center">
                  <input type="checkbox" defaultChecked={label.enabled} className="peer sr-only" />
                  <span className="toggle-off relative h-6 w-11 rounded-full transition peer-checked:bg-blue-600">
                    <span className="toggle-knob absolute left-0.5 top-0.5 h-5 w-5 rounded-full shadow transition peer-checked:translate-x-5" />
                  </span>
                </label>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="space-y-3">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          Manual overrides
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          When X-ProFlow is unsure, it will queue labels here for review before applying them.
        </p>
        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-center text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
          No labels waiting for approval.
        </div>
      </Card>
    </section>
  );
};

export default Labels;
