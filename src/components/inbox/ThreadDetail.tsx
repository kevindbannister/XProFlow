import type { InboxThread } from '../../types/inbox';
import StatusBadge from '../ui/StatusBadge';

interface ThreadDetailProps {
  thread?: InboxThread;
}

const ThreadDetail = ({ thread }: ThreadDetailProps) => {
  if (!thread) {
    return (
      <div className="thread-empty flex h-full flex-col items-center justify-center rounded-xl border border-dashed p-8 text-center">
        <p className="text-sm theme-text-muted">Select a thread to see details.</p>
      </div>
    );
  }

  return (
    <div className="thread-panel flex h-full flex-col gap-6 rounded-xl border p-6">
      <div>
        <p className="text-xs uppercase tracking-widest theme-text-subtle">Thread detail</p>
        <h2 className="text-xl font-semibold theme-text-primary">{thread.subject}</h2>
        <p className="mt-2 text-sm theme-text-secondary">{thread.client}</p>
      </div>
      <div className="space-y-3 text-sm theme-text-secondary">
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
      <div className="thread-callout mt-auto rounded-lg border p-4 text-xs theme-text-muted">
        Next action: Draft response and request missing documents.
      </div>
    </div>
  );
};

export default ThreadDetail;
