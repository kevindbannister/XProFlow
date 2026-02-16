import { useState } from 'react';
import {
  AtSign,
  Clock3,
  PenSquare,
  Shield,
  Tag
} from 'lucide-react';
import { classNames } from '../lib/utils';

type SettingsCategoryId = 'rules' | 'labels' | 'writingStyle' | 'signatureTimeZone' | 'account';

type SettingsCategory = {
  id: SettingsCategoryId;
  label: string;
  icon: typeof Shield;
  title: string;
  subtitle: string;
  sections: Array<{ heading: string; description: string }>;
};

const categories: SettingsCategory[] = [
  {
    id: 'rules',
    label: 'Rules',
    icon: Shield,
    title: 'Rules',
    subtitle: 'Control automation, approvals, and send protections.',
    sections: [
      { heading: 'Approval rules', description: 'Require manual review for key contacts and high-risk drafts.' },
      { heading: 'Automation scope', description: 'Set when assistant drafting is enabled and when it should pause.' },
      { heading: 'Quiet hours', description: 'Prevent accidental sends outside your preferred working times.' }
    ]
  },
  {
    id: 'labels',
    label: 'Labels',
    icon: Tag,
    title: 'Labels',
    subtitle: 'Organize inbound and drafted messages with consistent tags.',
    sections: [
      { heading: 'Default labels', description: 'Apply a review label automatically to generated drafts.' },
      { heading: 'Smart categorization', description: 'Use topic-driven labels for billing, support, and follow-ups.' },
      { heading: 'Archive behavior', description: 'Move low-priority labeled threads out of your primary inbox.' }
    ]
  },
  {
    id: 'writingStyle',
    label: 'Writing Style',
    icon: PenSquare,
    title: 'Writing Style',
    subtitle: 'Tune voice, formality, and response structure in drafts.',
    sections: [
      { heading: 'Tone preset', description: 'Keep a friendly and professional voice across all conversations.' },
      { heading: 'Response length', description: 'Choose concise defaults while allowing detailed replies when needed.' },
      { heading: 'Formatting', description: 'Enable clean summaries and action-first paragraph structure.' }
    ]
  },
  {
    id: 'signatureTimeZone',
    label: 'Signature & Time Zone',
    icon: Clock3,
    title: 'Signature & Time Zone',
    subtitle: 'Set identity details and schedule behavior.',
    sections: [
      { heading: 'Signature block', description: 'Attach your preferred signature to outbound drafts by default.' },
      { heading: 'Send scheduling', description: 'Use your local time zone when suggesting delayed send times.' },
      { heading: 'Availability notes', description: 'Optionally include office hours in generated responses.' }
    ]
  },
  {
    id: 'account',
    label: 'Account',
    icon: AtSign,
    title: 'Account',
    subtitle: 'Manage profile, security, and personal preferences.',
    sections: [
      { heading: 'Profile', description: 'Update display name and account metadata used in your workspace.' },
      { heading: 'Security', description: 'Configure two-factor authentication and sign-in protections.' },
      { heading: 'Notifications', description: 'Choose product updates and assistant activity alerts.' }
    ]
  }
];

const Settings = () => {
  const [activeCategory, setActiveCategory] = useState<SettingsCategoryId>('rules');

  const selectedCategory = categories.find((category) => category.id === activeCategory) ?? categories[0];

  return (
    <main className="rounded-2xl border border-slate-200 bg-slate-50 p-4 lg:p-5" aria-label="Settings page">
      <section className="grid items-start gap-4 lg:grid-cols-[18rem_minmax(0,1fr)]">
        <aside className="lg:sticky lg:top-4 lg:max-h-[calc(100vh-9rem)] lg:overflow-y-auto">
          <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
            <nav aria-label="Settings sections" role="navigation">
              <h2 className="mb-2 px-2 text-base font-semibold text-slate-900 dark:text-slate-100">Settings</h2>
              <ul role="list" className="space-y-1">
                {categories.map((category) => {
                  const Icon = category.icon;
                  const isActive = category.id === selectedCategory.id;

                  return (
                    <li key={category.id}>
                      <button
                        type="button"
                        onClick={() => setActiveCategory(category.id)}
                        className={classNames(
                          'flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm font-medium transition',
                          isActive
                            ? 'bg-slate-900 text-white'
                            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-700/40 dark:hover:text-slate-100'
                        )}
                        aria-current={isActive ? 'page' : undefined}
                        aria-controls="settings-content-panel"
                      >
                        <Icon className="h-4 w-4" strokeWidth={1.8} aria-hidden="true" />
                        <span>{category.label}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>
        </aside>

        <section
          id="settings-content-panel"
          className="min-h-[32rem] rounded-xl border border-slate-200 bg-white p-4 shadow-sm lg:p-6"
          aria-live="polite"
        >
          <header className="mb-6 border-b border-slate-100 pb-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Category</p>
            <h1 className="mt-1 text-2xl font-semibold text-slate-900 dark:text-slate-100">{selectedCategory.title}</h1>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{selectedCategory.subtitle}</p>
          </header>

          <div className="grid gap-3 lg:grid-cols-2">
            {selectedCategory.sections.map((section) => (
              <article key={section.heading} className="rounded-lg border border-slate-200 bg-white p-4">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{section.heading}</h3>
                <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-300">{section.description}</p>
              </article>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
};

export default Settings;
