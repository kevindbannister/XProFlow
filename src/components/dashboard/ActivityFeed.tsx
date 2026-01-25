import Card from '../ui/Card';

type ActivityItem = {
  time: string;
  text: string;
};

type ActivityFeedProps = {
  items: ActivityItem[];
};

const ActivityFeed = ({ items }: ActivityFeedProps) => {
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <Card key={`${item.time}-${item.text}`} className="flex items-start justify-between gap-6 p-4">
          <p className="text-sm text-slate-700">{item.text}</p>
          <span className="whitespace-nowrap text-xs font-medium text-slate-400">{item.time}</span>
        </Card>
      ))}
    </div>
  );
};

export default ActivityFeed;
