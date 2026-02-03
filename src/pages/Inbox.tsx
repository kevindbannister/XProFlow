import { useState } from 'react';
import ThreadDetail from '../components/inbox/ThreadDetail';
import ThreadList from '../components/inbox/ThreadList';
import { mockThreads } from '../lib/constants';

const Inbox = () => {
  const [selectedId, setSelectedId] = useState(mockThreads[0]?.id ?? '');
  const activeThread = mockThreads.find((thread) => thread.id === selectedId);

  return (
    <section className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold theme-text-primary">Inbox</h1>
            <p className="text-sm theme-text-muted">Prioritize client requests with AI-supported triage.</p>
          </div>
          <button className="button-outline rounded-full border px-4 py-2 text-sm">
            New workflow
          </button>
        </div>
        <ThreadList threads={mockThreads} selectedId={selectedId} onSelect={setSelectedId} />
      </div>
      <div className="h-full">
        <ThreadDetail thread={activeThread} />
      </div>
    </section>
  );
};

export default Inbox;
