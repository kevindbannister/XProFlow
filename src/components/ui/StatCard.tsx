import { ReactNode } from 'react';
import { GlassCard } from './GlassCard';

export type StatCardProps = {
  icon: ReactNode;
  label: string;
  value: string;
};

export const StatCard = ({ icon, label, value }: StatCardProps) => {
  return (
    <GlassCard className="flex items-center gap-4" padding="sm">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-[0_10px_20px_rgba(59,130,246,0.35)]">
        {icon}
      </div>
      <div>
        <p className="text-xl font-semibold theme-text-primary">{value}</p>
        <p className="text-xs theme-text-muted">{label}</p>
      </div>
    </GlassCard>
  );
};
