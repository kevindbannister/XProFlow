import { Send } from 'lucide-react';
import { dashboardHighlights } from '../../lib/mockData';
import { MetricTile } from '../ui/MetricTile';

const SentEmailsCard = () => {
  const highlight = dashboardHighlights.find((item) => item.id === 'sent');

  if (!highlight) {
    return null;
  }

  return (
    <MetricTile
      icon={<Send className="h-5 w-5" />}
      title={highlight.title}
      value={highlight.value}
      description={highlight.description}
    />
  );
};

export default SentEmailsCard;
