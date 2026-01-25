import type { InboxThread } from '../../types/inbox';
import StatusBadge from '../ui/StatusBadge';

interface ThreadDetailProps {
  thread?: InboxThread;
}

const ThreadDetail = ({ thread }: ThreadDetailProps) => {
  if (!thread) {
    return (
      <div className="flex h-full flex-col items-center justify-center rounded-xl border border-dashed border-slate-800 bg-slate-900/40 p-8 text-center">
        <p className="text-sm text-slate-400">Select a thread to see details.</p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col gap-6 rounded-xl border border-slate-800 bg-slate-900/60 p-6">
      <div>
        <p className="text-xs uppercase tracking-widest text-slate-400">Thread detail</p>
        <h2 className="text-xl font-semibold text-white">{thread.subject}</h2>
        <p className="mt-2 text-sm text-slate-300">{thread.client}</p>
      </div>
      <div className="space-y-3 text-sm text-slate-300">
        <div className="flex items-center gap-2">
          <span>Status:</span>
          <StatusBadge status={thread.status} />
        </div>
        <p>Last updated: {thread.updatedAt}</p>
        <p>
          Placeholder for full message history, attachments, and AI summaries. This panel will host
          the thread-level triage workflow once the backend is connected.
        </p>
      </div>
      <div className="mt-auto rounded-lg border border-slate-800 bg-slate-950/70 p-4 text-xs text-slate-400">
        Next action: Draft response and request missing documents.
      </div>
    </div>
  );
};

export default ThreadDetail;
