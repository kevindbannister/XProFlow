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
        <p className="text-sm font-semibold text-slate-800">{title}</p>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-semibold text-slate-900">{value}</span>
          <span className="text-xs text-slate-500">{description}</span>
        </div>
      </div>
    </GlassCard>
  );
};
