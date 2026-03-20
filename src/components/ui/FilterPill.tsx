import type { ButtonHTMLAttributes, PropsWithChildren } from 'react';
import { classNames } from '../../lib/utils';

type FilterPillProps = PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>> & {
  active?: boolean;
};

export const FilterPill = ({ active = false, className, children, ...props }: FilterPillProps) => {
  return (
    <button
      type="button"
      className={classNames(
        'h-6 rounded-[8px] border border-border-medium bg-white px-2 py-1 text-xs font-semibold text-content-secondary transition hover:bg-surface-page dark:border-white/10 dark:bg-[#111926] dark:text-[#D2DDEC] dark:hover:bg-[#1B2636]',
        active && 'border-transparent bg-content-primary text-white hover:bg-content-primary dark:bg-[#7CB8FF] dark:text-[#0F1724] dark:hover:bg-[#7CB8FF]',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};
