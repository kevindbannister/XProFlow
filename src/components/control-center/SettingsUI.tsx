import type { PropsWithChildren, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes, InputHTMLAttributes, ButtonHTMLAttributes } from 'react';
import { classNames } from '../../lib/utils';

export const SettingsPageShell = ({ title, subtitle, children }: PropsWithChildren<{ title: string; subtitle: string }>) => (
  <div className="mx-auto flex w-full max-w-6xl flex-col gap-5">
    <header className="space-y-2">
      <h1 className="text-[28px] font-semibold leading-[1.2] text-content-primary">{title}</h1>
      <p className="text-sm text-content-secondary">{subtitle}</p>
    </header>
    {children}
  </div>
);

export const SettingsCard = ({ children, className }: PropsWithChildren<{ className?: string }>) => (
  <section className={classNames('rounded-[16px] border border-[rgba(18,29,49,0.06)] bg-white p-6 shadow-card', className)}>{children}</section>
);

export const Field = ({ label, htmlFor, hint, children }: PropsWithChildren<{ label: string; htmlFor: string; hint?: string }>) => (
  <div className="space-y-2">
    <label htmlFor={htmlFor} className="block text-sm font-medium text-content-primary">{label}</label>
    {hint ? <p className="text-xs text-content-secondary">{hint}</p> : null}
    {children}
  </div>
);

const baseInputClass = 'w-full rounded-[12px] border border-border-medium bg-white px-3 py-2.5 text-sm text-content-primary shadow-card focus:border-content-primary focus:outline-none focus:ring-2 focus:ring-[#EEF1F3]';

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
  <div className="flex items-start justify-between gap-4 rounded-[12px] border border-border-medium bg-surface-page p-4">
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-content-primary">{title}</label>
      {description ? <p className="mt-1 text-sm text-content-secondary">{description}</p> : null}
    </div>
    <div className="flex items-center gap-3">
      {rightContent}
      <input id={id} type="checkbox" defaultChecked={defaultChecked} className="h-4 w-4 rounded border-border-medium text-content-primary focus:ring-content-primary" />
    </div>
  </div>
);

export const PrimaryButton = ({ children, className, ...props }: PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>>) => (
  <button
    className={classNames('rounded-full bg-content-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-[#1A2740]', className)}
    {...props}
  >
    {children}
  </button>
);

export const SecondaryButton = ({ children, className, ...props }: PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>>) => (
  <button
    className={classNames('rounded-full border border-border-medium bg-white px-4 py-2 text-sm font-medium text-content-primary transition hover:bg-surface-page', className)}
    {...props}
  >
    {children}
  </button>
);
