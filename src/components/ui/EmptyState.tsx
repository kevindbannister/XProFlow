import type { PropsWithChildren, ReactNode } from 'react';

type EmptyStateProps = PropsWithChildren<{
  title: string;
  body: string;
  action?: ReactNode;
}>;

export const EmptyState = ({ title, body, action, children }: EmptyStateProps) => {
  return (
    <div className="mt-24 flex flex-col items-center justify-center gap-4">
      {children}
      <div className="space-y-2 text-center">
        <h2 className="text-[20px] font-medium text-content-primary">{title}</h2>
        <p className="max-w-[384px] text-[14px] leading-5 text-content-secondary">{body}</p>
      </div>
      {action}
    </div>
  );
};
