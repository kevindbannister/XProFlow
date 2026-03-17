import type { PropsWithChildren, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes, InputHTMLAttributes, ButtonHTMLAttributes } from 'react';
import { classNames } from '../../lib/utils';

export const SettingsPageShell = ({ title, subtitle, children }: PropsWithChildren<{ title: string; subtitle: string }>) => (
  <div className="flex w-full max-w-6xl flex-col gap-5">
    <header className="space-y-2">
      <h1 className="text-[28px] font-semibold leading-[1.2] text-content-primary dark:text-[#F3F7FD]">{title}</h1>
      <p className="text-sm text-content-secondary dark:text-[#A9B7C9]">{subtitle}</p>
    </header>
    {children}
  </div>
);

export const SettingsCard = ({ children, className }: PropsWithChildren<{ className?: string }>) => (
  <section className={classNames('rounded-[16px] border border-[rgba(18,29,49,0.06)] bg-white p-6 shadow-card dark:border-white/10 dark:bg-[#141d2c] dark:shadow-[0_18px_40px_rgba(2,6,23,0.38)]', className)}>{children}</section>
);

export const Field = ({ label, htmlFor, hint, children }: PropsWithChildren<{ label: string; htmlFor: string; hint?: string }>) => (
  <div className="space-y-2">
    <label htmlFor={htmlFor} className="block text-sm font-medium text-content-primary dark:text-[#F3F7FD]">{label}</label>
    {hint ? <p className="text-xs text-content-secondary dark:text-[#8EA0B8]">{hint}</p> : null}
    {children}
  </div>
);

const baseInputClass = 'w-full rounded-[12px] border border-border-medium bg-white px-3 py-2.5 text-sm text-content-primary shadow-card focus:border-content-primary focus:outline-none focus:ring-2 focus:ring-[#EEF1F3] dark:border-white/10 dark:bg-[#111926] dark:text-[#F3F7FD] dark:shadow-[0_8px_24px_rgba(2,6,23,0.3)] dark:focus:border-[#7CB8FF] dark:focus:ring-[#1E3A5F]';

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
  <div className="flex items-start justify-between gap-4 rounded-[12px] border border-border-medium bg-surface-page p-4 dark:border-white/10 dark:bg-[#1B2636]">
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-content-primary dark:text-[#F3F7FD]">{title}</label>
      {description ? <p className="mt-1 text-sm text-content-secondary dark:text-[#A9B7C9]">{description}</p> : null}
    </div>
    <div className="flex items-center gap-3">
      {rightContent}
      <input id={id} type="checkbox" defaultChecked={defaultChecked} className="h-4 w-4 rounded border-border-medium text-content-primary focus:ring-content-primary dark:border-white/10 dark:bg-[#111926]" />
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
    className={classNames('rounded-full border border-border-medium bg-white px-4 py-2 text-sm font-medium text-content-primary transition hover:bg-surface-page dark:border-white/10 dark:bg-[#111926] dark:text-[#F3F7FD] dark:hover:bg-[#1B2636]', className)}
    {...props}
  >
    {children}
  </button>
);
