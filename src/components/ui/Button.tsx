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
        'inline-flex items-center justify-center gap-2 rounded-full text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4DAE1] disabled:cursor-not-allowed disabled:opacity-60',
        variant === 'default' &&
          'bg-gradient-to-r from-[#27B0FF] to-[#3B82F6] text-white shadow-[0_10px_24px_rgba(59,130,246,0.24)] hover:brightness-[1.03]',
        variant === 'ghost' && 'button-ghost',
        variant === 'outline' &&
          'border border-border-medium bg-white text-content-primary hover:bg-surface-page dark:border-white/10 dark:bg-[#111926] dark:text-[#F3F7FD]',
        variant === 'soft' && 'bg-surface-page text-content-primary hover:bg-surface-hover dark:bg-[#1B2636] dark:text-[#F3F7FD]',
        size === 'default' && 'px-4 py-2.5',
        size === 'icon' && 'h-9 w-9 p-0',
        size === 'sm' && 'px-3 py-2 text-xs',
        className
      )}
      {...props}
    />
  );
};
