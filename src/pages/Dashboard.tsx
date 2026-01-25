import ActivityFeed from '../components/dashboard/ActivityFeed';
import StatChip from '../components/dashboard/StatChip';
import Card from '../components/ui/Card';

const Dashboard = () => {
  const activityItems = [
    { time: '01:11 PM', text: 'You are working in the XProFlow frontend.' },
    { time: '01:24 PM', text: 'Follow /codex/WORKING_RULES.md.' },
    { time: '01:32 PM', text: 'Implement ONLY the task below.' },
    { time: '01:45 PM', text: 'Keep edits minimal.' },
    { time: '02:02 PM', text: 'Output only changed files.' }
  ];

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold text-slate-900">Welcome back, Kev</h1>
        <div className="flex flex-wrap items-center gap-2">
          <StatChip label="1 week" />
          <StatChip label="167 words" />
          <StatChip label="89 WPM" />
        </div>
      </div>

      <Card className="border-amber-200 bg-[#fff7db]">
        <div className="flex flex-col gap-3">
          <h2 className="text-lg font-semibold text-slate-900">Make XProFlow sound like you</h2>
          <p className="text-sm text-slate-600">
            Onboard your writing samples to teach XProFlow your tone, phrasing, and style
            preferences so every response sounds authentically yours.
          </p>
          <div>
            <button className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white">
              Start now
            </button>
          </div>
        </div>
      </Card>

      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-slate-900">Today</h3>
        <ActivityFeed items={activityItems} />
      </div>
    </section>
  );
};

export default Dashboard;
