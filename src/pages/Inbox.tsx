import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { api } from '../lib/api';
import type { GroupedInboxResponse, InboxFolder, InboxMessage } from '../../shared/types/inbox';

const folders: { id: InboxFolder; label: string }[] = [
  { id: 'INBOX', label: 'Main' },
  { id: 'PROMOTIONS', label: 'Promotions' },
  { id: 'DRAFT', label: 'Drafts' },
  { id: 'ALL', label: 'Recents' },
  { id: 'SPAM', label: 'Spam' },
  { id: 'TRASH', label: 'Trash' },
  { id: 'ALL', label: 'All' }
];

const statusStyles: Record<string, string> = {
  READ: 'bg-slate-100 text-slate-600',
  REPLIED: 'bg-violet-100 text-violet-700',
  DRAFT: 'bg-amber-100 text-amber-700',
  COMPLETE: 'bg-sky-100 text-sky-700',
  ACTIVE: 'bg-emerald-100 text-emerald-700',
  ORGANIZED: 'bg-teal-100 text-teal-700'
};

const emptyGroups: GroupedInboxResponse = { today: [], thisMonth: [], older: [] };

const formatTime = (message: InboxMessage) => {
  if (message.received_at) {
    const date = new Date(message.received_at);
    const today = new Date();
    if (
      date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth() &&
      date.getDate() === today.getDate()
    ) {
      return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    }
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  }
  return '';
};

const formatMonthTitle = (messages: InboxMessage[]) => {
  const date = messages[0]?.received_at ? new Date(messages[0].received_at) : new Date();
  return date.toLocaleDateString([], { month: 'long', year: 'numeric' });
};

const Inbox = () => {
  const [selectedFolder, setSelectedFolder] = useState<InboxFolder>('INBOX');
  const [groups, setGroups] = useState<GroupedInboxResponse>(emptyGroups);
  const [isLoading, setIsLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  const fetchInbox = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get<GroupedInboxResponse>(
        `/api/inbox?folder=${selectedFolder}`
      );
      setGroups(response);
    } catch (err) {
      console.error('Failed to load inbox', err);
      setError('Unable to load inbox.');
    } finally {
      setIsLoading(false);
    }
  }, [selectedFolder]);

  useEffect(() => {
    void fetchInbox();
  }, [fetchInbox]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const connected = params.get('connected');
    if (connected === 'gmail') {
      const message = params.get('message') || 'Gmail connected successfully.';
      setSuccessMessage(message);
      navigate('/inbox', { replace: true });
    }
  }, [location.search, navigate]);

  const handleSync = async () => {
    setIsSyncing(true);
    setError(null);
    try {
      await api.post(`/api/gmail/sync?folder=${selectedFolder}`);
      await fetchInbox();
    } catch (err) {
      console.error('Failed to sync inbox', err);
      setError('Unable to sync Gmail.');
    } finally {
      setIsSyncing(false);
    }
  };

  const sections = useMemo(
    () => [
      { title: 'Today', key: 'today', messages: groups.today },
      {
        title: formatMonthTitle(groups.thisMonth),
        key: 'thisMonth',
        messages: groups.thisMonth
      },
      { title: 'Older', key: 'older', messages: groups.older }
    ],
    [groups]
  );

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Inbox</h1>
          <p className="text-sm text-slate-500">
            Keep your Gmail inbox synced and prioritized in one view.
          </p>
        </div>
        <button
          className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:border-slate-300"
          type="button"
          onClick={handleSync}
          disabled={isSyncing}
        >
          {isSyncing ? 'Syncing…' : 'Sync'}
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
        <aside className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Folders</p>
          <div className="mt-4 space-y-1">
            {folders.map((folder, index) => (
              <button
                key={`${folder.label}-${index}`}
                type="button"
                onClick={() => setSelectedFolder(folder.id)}
                className={`flex w-full items-center justify-between rounded-2xl px-3 py-2 text-left text-sm font-medium transition ${
                  selectedFolder === folder.id
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <span>{folder.label}</span>
              </button>
            ))}
          </div>
        </aside>

        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search or ask XProFlow a question"
                className="w-full rounded-2xl border border-transparent bg-slate-100/80 py-3 pl-11 pr-4 text-sm text-slate-700 outline-none transition focus:border-slate-200 focus:bg-white focus:ring-2 focus:ring-sky-100"
              />
            </div>
          </div>

          {successMessage ? (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              {successMessage}
            </div>
          ) : null}

          {error ? <p className="text-sm text-rose-500">{error}</p> : null}

          {isLoading ? (
            <p className="text-sm text-slate-500">Loading inbox…</p>
          ) : (
            <div className="space-y-6">
              {sections.map((section) => (
                <div key={section.key} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      {section.title}
                    </h2>
                    <span className="text-xs text-slate-400">
                      {section.messages.length} messages
                    </span>
                  </div>
                  <div className="rounded-3xl border border-slate-200 bg-white shadow-sm">
                    {section.messages.length === 0 ? (
                      <div className="px-6 py-8 text-sm text-slate-400">
                        No messages in this section.
                      </div>
                    ) : (
                      <div className="divide-y divide-slate-200/70">
                        {section.messages.map((message) => (
                          <div
                            key={message.external_id}
                            className="flex items-center gap-4 px-6 py-4 transition hover:bg-slate-50"
                          >
                            <span
                              className={`h-2 w-2 flex-shrink-0 rounded-full ${
                                message.is_unread ? 'bg-sky-500' : 'bg-slate-200'
                              }`}
                            />
                            <div className="min-w-0 flex-1 space-y-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <p className="text-sm font-semibold text-slate-900">
                                  {message.from_name || message.from_email || 'Unknown'}
                                </p>
                                <span className="hidden h-1 w-1 rounded-full bg-slate-300 sm:inline-block" />
                                <p className="text-sm text-slate-600">{message.subject}</p>
                              </div>
                              <p className="truncate text-xs text-slate-400">{message.snippet}</p>
                            </div>
                            <div className="flex flex-col items-end gap-2 text-right">
                              <span className="text-xs font-medium text-slate-400">
                                {formatTime(message)}
                              </span>
                              {message.status && message.status !== 'NONE' ? (
                                <span
                                  className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide ${
                                    statusStyles[message.status] || 'bg-slate-100 text-slate-600'
                                  }`}
                                >
                                  {message.status.toLowerCase()}
                                </span>
                              ) : null}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Inbox;
