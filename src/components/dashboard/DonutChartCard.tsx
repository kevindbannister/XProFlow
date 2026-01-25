import { Pie, PieChart, Cell, ResponsiveContainer } from 'recharts';
import { GlassCard } from '../ui/GlassCard';
import { SectionTitle } from '../ui/SectionTitle';

export type DonutSlice = {
  name: string;
  value: number;
  color: string;
};

type DonutChartCardProps = {
  title: string;
  subtitle: string;
  data: DonutSlice[];
};

const DonutChartCard = ({ title, subtitle, data }: DonutChartCardProps) => {
  return (
    <GlassCard padding="lg" className="space-y-6">
      <SectionTitle title={title} subtitle={subtitle} />
      <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                innerRadius={60}
                outerRadius={90}
                paddingAngle={3}
                dataKey="value"
                startAngle={90}
                endAngle={-270}
              >
                {data.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} stroke="transparent" />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex flex-col gap-4">
          {data.map((entry) => (
            <div key={entry.name} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <span
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="theme-text-secondary">{entry.name}</span>
              </div>
              <span className="font-semibold theme-text-primary">{entry.value}%</span>
            </div>
          ))}
          <div className="mt-2 rounded-2xl border border-blue-100/60 bg-blue-50/60 px-4 py-3 text-xs theme-text-muted">
            Awaiting Response, FYI, and Marketing are updated weekly.
          </div>
        </div>
      </div>
      <div className="flex flex-wrap gap-3">
        {data.map((entry) => (
          <span
            key={entry.name}
            className="chip-surface inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs theme-text-secondary"
          >
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
            {entry.name}
          </span>
        ))}
      </div>
    </GlassCard>
  );
};

export default DonutChartCard;
