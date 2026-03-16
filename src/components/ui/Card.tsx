import { ReactNode } from 'react';
import { classNames } from '../../lib/utils';

type CardProps = {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'glass';
};

const Card = ({ children, className, variant = 'default' }: CardProps) => {
  const variantClasses = {
    default: 'border-[rgba(18,29,49,0.06)] bg-white shadow-card dark:border-white/10 dark:bg-[#141d2c] dark:shadow-[0_18px_40px_rgba(2,6,23,0.38)]',
    glass: 'border-[rgba(18,29,49,0.06)] bg-white/95 shadow-page dark:border-white/10 dark:bg-[#141d2c]/95 dark:shadow-[0_18px_40px_rgba(2,6,23,0.38)]'
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
