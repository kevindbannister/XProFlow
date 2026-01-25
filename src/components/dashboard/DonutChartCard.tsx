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
                <span className="text-slate-600">{entry.name}</span>
              </div>
              <span className="font-semibold text-slate-700">{entry.value}%</span>
            </div>
          ))}
          <div className="mt-2 rounded-2xl border border-blue-100/60 bg-blue-50/60 px-4 py-3 text-xs text-slate-500">
            Awaiting Response, FYI, and Marketing are updated weekly.
          </div>
        </div>
      </div>
      <div className="flex flex-wrap gap-3">
        {data.map((entry) => (
          <span
            key={entry.name}
            className="inline-flex items-center gap-2 rounded-full border border-blue-100/70 bg-white/70 px-3 py-1 text-xs text-slate-600"
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
