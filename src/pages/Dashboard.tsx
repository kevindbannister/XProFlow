import EmailMakeupChart from '../components/dashboard/EmailMakeupChart';
import PerformanceSummary from '../components/dashboard/PerformanceSummary';
import SentEmailsCard from '../components/dashboard/SentEmailsCard';
import WritesLikeYouCard from '../components/dashboard/WritesLikeYouCard';
import { GlassCard } from '../components/ui/GlassCard';
import { PageHeader } from '../components/ui/PageHeader';

const Dashboard = () => {
  return (
    <section className="space-y-6">
      <PageHeader title="Dashboard" subtitle="Your XProFlow performance overview" />

      <PerformanceSummary />

      <div className="grid gap-6 lg:grid-cols-[1.6fr_0.8fr]">
        <EmailMakeupChart />
        <div className="grid gap-6">
          <WritesLikeYouCard />
          <SentEmailsCard />
          <GlassCard padding="md" className="space-y-2">
            <p className="text-sm font-semibold text-slate-800">Coming soon</p>
            <p className="text-xs text-slate-500">
              Upcoming tasks, top clients, and advanced routing insights will appear here.
            </p>
          </GlassCard>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
