import { ButtonHTMLAttributes } from 'react';
import { classNames } from '../../lib/utils';

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'default' | 'ghost' | 'outline' | 'soft';
  size?: 'default' | 'icon' | 'sm';
};

export const Button = ({
  variant = 'default',
  size = 'default',
  className,
  ...props
}: ButtonProps) => {
  return (
    <button
      className={classNames(
        'inline-flex items-center justify-center gap-2 rounded-full text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-200 disabled:cursor-not-allowed disabled:opacity-60',
        variant === 'default' && 'flow-primary-button',
        variant === 'ghost' && 'button-ghost',
        variant === 'outline' &&
          'button-outline border',
        variant === 'soft' && 'button-soft',
        size === 'default' && 'px-4 py-2.5',
        size === 'icon' && 'h-9 w-9 p-0',
        size === 'sm' && 'px-3 py-2 text-xs',
        className
      )}
      {...props}
    />
  );
};
