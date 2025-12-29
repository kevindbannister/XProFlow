import { FC } from 'react';

export type FeatureToggleItem = {
  id: string;
  label: string;
  description?: string;
};

export type FeatureToggleGroup = {
  title: string;
  items: FeatureToggleItem[];
};

interface FeatureTogglePanelProps {
  isOpen: boolean;
  groups: FeatureToggleGroup[];
  toggles: Record<string, boolean>;
  onToggle: (id: string) => void;
  onClose: () => void;
}

export const FeatureTogglePanel: FC<FeatureTogglePanelProps> = ({ isOpen, groups, toggles, onToggle, onClose }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <section className="w-full rounded-[32px] border border-white/70 bg-white/90 p-5 shadow-[0_30px_80px_rgba(15,23,42,0.12)] backdrop-blur-2xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Master controls</p>
          <h2 className="text-lg font-semibold text-slate-900">Feature visibility</h2>
          <p className="text-sm text-slate-500">Toggle pages or sections to hide them across the app.</p>
        </div>
        <button
          onClick={onClose}
          className="inline-flex items-center justify-center rounded-full border border-white/70 bg-white/70 px-4 py-2 text-xs font-semibold text-slate-600 shadow-sm"
        >
          Close
        </button>
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {groups.map((group) => (
          <div key={group.title} className="rounded-3xl border border-slate-100 bg-white/80 p-4 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-800">{group.title}</h3>
            <div className="mt-4 space-y-3">
              {group.items.map((item) => {
                const enabled = toggles[item.id] ?? true;
                return (
                  <div key={item.id} className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{item.label}</p>
                      {item.description ? <p className="text-xs text-slate-500">{item.description}</p> : null}
                    </div>
                    <button
                      onClick={() => onToggle(item.id)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                        enabled ? 'bg-emerald-500' : 'bg-slate-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 rounded-full bg-white transition ${enabled ? 'translate-x-5' : 'translate-x-1'}`}
                      />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
