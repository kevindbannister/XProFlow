import type { InboxThread } from '../../types/inbox';
import StatusBadge from '../ui/StatusBadge';

interface ThreadListProps {
  threads: InboxThread[];
  selectedId: string;
  onSelect: (id: string) => void;
}

const ThreadList = ({ threads, selectedId, onSelect }: ThreadListProps) => {
  return (
    <div className="space-y-3">
      {threads.map((thread) => (
        <button
          key={thread.id}
          type="button"
          onClick={() => onSelect(thread.id)}
          className={`thread-card w-full rounded-xl border p-4 text-left transition ${
            selectedId === thread.id ? 'thread-card-active' : ''
          }`}
        >
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold theme-text-primary">{thread.subject}</h3>
            <span className="text-xs theme-text-subtle">{thread.updatedAt}</span>
          </div>
          <p className="mt-2 text-xs uppercase tracking-wide theme-text-subtle">{thread.client}</p>
          <p className="mt-2 text-sm theme-text-secondary">{thread.preview}</p>
          <div className="mt-3">
            <StatusBadge status={thread.status} />
          </div>
        </button>
      ))}
    </div>
  );
};

export default ThreadList;
