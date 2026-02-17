import type { ReactNode } from 'react';

type SettingsSection = {
  heading: string;
  description: string;
};

type SettingsCategoryPageProps = {
  title: string;
  subtitle: string;
  description?: ReactNode;
  sections: SettingsSection[];
};

const SettingsCategoryPage = ({ title, subtitle, description, sections }: SettingsCategoryPageProps) => (
  <main className="rounded-2xl border border-slate-200 bg-slate-50 p-4 lg:p-5" aria-label={`${title} settings page`}>
    <section className="min-h-[32rem] rounded-xl border border-slate-200 bg-white p-4 shadow-sm lg:p-6">
      <header className="mb-6 border-b border-slate-100 pb-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Category</p>
        <h1 className="mt-1 text-2xl font-semibold text-slate-900 dark:text-slate-100">{title}</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{subtitle}</p>
        {description ? <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{description}</p> : null}
      </header>

      <div className="grid gap-3 lg:grid-cols-2">
        {sections.map((section) => (
          <article key={section.heading} className="rounded-lg border border-slate-200 bg-white p-4">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{section.heading}</h3>
            <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-300">{section.description}</p>
          </article>
        ))}
      </div>
    </section>
  </main>
);

export default SettingsCategoryPage;
