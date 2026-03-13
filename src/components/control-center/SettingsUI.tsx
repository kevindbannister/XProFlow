import type { PropsWithChildren, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes, InputHTMLAttributes, ButtonHTMLAttributes } from 'react';
import { classNames } from '../../lib/utils';

export const SettingsPageShell = ({ title, subtitle, children }: PropsWithChildren<{ title: string; subtitle: string }>) => (
  <div className="mx-auto max-w-4xl space-y-6 p-6">
    <header>
      <h1 className="text-2xl font-semibold text-slate-900">{title}</h1>
      <p className="text-sm text-slate-500">{subtitle}</p>
    </header>
    {children}
  </div>
);

export const SettingsCard = ({ children, className }: PropsWithChildren<{ className?: string }>) => (
  <section className={classNames('rounded-xl border bg-white p-6 shadow-sm', className)}>{children}</section>
);

export const Field = ({ label, htmlFor, hint, children }: PropsWithChildren<{ label: string; htmlFor: string; hint?: string }>) => (
  <div className="space-y-1.5">
    <label htmlFor={htmlFor} className="block text-sm font-medium text-slate-800">{label}</label>
    {hint ? <p className="text-xs text-slate-500">{hint}</p> : null}
    {children}
  </div>
);

const baseInputClass = 'w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 shadow-sm focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-100';

export const TextInput = (props: InputHTMLAttributes<HTMLInputElement>) => (
  <input {...props} className={classNames(baseInputClass, props.className)} />
);

export const SelectInput = (props: SelectHTMLAttributes<HTMLSelectElement>) => (
  <select {...props} className={classNames(baseInputClass, props.className)} />
);

export const TextAreaInput = (props: TextareaHTMLAttributes<HTMLTextAreaElement>) => (
  <textarea {...props} className={classNames(baseInputClass, 'min-h-28', props.className)} />
);

export const ToggleRow = ({
  title,
  description,
  defaultChecked = false,
  id,
  rightContent
}: {
  title: string;
  description?: string;
  defaultChecked?: boolean;
  id: string;
  rightContent?: ReactNode;
}) => (
  <div className="flex items-start justify-between gap-4 rounded-lg border border-slate-200 p-4">
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-slate-900">{title}</label>
      {description ? <p className="mt-1 text-sm text-slate-500">{description}</p> : null}
    </div>
    <div className="flex items-center gap-3">
      {rightContent}
      <input id={id} type="checkbox" defaultChecked={defaultChecked} className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-400" />
    </div>
  </div>
);

export const PrimaryButton = ({ children, className, ...props }: PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>>) => (
  <button
    className={classNames('rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700', className)}
    {...props}
  >
    {children}
  </button>
);

export const SecondaryButton = ({ children, className, ...props }: PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>>) => (
  <button
    className={classNames('rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50', className)}
    {...props}
  >
    {children}
  </button>
);
