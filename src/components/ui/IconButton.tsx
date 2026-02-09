import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { classNames } from '../../lib/utils';

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  icon: ReactNode;
  label: string;
  variant?: 'default' | 'ghost';
};

const IconButton = ({ icon, label, variant = 'default', className, ...props }: IconButtonProps) => {
  const variantClasses = {
    default: 'icon-button',
    ghost: 'icon-button-ghost'
  };

  return (
    <button
      type="button"
      aria-label={label}
      className={classNames(variantClasses[variant], className)}
      {...props}
    >
      {icon}
    </button>
  );
};

export default IconButton;
