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
        'rounded-[12px] bg-surface-page p-4 shadow-card dark:bg-[#1B2636] dark:shadow-[0_18px_40px_rgba(2,6,23,0.22)]',
        className
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <p className="text-[12.8px] font-medium text-content-secondary">{label}</p>
          <p className="text-[18px] font-medium text-value-text dark:text-[#F3F7FD]">{value}</p>
        </div>
        {icon ? (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#E0F2FE] to-[#DBEAFE] text-[#2563EB] shadow-[0_6px_16px_rgba(59,130,246,0.16)] dark:from-[#18314F] dark:to-[#10243C] dark:text-[#8DC3FF] dark:shadow-none">
            {icon}
          </div>
        ) : null}
      </div>
    </div>
  );
};
