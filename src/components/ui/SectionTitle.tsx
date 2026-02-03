import { ReactNode } from 'react';

type SectionTitleProps = {
  title: string;
  subtitle?: string;
  action?: ReactNode;
};

export const SectionTitle = ({ title, subtitle, action }: SectionTitleProps) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h2 className="text-lg font-semibold theme-text-primary">{title}</h2>
        {subtitle ? <p className="mt-1 text-xs theme-text-muted">{subtitle}</p> : null}
      </div>
      {action}
    </div>
  );
};
