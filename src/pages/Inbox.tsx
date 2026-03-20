import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Card from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { FilterPill } from '../components/ui/FilterPill';
import { PageHeader } from '../components/ui/PageHeader';
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
  READ: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300',
  REPLIED: 'bg-violet-100 text-violet-700 dark:bg-violet-950/50 dark:text-violet-300',
  DRAFT: 'bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300',
  COMPLETE: 'bg-sky-100 text-sky-700 dark:bg-sky-950/50 dark:text-sky-300',
  ACTIVE: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300',
  ORGANIZED: 'bg-teal-100 text-teal-700 dark:bg-teal-950/50 dark:text-teal-300'
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
    <section className="flex w-full max-w-6xl flex-col gap-5">
      <PageHeader
        title="Inbox"
        subtitle="Keep Gmail synced, categorized, and reviewable from one shared workflow view."
        action={(
          <div className="flex flex-wrap items-center gap-2">
            <FilterPill active={isConnected}>
              {isConnected ? `Connected${gmailEmail ? ` • ${gmailEmail}` : ''}` : 'Not connected'}
            </FilterPill>
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
        )}
      />

      <div className="rounded-[16px] border border-[rgba(18,29,49,0.06)] bg-white shadow-page dark:border-white/10 dark:bg-[#141d2c]">
        {isConnected ? (
          <div className="border-b border-[rgba(18,29,49,0.06)] px-6 py-4 dark:border-white/10">
            <div className="flex flex-wrap gap-2">
              {folders.map((folder, index) => (
                <FilterPill
                  key={`${folder.label}-${index}`}
                  active={selectedFolder === folder.id}
                  onClick={() => setSelectedFolder(folder.id)}
                >
                  {folder.label}
                </FilterPill>
              ))}
            </div>
          </div>
        ) : null}

        {error ? (
          <div className="border-b border-rose-100 bg-rose-50 px-6 py-3 text-sm text-rose-700 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-200">
            {error}
          </div>
        ) : null}

        {successMessage ? (
          <div className="border-b border-emerald-100 bg-emerald-50 px-6 py-3 text-sm text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-200">
            {successMessage}
          </div>
        ) : null}

        {isLoadingState ? (
          <Card className="m-6 p-8">
            <div className="animate-pulse space-y-4">
              <div className="h-4 w-40 rounded-full bg-surface-hover" />
              <div className="h-3 w-64 rounded-full bg-surface-hover" />
              <div className="h-24 w-full rounded-[12px] bg-surface-hover" />
            </div>
          </Card>
        ) : !isConnected ? (
          <div className="px-6 pb-12">
            <EmptyState
              title="Connect your Gmail"
              body="To sync and prioritize your inbox, connect your Gmail account and bring live threads into the dashboard."
              action={(
                <Button
                  type="button"
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
              )}
            />
          </div>
        ) : (
          <div>
            {sections.map((section) => (
              <div key={section.key} className="border-b border-[rgba(18,29,49,0.06)] last:border-b-0 dark:border-white/10">
                <div className="px-6 pb-3 pt-6 text-[20px] font-medium text-content-primary">
                  {section.title}
                </div>
                {section.messages.length === 0 ? (
                  <div className="px-6 pb-6 text-sm text-content-secondary">
                    No messages in this section.
                  </div>
                ) : (
                  <div>
                    {section.messages.map((message) => (
                      <div
                        key={message.external_id}
                        className="grid grid-cols-[minmax(0,1fr)_auto] gap-4 px-6 py-4 transition hover:bg-surface-page"
                      >
                        <div className="min-w-0 flex items-center gap-4">
                          <p className="w-44 shrink-0 truncate text-sm font-medium text-content-primary">
                            {message.from_name || message.from_email || 'Unknown'}
                          </p>
                          <div className="min-w-0 flex items-center gap-2 text-sm">
                            <p className="truncate text-content-primary">{message.subject}</p>
                            {message.snippet ? (
                              <p className="hidden truncate text-content-secondary sm:block">
                                {message.snippet}
                              </p>
                            ) : null}
                          </div>
                        </div>
                        <div className="flex items-center gap-3 text-right">
                          {message.status && message.status !== 'NONE' ? (
                            <span
                              className={`rounded-full px-2 py-1 text-[10px] font-semibold uppercase tracking-wide ${
                                statusStyles[message.status] || 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                              }`}
                            >
                              {message.status}
                            </span>
                          ) : null}
                          <span className="w-16 text-xs font-semibold text-content-secondary">
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
    </section>
  );
};

export default Inbox;
