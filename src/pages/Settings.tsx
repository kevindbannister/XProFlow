import { useState } from 'react';
import { Link } from 'react-router-dom';
import Card from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { settingsSections } from '../lib/settingsData';

const Settings = () => {
  const [toneCardHidden, setToneCardHidden] = useState(() => {
    if (typeof window === 'undefined') {
      return false;
    }
    return localStorage.getItem('showToneCard') === 'false';
  });

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Settings</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          Manage your workspace, drafting preferences, and automation approvals.
        </p>
      </div>

      <Card className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            Settings overview
          </h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            Jump into each category to configure X-ProFlow behaviors.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {settingsSections.map((section) => (
            <div
              key={section.id}
              className="flex flex-col justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950"
            >
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  {section.title}
                </p>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                  {section.description}
                </p>
                <ul className="mt-3 space-y-1 text-xs text-slate-500 dark:text-slate-400">
                  {section.items.map((item) => (
                    <li key={item}>• {item}</li>
                  ))}
                </ul>
              </div>
              <Link to={section.path} className="w-fit">
                <Button type="button" variant="outline" size="sm">
                  Manage
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </Card>

      <Card className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            Drafting defaults
          </h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            Decide how X-ProFlow should behave before sending anything.
          </p>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          {[
            {
              title: 'Require approval before sending',
              description: 'Every draft waits for review.'
            },
            {
              title: 'Keep drafts in the inbox',
              description: 'Drafts never leave your email provider.'
            },
            {
              title: 'Notify me when VIP drafts are ready',
              description: 'Send a Slack or email notification.'
            },
            {
              title: 'Summarize new threads daily',
              description: 'Generate a digest without sending emails.'
            }
          ].map((item) => (
            <div
              key={item.title}
              className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-950"
            >
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  {item.title}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{item.description}</p>
              </div>
              <label className="relative inline-flex cursor-pointer items-center">
                <input type="checkbox" defaultChecked className="peer sr-only" />
                <span className="toggle-off relative h-6 w-11 rounded-full transition peer-checked:bg-blue-600">
                  <span className="toggle-knob absolute left-0.5 top-0.5 h-5 w-5 rounded-full shadow transition peer-checked:translate-x-5" />
                </span>
              </label>
            </div>
          ))}
        </div>
      </Card>

      <Card className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Admin</h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            Manage onboarding prompts and dashboard announcements.
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-900">
          <div>
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Show the “Make X-ProFlow sound like you” card
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Restore the onboarding prompt on the dashboard if it was dismissed.
            </p>
          </div>
          <button
            className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:bg-slate-300 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200 dark:disabled:bg-slate-700 dark:disabled:text-slate-400"
            onClick={() => {
              localStorage.setItem('showToneCard', 'true');
              setToneCardHidden(false);
            }}
            disabled={!toneCardHidden}
          >
            {toneCardHidden ? 'Show again' : 'Already visible'}
          </button>
        </div>
      </Card>
    </section>
  );
};

export default Settings;
