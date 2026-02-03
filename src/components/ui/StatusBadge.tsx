import type { InboxThreadStatus } from '../../types/inbox';

interface StatusBadgeProps {
  status: InboxThreadStatus;
}

const statusStyles: Record<InboxThreadStatus, string> = {
  'Needs reply': 'status-needs-reply',
  'Waiting on client': 'status-waiting',
  Escalated: 'status-escalated'
};

const StatusBadge = ({ status }: StatusBadgeProps) => {
  return (
    <span
      className={`status-badge inline-flex items-center rounded-full border px-2 py-1 text-xs ${statusStyles[status]}`}
    >
      {status}
    </span>
  );
};

export default StatusBadge;
