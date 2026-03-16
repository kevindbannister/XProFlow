import { ReactNode } from 'react';
import { classNames } from '../../lib/utils';

export type StatCardProps = {
  icon?: ReactNode;
  label: string;
  value: string | number;
  className?: string;
};

export const StatCard = ({ icon, label, value, className }: StatCardProps) => {
  return (
    <div
      className={classNames(
        'rounded-[12px] bg-surface-page p-4 shadow-card',
        className
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <p className="text-[12.8px] font-medium text-content-secondary">{label}</p>
          <p className="text-[18px] font-medium text-value-text">{value}</p>
        </div>
        {icon ? (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-content-primary shadow-card">
            {icon}
          </div>
        ) : null}
      </div>
    </div>
  );
};
