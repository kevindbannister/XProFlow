import { ReactNode } from 'react';
import { classNames } from '../../lib/utils';

type CardProps = {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'glass';
};

const Card = ({ children, className, variant = 'default' }: CardProps) => {
  const variantClasses = {
    default: 'border-[rgba(18,29,49,0.06)] bg-white shadow-card',
    glass: 'border-[rgba(18,29,49,0.06)] bg-white/95 shadow-page'
  };

  return (
    <div
      className={classNames(
        'rounded-[16px] border p-6',
        variantClasses[variant],
        className
      )}
    >
      {children}
    </div>
  );
};

export default Card;
