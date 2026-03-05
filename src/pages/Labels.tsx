import { useEffect, useMemo, useState } from 'react';
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
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Label settings</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          Enable the labels X-ProFlow should use while triaging inbox messages.
        </p>
      </div>

      {toastMessage ? (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-900 dark:bg-rose-950 dark:text-rose-200">
          {toastMessage}
        </div>
      ) : null}

      <Card className="space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Smart labels</h2>
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

        <div className="space-y-3">
          {labels.map((label) => {
            const enabled = Boolean(label.is_enabled);
            const dotColor = label.color_background || FALLBACK_DOT_COLOR;

            return (
              <div
                key={label.gmail_label_id}
                className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm dark:border-slate-800 dark:bg-slate-950"
              >
                <div className="flex items-center gap-3">
                  <span className="h-3 w-3 rounded-full" style={{ backgroundColor: dotColor }} />
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-slate-100">{label.label_name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Gmail label</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className="rounded-full px-2 py-1 text-xs font-medium"
                    style={{
                      color: enabled ? dotColor : '#64748B',
                      backgroundColor: enabled ? `${dotColor}20` : '#E2E8F0'
                    }}
                  >
                    {enabled ? 'Enabled' : 'Disabled'}
                  </span>

                  <label className="relative inline-flex cursor-pointer items-center">
                    <input
                      type="checkbox"
                      checked={enabled}
                      onChange={() => void toggleLabel(label.gmail_label_id, !enabled)}
                      className="peer sr-only"
                      aria-label={`${enabled ? 'Disable' : 'Enable'} ${label.label_name} label`}
                    />
                    <span className="toggle-off relative h-6 w-11 rounded-full transition peer-checked:bg-blue-600">
                      <span className="toggle-knob absolute left-0.5 top-0.5 h-5 w-5 rounded-full shadow transition peer-checked:translate-x-5" />
                    </span>
                  </label>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      <Card className="space-y-3">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Recommended next step</h2>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Add automation rules for your enabled labels so each one triggers triage actions, reminders,
          or routing behavior.
        </p>
      </Card>
    </section>
  );
};

export default Labels;
