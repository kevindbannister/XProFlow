import { InputHTMLAttributes } from 'react';
import { classNames } from '../../lib/utils';

type InputProps = InputHTMLAttributes<HTMLInputElement>;

export const Input = ({ className, ...props }: InputProps) => {
  return (
    <input
      className={classNames(
        'h-11 w-full rounded-[12px] border border-border-medium bg-white px-4 text-sm text-content-primary shadow-card outline-none placeholder:text-content-secondary/70 focus:border-content-primary focus:ring-2 focus:ring-[#EEF1F3] dark:border-white/10 dark:bg-[#111926] dark:text-[#F3F7FD] dark:placeholder:text-[#8EA0B8] dark:shadow-[0_8px_24px_rgba(2,6,23,0.3)] dark:focus:border-[#7CB8FF] dark:focus:ring-[#1E3A5F]',
        className
      )}
      {...props}
    />
  );
};
