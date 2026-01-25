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
            <h1 className="text-2xl font-semibold text-white">Inbox</h1>
            <p className="text-sm text-slate-300">Prioritize client requests with AI-supported triage.</p>
          </div>
          <button className="rounded-full border border-slate-800 bg-slate-900 px-4 py-2 text-sm text-slate-200">
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
