import { useEffect, useMemo, useState } from 'react';
import { ChevronRight, Plus, Search, Tag } from 'lucide-react';
import Card from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { supabase } from '../lib/supabaseClient';
import { api } from '../lib/api';

type ConnectedAccount = {
  id: string;
  email: string | null;
};

type GmailLabelRow = {
  gmail_label_id: string;
  label_name: string;
  label_type: string | null;
  is_enabled: boolean;
  color_background: string | null;
  color_text: string | null;
};

const FALLBACK_DOT_COLOR = '#64748B';
const ERROR_MESSAGE = 'Unable to update label settings.';

const logSupabaseError = (context: string, error: { code?: string | null; message?: string | null } | null) => {
  if (!error) {
    return;
  }

  console.error(`${context} (code: ${error.code ?? 'unknown'})`, error);
};

const normalizeLabels = (labels: GmailLabelRow[]) =>
  labels.map((label) => ({
    ...label,
    label_name: label.label_name || 'Unnamed label',
    is_enabled: Boolean(label.is_enabled)
  }));

const Labels = () => {
  const [labels, setLabels] = useState<GmailLabelRow[]>([]);
  const [connectedAccounts, setConnectedAccounts] = useState<ConnectedAccount[]>([]);
  const [selectedAccountId, setSelectedAccountId] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const loadLabels = async (connectedAccountId: string) => {
    if (!connectedAccountId) {
      setLabels([]);
      return;
    }

    const data = await api.get<{ labels?: GmailLabelRow[] }>(
      `/api/gmail/labels?connected_account_id=${encodeURIComponent(connectedAccountId)}`
    );

    setLabels(normalizeLabels((data.labels ?? []) as GmailLabelRow[]));
  };

  const handleRefreshLabels = async () => {
    if (!selectedAccountId) {
      return;
    }

    try {
      setIsRefreshing(true);

      await api.post('/api/gmail/labels/sync', {
        connected_account_id: selectedAccountId
      });

      await loadLabels(selectedAccountId);
    } catch (error) {
      console.error('Label refresh failed', error);
      setToastMessage(ERROR_MESSAGE);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    if (!toastMessage) {
      return;
    }

    const timeout = window.setTimeout(() => setToastMessage(''), 3000);
    return () => window.clearTimeout(timeout);
  }, [toastMessage]);

  useEffect(() => {
    let isMounted = true;

    const loadConnectedAccountsAndLabels = async () => {
      try {
        setIsLoading(true);
        const {
          data: { user },
          error: userError
        } = await supabase.auth.getUser();

        if (userError || !user) {
          logSupabaseError('Failed to load current user from Supabase auth', userError);
          if (isMounted) {
            setConnectedAccounts([]);
            setSelectedAccountId('');
            setLabels([]);
            setToastMessage(ERROR_MESSAGE);
          }
          return;
        }

        const { data: accounts, error: accountsError } = await supabase
          .from('connected_accounts')
          .select('id,email')
          .eq('provider', 'google')
          .eq('user_id', user.id)
          .order('created_at', { ascending: true });

        if (accountsError) {
          logSupabaseError('Failed to load connected Google accounts', accountsError);
          if (isMounted) {
            setToastMessage(ERROR_MESSAGE);
          }
          return;
        }

        const googleAccounts = (accounts ?? []) as ConnectedAccount[];

        if (!googleAccounts.length) {
          if (isMounted) {
            setConnectedAccounts([]);
            setSelectedAccountId('');
            setLabels([]);
          }
          return;
        }

        const defaultAccountId = googleAccounts[0].id;

        if (isMounted) {
          setConnectedAccounts(googleAccounts);
          setSelectedAccountId((currentSelected) => currentSelected || defaultAccountId);
        }
      } catch (error) {
        console.error('Failed to load label settings prerequisites:', error);
        if (isMounted) {
          setToastMessage(ERROR_MESSAGE);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadConnectedAccountsAndLabels();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!selectedAccountId) {
      return;
    }

    let isMounted = true;

    const loadLabelsForAccount = async () => {
      try {
        setIsLoading(true);
        await loadLabels(selectedAccountId);
      } catch (error) {
        console.error('Failed to load labels:', error);
        if (isMounted) {
          setToastMessage(ERROR_MESSAGE);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadLabelsForAccount();

    return () => {
      isMounted = false;
    };
  }, [selectedAccountId]);

  const enabledCount = useMemo(
    () => labels.filter((label) => Boolean(label.is_enabled)).length,
    [labels]
  );

  const visibleLabels = useMemo(() => {
    const normalizedSearch = searchQuery.trim().toLowerCase();

    if (!normalizedSearch) {
      return labels;
    }

    return labels.filter((label) => label.label_name.toLowerCase().includes(normalizedSearch));
  }, [labels, searchQuery]);

  const autoAppliedLabels = useMemo(() => visibleLabels.filter((label) => label.is_enabled).slice(0, 5), [visibleLabels]);
  const manualLabels = useMemo(
    () => visibleLabels.filter((label) => !autoAppliedLabels.some((autoLabel) => autoLabel.gmail_label_id === label.gmail_label_id)),
    [autoAppliedLabels, visibleLabels]
  );

  const toggleLabel = async (labelId: string, nextEnabled: boolean) => {
    setLabels((currentState) =>
      currentState.map((label) =>
        label.gmail_label_id === labelId ? { ...label, is_enabled: nextEnabled } : label
      )
    );

    try {
      const { error } = await supabase
        .from('gmail_labels')
        .update({ is_enabled: nextEnabled })
        .eq('connected_account_id', selectedAccountId)
        .eq('gmail_label_id', labelId);

      if (error) {
        throw error;
      }
    } catch (error) {
      logSupabaseError('Failed to update label', error as { code?: string | null; message?: string | null });
      setLabels((currentState) =>
        currentState.map((label) =>
          label.gmail_label_id === labelId ? { ...label, is_enabled: !nextEnabled } : label
        )
      );
      setToastMessage(ERROR_MESSAGE);
    }
  };

  const setAllLabels = async (enabled: boolean) => {
    const previousState = labels;
    setLabels((currentState) => currentState.map((label) => ({ ...label, is_enabled: enabled })));

    try {
      const labelIds = labels.map((label) => label.gmail_label_id);

      if (!labelIds.length) {
        return;
      }

      const { error } = await supabase
        .from('gmail_labels')
        .update({ is_enabled: enabled })
        .eq('connected_account_id', selectedAccountId)
        .in('gmail_label_id', labelIds);

      if (error) {
        throw error;
      }
    } catch (error) {
      logSupabaseError('Failed to bulk update labels', error as { code?: string | null; message?: string | null });
      setLabels(previousState);
      setToastMessage(ERROR_MESSAGE);
    }
  };

  return (
    <section className="max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800 dark:text-slate-100">Labels</h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-500 dark:text-slate-300">
            Organize your emails with labels. AI-powered labels automatically categorize incoming emails based on
            their content.
          </p>
        </div>
        <button
          type="button"
          className="rounded-full border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
          aria-label="Create label"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="search"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder="Search labels"
          className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-3 text-sm text-slate-700 outline-none transition focus:border-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
        />
      </div>

      {toastMessage ? (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-900 dark:bg-rose-950 dark:text-rose-200">
          {toastMessage}
        </div>
      ) : null}

      <Card className="space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">Auto-applied labels</h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              {enabledCount} of {labels.length} labels currently active.
            </p>
          </div>
          {connectedAccounts.length > 1 ? (
            <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
              Account
              <select
                className="rounded-lg border border-slate-300 bg-white px-2 py-1 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                value={selectedAccountId}
                onChange={(event) => setSelectedAccountId(event.target.value)}
              >
                {connectedAccounts.map((account) => (
                  <option key={account.id} value={account.id}>
                    {account.email || account.id}
                  </option>
                ))}
              </select>
            </label>
          ) : null}
          <div className="flex items-center gap-2">
            <Button
              type="button"
              size="sm"
              onClick={() => void handleRefreshLabels()}
              disabled={!selectedAccountId || isRefreshing}
            >
              {isRefreshing ? 'Refreshing...' : 'Refresh Labels'}
            </Button>
            <Button type="button" size="sm" variant="outline" onClick={() => void setAllLabels(true)} disabled={!labels.length}>
              Select all
            </Button>
            <Button type="button" size="sm" variant="outline" onClick={() => void setAllLabels(false)} disabled={!labels.length}>
              Deselect all
            </Button>
          </div>
        </div>

        {isLoading ? <p className="text-sm text-slate-600 dark:text-slate-300">Loading labels...</p> : null}
        {!isLoading && !connectedAccounts.length ? (
          <p className="text-sm text-slate-600 dark:text-slate-300">Connect Gmail first</p>
        ) : null}

        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
          {autoAppliedLabels.length ? autoAppliedLabels.map((label) => {
            const enabled = Boolean(label.is_enabled);
            const dotColor = label.color_background || FALLBACK_DOT_COLOR;

            return (
              <div
                key={label.gmail_label_id}
                className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-4 py-3 text-sm last:border-b-0 dark:border-slate-800"
              >
                <div className="flex items-center gap-2.5">
                  <Tag className="h-4 w-4" style={{ color: dotColor }} />
                  <p className="font-medium text-slate-700 dark:text-slate-100">{label.label_name}</p>
                </div>

                <div className="flex items-center gap-3">
                  {enabled ? <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-500 dark:bg-slate-800">AI ACTIVE</span> : null}
                  <button
                    type="button"
                    onClick={() => void toggleLabel(label.gmail_label_id, !enabled)}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-700"
                  >
                    {enabled ? 'Remove' : 'Add'}
                  </button>
                  <ChevronRight className="h-4 w-4 text-slate-400" />
                </div>
              </div>
            );
          }) : <p className="px-4 py-3 text-sm text-slate-500">No labels match your search.</p>}
        </div>
      </Card>

      <Card className="space-y-4">
        <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">Manual labels</h2>
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
          {manualLabels.length ? manualLabels.map((label) => {
            const enabled = Boolean(label.is_enabled);
            const dotColor = label.color_background || FALLBACK_DOT_COLOR;

            return (
              <div
                key={label.gmail_label_id}
                className="flex items-center justify-between gap-3 border-b border-slate-100 px-4 py-3 text-sm last:border-b-0 dark:border-slate-800"
              >
                <div className="flex items-center gap-2.5">
                  <Tag className="h-4 w-4" style={{ color: dotColor }} />
                  <p className="font-medium text-slate-700 dark:text-slate-100">{label.label_name}</p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => void toggleLabel(label.gmail_label_id, !enabled)}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-700"
                  >
                    {enabled ? 'Remove' : 'Add'}
                  </button>
                  <ChevronRight className="h-4 w-4 text-slate-400" />
                </div>
              </div>
            );
          }) : <p className="px-4 py-3 text-sm text-slate-500">No labels available.</p>}
        </div>
      </Card>

      <Card className="space-y-3">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Suggested labels</h2>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Add automation rules for your active labels so each one triggers triage actions, reminders, or routing
          behavior.
        </p>
      </Card>
    </section>
  );
};

export default Labels;
