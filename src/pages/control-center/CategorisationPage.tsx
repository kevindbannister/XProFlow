import { useMemo, useState } from 'react';
import { PrimaryButton, SecondaryButton, SettingsCard, SettingsPageShell } from '../../components/control-center/SettingsUI';

type Category = {
  name: string;
  description: string;
  color: string;
  enabledByDefault: boolean;
};

const categories: Category[] = [
  { name: 'To respond', color: 'bg-rose-100 text-rose-700', description: 'Need your response', enabledByDefault: false },
  { name: 'FYI', color: 'bg-amber-100 text-amber-800', description: 'Important, no reply needed', enabledByDefault: false },
  { name: 'Comment', color: 'bg-yellow-100 text-yellow-800', description: 'Document comments & chats', enabledByDefault: false },
  { name: 'Notification', color: 'bg-emerald-100 text-emerald-700', description: 'Automated tool notifications', enabledByDefault: false },
  { name: 'Meeting update', color: 'bg-sky-100 text-sky-700', description: 'Calendar & meeting invites', enabledByDefault: true },
  { name: 'Awaiting reply', color: 'bg-indigo-100 text-indigo-700', description: 'Waiting for their reply', enabledByDefault: false },
  { name: 'Actioned', color: 'bg-violet-100 text-violet-700', description: 'Resolved & completed threads', enabledByDefault: false },
  { name: 'Marketing', color: 'bg-pink-100 text-pink-700', description: 'Sales & marketing emails', enabledByDefault: true }
];

const pillClass = 'inline-flex rounded-md px-2.5 py-1 text-xs font-semibold';

const CategorisationPage = () => {
  const [masterEnabled, setMasterEnabled] = useState(true);
  const [respectUserLabels, setRespectUserLabels] = useState(true);
  const [replyFrequency, setReplyFrequency] = useState(8);
  const [marketingThreshold, setMarketingThreshold] = useState(32);
  const [enabledCategories, setEnabledCategories] = useState<Record<string, boolean>>(() =>
    categories.reduce<Record<string, boolean>>((acc, category) => {
      acc[category.name] = category.enabledByDefault;
      return acc;
    }, {})
  );

  const categoryCount = useMemo(
    () => Object.values(enabledCategories).filter(Boolean).length,
    [enabledCategories]
  );

  return (
    <SettingsPageShell
      title="Email categorization"
      subtitle="Organize incoming emails using categories and rules to keep your inbox focused on what matters."
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div>
            <p className="text-sm font-medium text-slate-900">Categorization engine</p>
            <p className="text-sm text-slate-500">{categoryCount} categories currently enabled</p>
          </div>
          <button
            type="button"
            aria-pressed={masterEnabled}
            onClick={() => setMasterEnabled((value) => !value)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${masterEnabled ? 'bg-slate-900' : 'bg-slate-300'}`}
          >
            <span
              className={`inline-block h-5 w-5 transform rounded-full bg-white transition ${masterEnabled ? 'translate-x-5' : 'translate-x-1'}`}
            />
          </button>
        </div>

        <SettingsCard className="space-y-4">
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
            Turning on a category below will move emails in that category out of your main inbox and into your chosen folder/label.
          </div>

          <div className="grid grid-cols-[auto,1fr] gap-x-4 gap-y-3 text-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Move to folder/label?</p>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Categories</p>
            {categories.map((category) => {
              const checked = enabledCategories[category.name];
              const categoryId = `category-${category.name.toLowerCase().replace(/\s+/g, '-')}`;

              return (
                <div key={category.name} className="contents">
                  <div className="flex items-center">
                    <input
                      id={categoryId}
                      type="checkbox"
                      checked={checked}
                      onChange={() => setEnabledCategories((prev) => ({ ...prev, [category.name]: !prev[category.name] }))}
                      className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-400"
                    />
                  </div>
                  <label htmlFor={categoryId} className="flex items-center gap-3">
                    <span className={`${pillClass} ${category.color}`}>{category.name}</span>
                    <span className="text-sm text-slate-500">{category.description}</span>
                  </label>
                </div>
              );
            })}
          </div>
        </SettingsCard>

        <section className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Email rules</h2>
            <p className="text-sm text-slate-500">Add senders, domains, or email subjects to automatically route messages into a category.</p>
          </div>

          <SettingsCard className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-900">Respect user-applied labels</p>
                <p className="text-sm text-slate-500">Skip auto-categorizing emails that already have labels or are moved into another folder.</p>
              </div>
              <button
                type="button"
                aria-pressed={respectUserLabels}
                onClick={() => setRespectUserLabels((value) => !value)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${respectUserLabels ? 'bg-slate-900' : 'bg-slate-300'}`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white transition ${respectUserLabels ? 'translate-x-5' : 'translate-x-1'}`}
                />
              </button>
            </div>
            <div className="flex justify-end">
              <PrimaryButton type="button" className="bg-blue-600 hover:bg-blue-500">Update preferences</PrimaryButton>
            </div>
          </SettingsCard>

          <div className="flex gap-3">
            <SecondaryButton type="button">+ Add email or subject</SecondaryButton>
            <SecondaryButton type="button">+ Add alternate email</SecondaryButton>
          </div>
        </section>

        <section className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Reply & filter settings</h2>
            <p className="text-sm text-slate-500">Adjust AI thresholds for drafting replies and deciding which emails should be treated as marketing.</p>
          </div>
          <SettingsCard className="space-y-6">
            <div className="space-y-2">
              <p className="text-sm font-semibold text-slate-900">How often do you like to reply?</p>
              <div className="flex justify-between text-xs text-slate-500">
                <span>Very often</span>
                <span>Rarely</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={replyFrequency}
                onChange={(event) => setReplyFrequency(Number(event.target.value))}
                className="w-full accent-slate-900"
              />
              <p className="text-sm text-slate-600">{replyFrequency > 60 ? 'I reply to almost everything, even if it is just to be polite.' : 'I usually prioritize only emails that need action.'}</p>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-semibold text-slate-900">Which emails should be filtered as marketing?</p>
              <div className="flex justify-between text-xs text-slate-500">
                <span>Obvious</span>
                <span>Irrelevant</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={marketingThreshold}
                onChange={(event) => setMarketingThreshold(Number(event.target.value))}
                className="w-full accent-emerald-500"
              />
              <p className="text-sm text-slate-600">{marketingThreshold < 50 ? 'Cold emails and unknown senders are filtered earlier.' : 'Only clearly promotional emails are filtered.'}</p>
            </div>
          </SettingsCard>
        </section>
      </div>
    </SettingsPageShell>
  );
};

export default CategorisationPage;
