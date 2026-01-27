import Card from '../components/ui/Card';
import { Button } from '../components/ui/Button';

const SettingsDrafts = () => {
  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
          Draft replies
        </h1>
      </div>

      <Card className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            Draft replies
          </p>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            When you receive an email that needs a reply, XProFlow will generate a draft
            response for you to review, edit, or send.
          </p>
        </div>
        <label className="relative inline-flex cursor-pointer items-center">
          <input type="checkbox" defaultChecked className="peer sr-only" />
          <span className="toggle-off relative h-6 w-11 rounded-full transition peer-checked:bg-blue-600">
            <span className="toggle-knob absolute left-0.5 top-0.5 h-5 w-5 rounded-full shadow transition peer-checked:translate-x-5" />
          </span>
        </label>
      </Card>

      <Card className="space-y-4">
        <div className="info-panel rounded-2xl border px-4 py-3 text-sm text-slate-700 dark:text-slate-200">
          <ul className="list-disc space-y-1 pl-5 text-sm text-slate-600 dark:text-slate-300">
            <li>Draft replies work best when emails are grouped into conversation threads</li>
            <li>Gmail and Outlook usually enable this by default</li>
            <li>Drafts are saved within the email thread for easy access</li>
          </ul>
        </div>

        <details className="rounded-2xl border border-slate-200 bg-white p-4 text-sm shadow-sm dark:border-slate-800 dark:bg-slate-950">
          <summary className="cursor-pointer text-sm font-semibold text-slate-900 dark:text-slate-100">
            How to enable threading in Gmail
          </summary>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-slate-600 dark:text-slate-300">
            <li>Open Gmail settings</li>
            <li>Scroll to the bottom</li>
            <li>Enable Conversation View</li>
          </ul>
        </details>

        <details className="rounded-2xl border border-slate-200 bg-white p-4 text-sm shadow-sm dark:border-slate-800 dark:bg-slate-950">
          <summary className="cursor-pointer text-sm font-semibold text-slate-900 dark:text-slate-100">
            How to enable threading in Outlook
          </summary>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-slate-600 dark:text-slate-300">
            <li>Open Outlook settings</li>
            <li>Go to Message Organization</li>
            <li>Enable “Show email grouped by conversation”</li>
          </ul>
        </details>
      </Card>

      <Card className="space-y-4">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          Draft Prompt
        </h2>
        <textarea
          className="input-surface min-h-[140px] w-full rounded-2xl border px-4 py-3 text-sm shadow-sm outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
          placeholder={`I am concise, polite, and direct.\nI prefer shorter emails.\nUse bullet points where helpful.`}
          rows={5}
        />
      </Card>

      <div className="flex justify-end">
        <Button type="button">Update preferences</Button>
      </div>
    </section>
  );
};

export default SettingsDrafts;
