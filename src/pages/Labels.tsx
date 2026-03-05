import { useEffect, useMemo, useState } from 'react';
import Card from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { api } from '../lib/api';
import { useAppContext } from '../context/AppContext';

type GmailLabel = {
  gmail_label_id: string;
  name?: string | null;
  label_name?: string | null;
  text_color?: string | null;
  background_color?: string | null;
  ai_enabled?: boolean | null;
  ai_description?: string | null;
};

type LabelsResponse = {
  labels?: GmailLabel[];
};

const FALLBACK_DOT_COLOR = '#64748B';
const ERROR_MESSAGE = 'Unable to update label settings.';

const normalizeLabels = (labels: GmailLabel[]) =>
  labels.map((label) => ({
    ...label,
    name: label.name || label.label_name || 'Unnamed label',
    ai_enabled: Boolean(label.ai_enabled),
    ai_description: label.ai_description || 'No description available.'
  }));

const Labels = () => {
  const { user } = useAppContext();
  const [labels, setLabels] = useState<GmailLabel[]>([]);
  const [connectedAccountId, setConnectedAccountId] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!toastMessage) {
      return;
    }

    const timeout = window.setTimeout(() => setToastMessage(''), 3000);
    return () => window.clearTimeout(timeout);
  }, [toastMessage]);

  useEffect(() => {
    if (!user?.id) {
      return;
    }

    let isMounted = true;

    const loadLabels = async () => {
      try {
        setIsLoading(true);
        const meResponse = await api.get<{ gmail?: { connected_account_id?: string } }>('/api/me');
        const accountId = meResponse.gmail?.connected_account_id;

        if (!accountId) {
          if (isMounted) {
            setLabels([]);
            setConnectedAccountId('');
          }
          return;
        }

        if (isMounted) {
          setConnectedAccountId(accountId);
        }

        await api.post('/api/gmail/labels/sync', { connected_account_id: accountId });

        const response = await api.get<LabelsResponse>(`/api/gmail/labels?connected_account_id=${encodeURIComponent(accountId)}`);
        const rawLabels = Array.isArray(response)
          ? (response as unknown as GmailLabel[])
          : Array.isArray(response.labels)
            ? response.labels
            : [];

        if (isMounted) {
          setLabels(normalizeLabels(rawLabels));
        }
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

    void loadLabels();

    return () => {
      isMounted = false;
    };
  }, [user?.id]);

  const enabledCount = useMemo(
    () => labels.filter((label) => Boolean(label.ai_enabled)).length,
    [labels]
  );

  const toggleLabel = async (labelId: string, nextEnabled: boolean) => {
    setLabels((currentState) =>
      currentState.map((label) =>
        label.gmail_label_id === labelId ? { ...label, ai_enabled: nextEnabled } : label
      )
    );

    try {
      await api.patch(`/api/gmail/labels/${encodeURIComponent(labelId)}`, {
        connected_account_id: connectedAccountId,
        ai_enabled: nextEnabled
      });
    } catch (error) {
      console.error('Failed to update label:', error);
      setLabels((currentState) =>
        currentState.map((label) =>
          label.gmail_label_id === labelId ? { ...label, ai_enabled: !nextEnabled } : label
        )
      );
      setToastMessage(ERROR_MESSAGE);
    }
  };

  const setAllLabels = async (enabled: boolean) => {
    const previousState = labels;
    setLabels((currentState) => currentState.map((label) => ({ ...label, ai_enabled: enabled })));

    try {
      await api.patch('/api/gmail/labels/bulk', {
        connected_account_id: connectedAccountId,
        ai_enabled: enabled
      });
    } catch (error) {
      console.error('Failed to bulk update labels:', error);
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
          <div className="flex items-center gap-2">
            <Button type="button" size="sm" variant="outline" onClick={() => void setAllLabels(true)} disabled={!labels.length}>
              Select all
            </Button>
            <Button type="button" size="sm" variant="outline" onClick={() => void setAllLabels(false)} disabled={!labels.length}>
              Deselect all
            </Button>
          </div>
        </div>

        {isLoading ? <p className="text-sm text-slate-600 dark:text-slate-300">Loading labels...</p> : null}

        <div className="space-y-3">
          {labels.map((label) => {
            const enabled = Boolean(label.ai_enabled);
            const dotColor = label.background_color || FALLBACK_DOT_COLOR;

            return (
              <div
                key={label.gmail_label_id}
                className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm dark:border-slate-800 dark:bg-slate-950"
              >
                <div className="flex items-center gap-3">
                  <span className="h-3 w-3 rounded-full" style={{ backgroundColor: dotColor }} />
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-slate-100">{label.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{label.ai_description}</p>
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
                      aria-label={`${enabled ? 'Disable' : 'Enable'} ${label.name} label`}
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
