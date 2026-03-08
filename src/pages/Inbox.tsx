import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
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
    <section className="max-w-4xl space-y-6">
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
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
          <div className="border-b border-slate-200 bg-slate-50/80 px-4 py-3 dark:border-slate-800 dark:bg-slate-900/70">
            <div className="flex flex-wrap gap-2">
              {folders.map((folder, index) => (
                <button
                  key={`${folder.label}-${index}`}
                  type="button"
                  onClick={() => setSelectedFolder(folder.id)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                    selectedFolder === folder.id
                      ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                      : 'bg-white text-slate-500 hover:bg-slate-100 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800'
                  }`}
                >
                  {folder.label}
                </button>
              ))}
            </div>
          </div>

          {successMessage ? (
            <div className="border-b border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-200">
              {successMessage}
            </div>
          ) : null}

          {isLoading ? (
            <p className="px-6 py-8 text-sm text-slate-500 dark:text-slate-300">Loading inbox…</p>
          ) : (
            <div>
              {sections.map((section) => (
                <div key={section.key} className="border-b border-slate-200 last:border-b-0 dark:border-slate-800">
                  <div className="px-6 pb-3 pt-6 text-xl font-normal text-slate-500 dark:text-slate-300">
                    {section.title}
                  </div>
                  {section.messages.length === 0 ? (
                    <div className="px-6 pb-6 text-sm text-slate-400 dark:text-slate-500">
                      No messages in this section.
                    </div>
                  ) : (
                    <div className="divide-y divide-slate-200/80 dark:divide-slate-800">
                      {section.messages.map((message) => (
                        <div
                          key={message.external_id}
                          className="grid grid-cols-[minmax(0,1fr)_auto] gap-4 px-6 py-4 transition hover:bg-slate-50 dark:hover:bg-slate-900"
                        >
                          <div className="min-w-0 flex items-center gap-4">
                            <p className="w-44 shrink-0 truncate text-sm font-medium text-slate-700 dark:text-slate-200">
                              {message.from_name || message.from_email || 'Unknown'}
                            </p>
                            <div className="min-w-0 flex items-center gap-2 text-sm">
                              <p className="truncate text-slate-800 dark:text-slate-100">{message.subject}</p>
                              {message.snippet ? (
                                <p className="hidden truncate text-slate-400 sm:block dark:text-slate-500">
                                  — {message.snippet}
                                </p>
                              ) : null}
                            </div>
                          </div>
                          <div className="flex items-center gap-3 text-right">
                            {message.status && message.status !== 'NONE' ? (
                              <span
                                className={`rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
                                  statusStyles[message.status] || 'bg-slate-100 text-slate-600'
                                }`}
                              >
                                {message.status}
                              </span>
                            ) : null}
                            <span className="w-16 text-xs font-semibold text-slate-500 dark:text-slate-400">
                              {formatTime(message)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
};

export default Inbox;
