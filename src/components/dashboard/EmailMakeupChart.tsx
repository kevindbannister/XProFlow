import { emailMakeup } from '../../lib/mockData';
import DonutChartCard from './DonutChartCard';

const EmailMakeupChart = () => {
  return (
    <DonutChartCard
      title="Your Email Makeup"
      subtitle="Breakdown of emails received in the last 30 days"
      data={emailMakeup}
    />
  );
};

export default EmailMakeupChart;
