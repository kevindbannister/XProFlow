import PerformanceSummary from '../components/dashboard/PerformanceSummary';
import SentEmailsCard from '../components/dashboard/SentEmailsCard';
import WritesLikeYouCard from '../components/dashboard/WritesLikeYouCard';
import { GlassCard } from '../components/ui/GlassCard';
import { SectionTitle } from '../components/ui/SectionTitle';
import { emailMakeup } from '../lib/mockData';

const Dashboard = () => {
  const donutBackground = `conic-gradient(${emailMakeup[0].color} 0deg 162deg, ${
    emailMakeup[1].color
  } 162deg 280.8deg, ${emailMakeup[2].color} 280.8deg 342deg, #E2E8F0 342deg 360deg)`;

  return (
    <section className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold theme-text-primary">Dashboard</h1>
        <p className="text-sm theme-text-muted">Your XProFlow performance overview</p>
      </div>

      <PerformanceSummary />

      <GlassCard padding="lg" className="space-y-6">
        <SectionTitle
          title="Your Email Makeup"
          subtitle="Breakdown of emails received in the last 30 days"
        />
        <div className="grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            <div className="flex items-center justify-center">
              <div className="relative h-44 w-44">
                <div className="absolute inset-0 rounded-full" style={{ background: donutBackground }} />
                <div className="absolute inset-6 rounded-full bg-white shadow-inner" />
              </div>
            </div>
            <div className="space-y-4">
              {emailMakeup.map((entry) => (
                <div key={entry.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full" style={{ backgroundColor: entry.color }} />
                    <span className="theme-text-secondary">{entry.name}</span>
                  </div>
                  <span className="font-semibold theme-text-primary">{entry.value}%</span>
                </div>
              ))}
            </div>
          </div>
          <div className="grid gap-4">
            <WritesLikeYouCard />
            <SentEmailsCard />
          </div>
        </div>
      </GlassCard>
    </section>
  );
};

export default Dashboard;
