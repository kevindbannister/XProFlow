import { ReactNode } from 'react';

type PageHeaderProps = {
  title: string;
  subtitle: string;
  action?: ReactNode;
};

export const PageHeader = ({ title, subtitle, action }: PageHeaderProps) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div>
      <h1 className="text-3xl font-semibold theme-text-primary">{title}</h1>
      <p className="mt-2 text-sm theme-text-muted">{subtitle}</p>
      </div>
      {action}
    </div>
  );
};
