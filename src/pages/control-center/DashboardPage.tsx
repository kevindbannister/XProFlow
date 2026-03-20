import { Activity, Bot, ShieldCheck } from 'lucide-react';
import { FilterPill } from '../../components/ui/FilterPill';
import { PageHeader } from '../../components/ui/PageHeader';
import { StatCard } from '../../components/ui/StatCard';
import Card from '../../components/ui/Card';

const DashboardPage = () => {
  return (
    <div className="flex w-full max-w-6xl flex-col gap-5">
      <PageHeader
        title="Dashboard"
        subtitle="Monitor automation performance, coverage, and the health of every inbox workflow."
        action={(
          <div className="flex flex-wrap items-center gap-2">
            <FilterPill active>Last 30 days</FilterPill>
            <FilterPill>Email ops</FilterPill>
          </div>
        )}
      />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <StatCard label="Automations active" value="12" icon={<Bot className="h-4 w-4" />} />
        <StatCard label="Drafts generated" value="284" icon={<Activity className="h-4 w-4" />} />
        <StatCard label="Rules triggered" value="96%" icon={<ShieldCheck className="h-4 w-4" />} />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <div className="space-y-5">
            <div>
              <h2 className="text-lg font-semibold text-content-primary">Workflow overview</h2>
              <p className="mt-1 text-sm text-content-secondary">A compact view of how your automation stack is performing this week.</p>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {[
                ['AI reply coverage', '88%', 'Replies drafted for high-confidence threads'],
                ['Inbox triage speed', '4m', 'Average time from receipt to categorisation'],
                ['Manual review rate', '12%', 'Threads still requiring direct human review']
              ].map(([label, value, body]) => (
                <div key={label} className="rounded-[12px] bg-surface-page p-4 shadow-card dark:bg-[#1B2636] dark:shadow-[0_18px_40px_rgba(2,6,23,0.22)]">
                  <p className="text-[12.8px] font-medium text-content-secondary">{label}</p>
                  <p className="mt-2 text-2xl font-semibold text-content-primary dark:text-[#F3F7FD]">{value}</p>
                  <p className="mt-2 text-sm text-content-secondary">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <Card className="space-y-5">
          <div>
            <h2 className="text-lg font-semibold text-content-primary">Recent activity</h2>
            <p className="mt-1 text-sm text-content-secondary">What changed across the control center most recently.</p>
          </div>
          <div className="space-y-4">
            {[
              'Categorisation rules updated for finance senders',
              'Scheduling defaults synced with primary calendar',
              'Professional context reviewed for new tone guidance'
            ].map((item) => (
              <div key={item} className="rounded-[12px] bg-surface-page p-4 text-sm text-content-primary shadow-card dark:bg-[#1B2636] dark:text-[#F3F7FD] dark:shadow-[0_18px_40px_rgba(2,6,23,0.22)]">
                {item}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
