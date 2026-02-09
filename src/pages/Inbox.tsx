import { useState } from 'react';
import ThreadDetail from '../components/inbox/ThreadDetail';
import ThreadList from '../components/inbox/ThreadList';
import { mockThreads } from '../lib/constants';

const Inbox = () => {
  const [showExampleInbox, setShowExampleInbox] = useState(false);
  const [selectedId, setSelectedId] = useState(mockThreads[0]?.id ?? '');
  const activeThread = mockThreads.find((thread) => thread.id === selectedId);

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold theme-text-primary">Inbox</h1>
          <p className="text-sm theme-text-muted">Prioritize client requests with AI-supported triage.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            className="button-outline flex items-center gap-2 rounded-full border px-3 py-2 text-sm font-medium uppercase tracking-[0.2em]"
            type="button"
            onClick={() => setShowExampleInbox((prev) => !prev)}
            aria-pressed={showExampleInbox}
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-xs font-semibold">
              EG
            </span>
            <span>{showExampleInbox ? 'Hide example' : 'Show example'}</span>
          </button>
          {showExampleInbox ? (
            <button className="button-outline rounded-full border px-4 py-2 text-sm">New workflow</button>
          ) : null}
        </div>
      </div>
      {showExampleInbox ? (
        <section className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
          <div className="space-y-4">
            <ThreadList threads={mockThreads} selectedId={selectedId} onSelect={setSelectedId} />
          </div>
          <div className="h-full">
            <ThreadDetail thread={activeThread} />
          </div>
        </section>
      ) : (
        <div className="flex min-h-[420px] flex-col items-center justify-center gap-6 rounded-3xl border border-dashed border-white/10 bg-white/5 p-8 text-center">
          <div className="space-y-2">
            <h2 className="text-xl font-semibold theme-text-primary">Connect your email to XProFlow</h2>
            <p className="text-sm theme-text-muted">
              Link your inbox to start triaging messages and drafting responses with AI.
            </p>
          </div>
          <button className="button-primary rounded-full px-6 py-3 text-sm font-semibold" type="button">
            Connect your email to XProFlow
          </button>
        </div>
      )}
    </section>
  );
};

export default Inbox;
