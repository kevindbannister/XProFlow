"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

type Label = {
  id: string;
  label_name: string;
  label_type: string | null;
  enabled: boolean;
  hidden: boolean;
  priority: number | null;
};

type LabelsResponse = {
  labels?: Label[];
  error?: string;
};

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;

const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

export default function LabelsPage() {
  const router = useRouter();
  const [labels, setLabels] = useState<Label[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [updatingKeys, setUpdatingKeys] = useState<Record<string, boolean>>({});
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const missingEnv = useMemo(() => !supabase || !apiBaseUrl, []);

  const fetchLabels = useCallback(async () => {
    if (!supabase || !apiBaseUrl) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError) {
      setLabels([]);
      setErrorMessage(sessionError.message || "Unable to get authenticated session.");
      setLoading(false);
      return;
    }

    if (!session?.access_token) {
      router.replace("/login");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${apiBaseUrl}/api/labels`, {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      const payload = (await response.json()) as LabelsResponse;

      if (response.status === 401) {
        setLabels([]);
        router.replace("/login");
        setLoading(false);
        return;
      }

      if (!response.ok) {
        throw new Error(payload.error || `Failed to load labels (${response.status}).`);
      }

      setLabels(payload.labels ?? []);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to load labels.";
      setLabels([]);
      setErrorMessage(message);
    }

    setLoading(false);
  }, [router]);

  useEffect(() => {
    if (missingEnv) {
      setLoading(false);
      return;
    }

    void fetchLabels();
  }, [fetchLabels, missingEnv]);

  const handleSync = useCallback(async () => {
    if (!supabase || !apiBaseUrl) return;

    setSyncing(true);
    setErrorMessage(null);

    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError) {
      setErrorMessage(sessionError.message || "Unable to get authenticated session.");
      setSyncing(false);
      return;
    }

    if (!session?.access_token) {
      router.replace("/login");
      setSyncing(false);
      return;
    }

    try {
      const response = await fetch(`${apiBaseUrl}/api/labels/sync`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({}),
      });

      const payload = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(payload.error || `Failed to sync labels (${response.status}).`);
      }

      await fetchLabels();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to sync labels.";
      setErrorMessage(message);
    }

    setSyncing(false);
  }, [fetchLabels, router]);

  const updateLabel = useCallback(
    async (
      labelId: string,
      field: "enabled" | "hidden",
      value: boolean
    ) => {
      if (!supabase || !apiBaseUrl) return;

      const updateKey = `${labelId}:${field}`;
      setUpdatingKeys((current) => ({ ...current, [updateKey]: true }));
      setErrorMessage(null);

      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError) {
        setErrorMessage(sessionError.message || "Unable to get authenticated session.");
        setUpdatingKeys((current) => {
          const next = { ...current };
          delete next[updateKey];
          return next;
        });
        return;
      }

      if (!session?.access_token) {
        router.replace("/login");
        setUpdatingKeys((current) => {
          const next = { ...current };
          delete next[updateKey];
          return next;
        });
        return;
      }

      const previousLabel = labels.find((label) => label.id === labelId);
      const patch = { [field]: value };
      setLabels((current) =>
        current.map((label) =>
          label.id === labelId
            ? {
                ...label,
                [field]: value,
              }
            : label
        )
      );

      try {
        const response = await fetch(`${apiBaseUrl}/api/labels/${encodeURIComponent(labelId)}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify(patch),
        });

        const payload = (await response.json()) as {
          error?: string;
          label?: Label;
        };

        if (!response.ok) {
          throw new Error(payload.error || `Failed to update label (${response.status}).`);
        }

        if (payload.label) {
          setLabels((current) =>
            current.map((label) => (label.id === labelId ? payload.label! : label))
          );
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : "Unable to update label.";
        if (previousLabel) {
          setLabels((current) =>
            current.map((label) => (label.id === labelId ? previousLabel : label))
          );
        }
        setErrorMessage(message);
      }

      setUpdatingKeys((current) => {
        const next = { ...current };
        delete next[updateKey];
        return next;
      });
    },
    [labels, router]
  );

  const sortedLabels = useMemo(
    () =>
      [...labels].sort(
        (a, b) =>
          (a.priority ?? Number.MAX_SAFE_INTEGER) -
            (b.priority ?? Number.MAX_SAFE_INTEGER) ||
          a.label_name.localeCompare(b.label_name)
      ),
    [labels]
  );

  if (missingEnv) {
    return (
      <main className="mx-auto w-full max-w-7xl p-6">
        <h1 className="text-2xl font-semibold text-slate-900">Labels</h1>
        <p className="mt-4 rounded-md border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">
          Missing required environment variables. Set NEXT_PUBLIC_SUPABASE_URL,
          NEXT_PUBLIC_SUPABASE_ANON_KEY, and NEXT_PUBLIC_API_URL.
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-7xl p-6">
      <header className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Labels</h1>
          <p className="mt-1 text-sm text-slate-600">
            Manage Gmail label settings used by X-ProFlow.
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Hidden labels are removed from inbox filters. Disabled labels stay visible, but
            automations ignore them.
          </p>
        </div>
        <button
          type="button"
          onClick={() => void handleSync()}
          disabled={syncing || loading}
          className="inline-flex items-center rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {syncing ? "Syncing..." : "Sync"}
        </button>
      </header>

      {errorMessage ? (
        <p className="mb-4 rounded-md border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
          {errorMessage}
        </p>
      ) : null}

      {loading ? (
        <p className="text-sm text-slate-600">Loading labels...</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-slate-200 text-left text-sm text-slate-700">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-600">
              <tr>
                <th className="px-4 py-3 font-semibold">Label Name</th>
                <th className="px-4 py-3 font-semibold">Type</th>
                <th className="px-4 py-3 font-semibold">Enabled</th>
                <th className="px-4 py-3 font-semibold">Hidden</th>
                <th className="px-4 py-3 font-semibold">Priority</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sortedLabels.length ? (
                sortedLabels.map((label) => {
                  const isUpdatingEnabled = Boolean(updatingKeys[`${label.id}:enabled`]);
                  const isUpdatingHidden = Boolean(updatingKeys[`${label.id}:hidden`]);

                  return (
                    <tr key={label.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-medium text-slate-900">{label.label_name}</td>
                      <td className="px-4 py-3">{label.label_type ?? "—"}</td>
                      <td className="px-4 py-3">
                        <label className="inline-flex cursor-pointer items-center">
                          <input
                            type="checkbox"
                            className="peer sr-only"
                            checked={Boolean(label.enabled)}
                            disabled={isUpdatingEnabled}
                            onChange={(event) =>
                              void updateLabel(label.id, "enabled", event.target.checked)
                            }
                          />
                          <span className="relative h-6 w-11 rounded-full bg-slate-300 transition peer-checked:bg-emerald-500 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-emerald-400 peer-disabled:cursor-not-allowed peer-disabled:opacity-60">
                            <span className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white transition peer-checked:translate-x-5" />
                          </span>
                        </label>
                      </td>
                      <td className="px-4 py-3">
                        <label className="inline-flex cursor-pointer items-center">
                          <input
                            type="checkbox"
                            className="peer sr-only"
                            checked={Boolean(label.hidden)}
                            disabled={isUpdatingHidden}
                            onChange={(event) =>
                              void updateLabel(label.id, "hidden", event.target.checked)
                            }
                          />
                          <span className="relative h-6 w-11 rounded-full bg-slate-300 transition peer-checked:bg-emerald-500 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-emerald-400 peer-disabled:cursor-not-allowed peer-disabled:opacity-60">
                            <span className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white transition peer-checked:translate-x-5" />
                          </span>
                        </label>
                      </td>
                      <td className="px-4 py-3">{label.priority ?? "—"}</td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-sm text-slate-500">
                    No labels found. Click Sync to import labels from Gmail.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
