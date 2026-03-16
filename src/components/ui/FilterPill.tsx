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
        'h-6 rounded-[8px] border border-border-medium bg-white px-2 py-1 text-xs font-semibold text-content-secondary transition hover:bg-surface-page',
        active && 'border-transparent bg-content-primary text-white hover:bg-content-primary',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};
