import { ReactNode } from 'react';
import { classNames } from '../../lib/utils';
import { xProFlowRadii, xProFlowShadows } from '../../lib/designTokens';

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
        'border p-6',
        xProFlowRadii.card,
        xProFlowShadows.card,
        variantClasses[variant],
        className
      )}
    >
      {children}
    </div>
  );
};

export default Card;
