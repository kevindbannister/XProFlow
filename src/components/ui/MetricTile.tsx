import { ReactNode } from 'react';
import { GlassCard } from './GlassCard';

export type MetricTileProps = {
  icon: ReactNode;
  title: string;
  value: string;
  description: string;
};

export const MetricTile = ({ icon, title, value, description }: MetricTileProps) => {
  return (
    <GlassCard className="space-y-3" padding="md">
      <div className="flex items-center gap-2 text-blue-500">{icon}</div>
      <div>
        <p className="text-sm font-semibold theme-text-primary">{title}</p>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-semibold theme-text-primary">{value}</span>
          <span className="text-xs theme-text-muted">{description}</span>
        </div>
      </div>
    </GlassCard>
  );
};
