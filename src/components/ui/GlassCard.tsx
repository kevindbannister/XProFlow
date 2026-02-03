import { HTMLAttributes } from 'react';
import { classNames } from '../../lib/utils';

type GlassCardProps = HTMLAttributes<HTMLDivElement> & {
  padding?: 'sm' | 'md' | 'lg';
};

export const GlassCard = ({ className, padding = 'md', ...props }: GlassCardProps) => {
  return (
    <div
      className={classNames(
        'glass-card rounded-[28px] border backdrop-blur-xl',
        padding === 'sm' && 'p-4',
        padding === 'md' && 'p-6',
        padding === 'lg' && 'p-8',
        className
      )}
      {...props}
    />
  );
};
