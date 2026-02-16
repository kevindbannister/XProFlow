import { useMemo, useState } from 'react';
import Card from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { labelDefinitions } from '../lib/settingsData';

const Labels = () => {
  const [selectedLabels, setSelectedLabels] = useState<Record<string, boolean>>(() =>
    labelDefinitions.reduce<Record<string, boolean>>((acc, label) => {
      acc[label.id] = label.enabled;
      return acc;
    }, {})
  );

  const selectedCount = useMemo(
    () => Object.values(selectedLabels).filter(Boolean).length,
    [selectedLabels]
  );

  const toggleLabel = (labelId: string) => {
    setSelectedLabels((previous) => ({
      ...previous,
      [labelId]: !previous[labelId],
    }));
  };

  const selectAll = () => {
    setSelectedLabels(
      labelDefinitions.reduce<Record<string, boolean>>((acc, label) => {
        acc[label.id] = true;
        return acc;
      }, {})
    );
  };

  const clearAll = () => {
    setSelectedLabels(
      labelDefinitions.reduce<Record<string, boolean>>((acc, label) => {
        acc[label.id] = false;
        return acc;
      }, {})
    );
  };

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Label settings</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          Choose which labels X-ProFlow can apply automatically. Disable any label you want to apply
          manually.
        </p>
      </div>

      <Card className="space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Available labels</h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              {selectedCount} of {labelDefinitions.length} labels enabled
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button type="button" variant="outline" onClick={clearAll}>
              Deselect all
            </Button>
            <Button type="button" variant="outline" onClick={selectAll}>
              Select all
            </Button>
          </div>
        </div>

        <div className="space-y-3">
          {labelDefinitions.map((label) => {
            const isSelected = Boolean(selectedLabels[label.id]);

            return (
              <div
                key={label.id}
                className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm dark:border-slate-800 dark:bg-slate-950"
              >
                <div className="flex items-center gap-3">
                  <span className="h-3 w-3 rounded-full" style={{ backgroundColor: label.color }} />
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-slate-100">{label.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{label.description}</p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                  <span>{label.appliedCount} conversations</span>
                  <span>{label.updatedAt}</span>
                  <label className="relative inline-flex cursor-pointer items-center">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleLabel(label.id)}
                      className="peer sr-only"
                      aria-label={`Enable ${label.name} label`}
                    />
                    <span className="toggle-off relative h-6 w-11 rounded-full transition peer-checked:bg-blue-600">
                      <span className="toggle-knob absolute left-0.5 top-0.5 h-5 w-5 rounded-full shadow transition peer-checked:translate-x-5" />
                    </span>
                  </label>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      <Card className="space-y-3">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Recommendations</h2>
        <ul className="list-disc space-y-2 pl-5 text-sm text-slate-600 dark:text-slate-300">
          <li>Keep <strong>To Respond</strong> enabled so urgent threads are always surfaced.</li>
          <li>Disable <strong>Marketing</strong> if you prefer to tag promos manually.</li>
          <li>Review this page weekly to keep label usage aligned with your workflow.</li>
        </ul>
      </Card>
    </section>
  );
};

export default Labels;
