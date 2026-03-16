import { ReactNode } from 'react';

type PageHeaderProps = {
  title: string;
  subtitle: string;
  action?: ReactNode;
};

export const PageHeader = ({ title, subtitle, action }: PageHeaderProps) => {
  return (
    <div className="flex flex-wrap items-start justify-between gap-5">
      <div className="space-y-2">
        <h1 className="text-[28px] font-semibold leading-[1.2] text-content-primary">{title}</h1>
        <p className="text-sm text-content-secondary">{subtitle}</p>
      </div>
      {action}
    </div>
  );
};
