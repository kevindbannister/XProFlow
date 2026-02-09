import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { classNames } from '../../lib/utils';
import { xProFlowRadii } from '../../lib/designTokens';

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  icon: ReactNode;
  label: string;
  variant?: 'soft' | 'outline';
};

const IconButton = ({ icon, label, variant = 'outline', className, ...props }: IconButtonProps) => {
  return (
    <button
      type="button"
      aria-label={label}
      className={classNames(
        'flex h-10 w-10 items-center justify-center border text-slate-500 transition',
        xProFlowRadii.pill,
        variant === 'soft' ? 'button-soft' : 'button-outline',
        'hover:text-slate-700 dark:text-slate-300 dark:hover:text-slate-100',
        className
      )}
      {...props}
    >
      {icon}
    </button>
  );
};

export default IconButton;
