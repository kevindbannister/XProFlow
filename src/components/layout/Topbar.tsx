import { TopStatsPills } from '../ui/TopStatsPills';

type TopbarProps = {
  title?: string;
};

const Topbar = ({ title }: TopbarProps) => {
  const topStats = {
    emailsProcessed: '1,284',
    timeSaved: '14h 32m',
    costSaved: '£1,284',
  };

  return (
    <header className="topbar-surface flex items-center justify-between border-b px-8 py-4">
      <div className="theme-text-primary text-lg font-semibold">{title}</div>
      <div className="flex items-center gap-3">
        <TopStatsPills stats={topStats} />
      </div>
    </header>
  );
};

export default Topbar;
