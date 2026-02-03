import { ReactNode } from 'react';
import { classNames } from '../../lib/utils';

type CardProps = {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'glass';
};

const Card = ({ children, className, variant = 'default' }: CardProps) => {
  const variantClasses = {
    default: 'panel-surface',
    glass: 'glass-card'
  };

  return (
    <div
      className={classNames(
        'rounded-2xl border p-6 shadow-sm',
        variantClasses[variant],
        className
      )}
    >
      {children}
    </div>
  );
};

export default Card;
