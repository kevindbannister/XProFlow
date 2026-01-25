import type { InboxThreadStatus } from '../../types/inbox';

interface StatusBadgeProps {
  status: InboxThreadStatus;
}

const statusStyles: Record<InboxThreadStatus, string> = {
  'Needs reply': 'border-amber-400/60 text-amber-200',
  'Waiting on client': 'border-sky-400/60 text-sky-200',
  Escalated: 'border-rose-400/60 text-rose-200'
};

const StatusBadge = ({ status }: StatusBadgeProps) => {
  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-1 text-xs ${statusStyles[status]}`}>
      {status}
    </span>
  );
};

export default StatusBadge;
