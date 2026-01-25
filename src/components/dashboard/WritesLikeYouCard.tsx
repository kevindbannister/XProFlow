import { Sparkles } from 'lucide-react';
import { dashboardHighlights } from '../../lib/mockData';
import { MetricTile } from '../ui/MetricTile';

const WritesLikeYouCard = () => {
  const highlight = dashboardHighlights.find((item) => item.id === 'writes');

  if (!highlight) {
    return null;
  }

  return (
    <MetricTile
      icon={<Sparkles className="h-5 w-5" />}
      title={highlight.title}
      value={highlight.value}
      description={highlight.description}
    />
  );
};

export default WritesLikeYouCard;
