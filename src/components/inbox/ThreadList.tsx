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
          className={`w-full rounded-xl border p-4 text-left transition ${
            selectedId === thread.id
              ? 'border-emerald-400/80 bg-emerald-500/10'
              : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white">{thread.subject}</h3>
            <span className="text-xs text-slate-400">{thread.updatedAt}</span>
          </div>
          <p className="mt-2 text-xs uppercase tracking-wide text-slate-400">{thread.client}</p>
          <p className="mt-2 text-sm text-slate-300">{thread.preview}</p>
          <div className="mt-3">
            <StatusBadge status={thread.status} />
          </div>
        </button>
      ))}
    </div>
  );
};

export default ThreadList;
