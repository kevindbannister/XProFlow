import { HTMLAttributes } from 'react';
import { classNames } from '../../lib/utils';

type GlassCardProps = HTMLAttributes<HTMLDivElement> & {
  padding?: 'sm' | 'md' | 'lg';
};

export const GlassCard = ({ className, padding = 'md', ...props }: GlassCardProps) => {
  return (
    <div
      className={classNames(
        'rounded-[28px] border border-white/70 bg-white/75 shadow-[0_20px_60px_rgba(80,115,190,0.16)] backdrop-blur-xl',
        padding === 'sm' && 'p-4',
        padding === 'md' && 'p-6',
        padding === 'lg' && 'p-8',
        className
      )}
      {...props}
    />
  );
};
