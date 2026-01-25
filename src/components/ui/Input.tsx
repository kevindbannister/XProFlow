import { InputHTMLAttributes } from 'react';
import { classNames } from '../../lib/utils';

type InputProps = InputHTMLAttributes<HTMLInputElement>;

export const Input = ({ className, ...props }: InputProps) => {
  return (
    <input
      className={classNames(
        'h-11 w-full rounded-2xl border border-blue-100 bg-white/80 px-4 text-sm text-slate-700 shadow-sm outline-none placeholder:text-slate-400 focus:border-blue-300 focus:ring-2 focus:ring-blue-100',
        className
      )}
      {...props}
    />
  );
};
