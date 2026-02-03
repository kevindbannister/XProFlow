import { InputHTMLAttributes } from 'react';
import { classNames } from '../../lib/utils';

type InputProps = InputHTMLAttributes<HTMLInputElement>;

export const Input = ({ className, ...props }: InputProps) => {
  return (
    <input
      className={classNames(
        'input-surface h-11 w-full rounded-2xl border px-4 text-sm shadow-sm outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100',
        className
      )}
      {...props}
    />
  );
};
