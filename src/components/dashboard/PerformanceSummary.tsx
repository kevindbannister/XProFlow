import { MailCheck, PoundSterling, Timer } from 'lucide-react';
import { dashboardStats } from '../../lib/mockData';
import { GlassCard } from '../ui/GlassCard';
import { SectionTitle } from '../ui/SectionTitle';
import { StatCard } from '../ui/StatCard';

const iconMap = {
  emails: MailCheck,
  time: Timer,
  cost: PoundSterling
};

const PerformanceSummary = () => {
  return (
    <GlassCard padding="lg" className="space-y-6">
      <SectionTitle title="Performance Summary" />
      <div className="grid gap-4 md:grid-cols-3">
        {dashboardStats.map((stat) => {
          const Icon = iconMap[stat.id as keyof typeof iconMap];
          return (
            <StatCard
              key={stat.id}
              icon={<Icon className="h-5 w-5" />}
              label={stat.label}
              value={stat.value}
            />
          );
        })}
      </div>
    </GlassCard>
  );
};

export default PerformanceSummary;
