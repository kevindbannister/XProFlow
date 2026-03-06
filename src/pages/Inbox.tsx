import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import Card from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { api } from '../lib/api';
import { apiBaseUrl } from '../config/api';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import { GroupedInboxResponse, InboxFolder, InboxMessage } from '../../shared/types/inbox';

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
  const { gmailConnected, gmailEmail, isLoading: isAuthLoading, refreshSession } = useAuth();

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
    if (gmailConnected) {
      void fetchInbox();
    } else {
      setGroups(emptyGroups);
    }
  }, [fetchInbox, gmailConnected]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const connected = params.get('connected');
    if (connected === 'gmail') {
      const message = params.get('message') || 'Gmail connected successfully.';
      setSuccessMessage(message);
      void refreshSession();
      navigate('/inbox', { replace: true });
    }
  }, [location.search, navigate, refreshSession]);

  const handleSync = async () => {
    if (!gmailConnected) {
      setError('Connect Gmail before syncing.');
      return;
    }

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

  const isConnected = gmailConnected;
  const isLoadingState = isAuthLoading || (isConnected && isLoading);

  return (
    <section className="mx-auto max-w-4xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800 dark:text-slate-100">Inbox</h1>
          <p className="text-sm text-slate-500">
            Keep your Gmail inbox synced and prioritized in one view.
          </p>
          <p className="mt-2 text-xs font-medium text-slate-500 dark:text-slate-300">
            Gmail: {isConnected ? `Connected${gmailEmail ? ` • ${gmailEmail}` : ''}` : 'Not connected'}
          </p>
        </div>
        {isConnected ? (
          <Button
            variant="outline"
            size="sm"
            type="button"
            onClick={handleSync}
            disabled={isSyncing}
          >
            {isSyncing ? 'Syncing…' : 'Sync'}
          </Button>
        ) : null}
      </div>

      {error ? (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-900 dark:bg-rose-950 dark:text-rose-200">
          {error}
        </div>
      ) : null}

      {isLoadingState ? (
        <Card className="p-8">
          <div className="animate-pulse space-y-4">
            <div className="h-4 w-40 rounded-full bg-slate-100" />
            <div className="h-3 w-64 rounded-full bg-slate-100" />
            <div className="h-24 w-full rounded-2xl bg-slate-100" />
          </div>
        </Card>
      ) : !isConnected ? (
        <Card className="p-8 text-center sm:p-12">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Connect your Gmail</h2>
          <p className="mt-3 text-sm text-slate-500 dark:text-slate-300">
            To sync and prioritise your inbox, connect your Gmail account.
          </p>
          <Button
            type="button"
            className="mt-6"
            onClick={async () => {
              const {
                data: { session }
              } = await supabase.auth.getSession();

              if (!session?.access_token) {
                alert('Not authenticated');
                return;
              }

              window.location.href = `${apiBaseUrl}/auth/google?token=${session.access_token}`;
            }}
          >
            Connect Gmail
          </Button>
        </Card>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
          <Card className="p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">Folders</p>
            <div className="mt-4 space-y-1">
              {folders.map((folder, index) => (
                <button
                  key={`${folder.label}-${index}`}
                  type="button"
                  onClick={() => setSelectedFolder(folder.id)}
                  className={`flex w-full items-center justify-between rounded-2xl px-3 py-2 text-left text-sm font-medium transition ${
                    selectedFolder === folder.id
                      ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                      : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                  }`}
                >
                  <span>{folder.label}</span>
                </button>
              ))}
            </div>
          </Card>

          <div className="space-y-6">
            <Card className="p-4">
              <div className="relative">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search or ask XProFlow a question"
                  className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-3 text-sm text-slate-700 outline-none transition focus:border-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                />
              </div>
            </Card>

            {successMessage ? (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-200">
                {successMessage}
              </div>
            ) : null}
            {isLoading ? (
              <p className="text-sm text-slate-500 dark:text-slate-300">Loading inbox…</p>
            ) : (
              <div className="space-y-6">
                {sections.map((section) => (
                  <div key={section.key} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
                        {section.title}
                      </h2>
                      <span className="text-xs text-slate-400 dark:text-slate-500">
                        {section.messages.length} messages
                      </span>
                    </div>
                    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
                      {section.messages.length === 0 ? (
                        <div className="px-6 py-8 text-sm text-slate-400 dark:text-slate-500">
                          No messages in this section.
                        </div>
                      ) : (
                        <div className="divide-y divide-slate-200/70 dark:divide-slate-800">
                          {section.messages.map((message) => (
                            <div
                              key={message.external_id}
                              className="flex items-center gap-4 px-6 py-4 transition hover:bg-slate-50 dark:hover:bg-slate-900"
                            >
                              <span
                                className={`h-2 w-2 flex-shrink-0 rounded-full ${
                                  message.is_unread ? 'bg-sky-500' : 'bg-slate-200'
                                }`}
                              />
                              <div className="min-w-0 flex-1 space-y-1">
                                <div className="flex flex-wrap items-center gap-2">
                                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                                    {message.from_name || message.from_email || 'Unknown'}
                                  </p>
                                  <span className="hidden h-1 w-1 rounded-full bg-slate-300 dark:bg-slate-600 sm:inline-block" />
                                  <p className="text-sm text-slate-600 dark:text-slate-300">{message.subject}</p>
                                </div>
                                <p className="truncate text-xs text-slate-400 dark:text-slate-500">
                                  {message.snippet}
                                </p>
                              </div>
                              <div className="flex flex-col items-end gap-2 text-right">
                                <span className="text-xs font-medium text-slate-400 dark:text-slate-500">
                                  {formatTime(message)}
                                </span>
                                {message.status && message.status !== 'NONE' ? (
                                  <span
                                    className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide ${
                                      statusStyles[message.status] ||
                                      'bg-slate-100 text-slate-600'
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
      )}
    </section>
  );
};

export default Inbox;
