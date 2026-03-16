import { InputHTMLAttributes } from 'react';
import { classNames } from '../../lib/utils';

type InputProps = InputHTMLAttributes<HTMLInputElement>;

export const Input = ({ className, ...props }: InputProps) => {
  return (
    <input
      className={classNames(
        'h-11 w-full rounded-[12px] border border-border-medium bg-white px-4 text-sm text-content-primary shadow-card outline-none placeholder:text-content-secondary/70 focus:border-content-primary focus:ring-2 focus:ring-[#EEF1F3]',
        className
      )}
      {...props}
    />
  );
};
