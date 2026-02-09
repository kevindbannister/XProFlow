import { ReactNode } from 'react';
import { classNames } from '../../lib/utils';

type CardProps = {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'glass';
};

const Card = ({ children, className, variant = 'default' }: CardProps) => {
  const variantClasses = {
    default: 'card-surface',
    glass: 'glass-card'
  };

  return (
    <div
      className={classNames(
        'card-base border p-6',
        variantClasses[variant],
        className
      )}
    >
      {children}
    </div>
  );
};

export default Card;
