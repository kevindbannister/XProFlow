"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

type EmailMessage = {
  id: string;
  subject: string | null;
  from_address: string | null;
  snippet: string | null;
  received_at: string | null;
};

type GmailMessageHeader = {
  name?: string;
  value?: string;
};

type GmailMessage = {
  id: string;
  snippet?: string;
  internalDate?: string;
  payload?: {
    headers?: GmailMessageHeader[];
  };
};

type GmailMessagesResponse = {
  messages?: GmailMessage[];
  error?: string;
};

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;

const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

function formatReceivedAt(receivedAt: string | null) {
  if (!receivedAt) return "—";

  const date = new Date(receivedAt);
  if (Number.isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export default function InboxPage() {
  const router = useRouter();
  const [emails, setEmails] = useState<EmailMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const missingEnv = useMemo(() => !supabase || !apiBaseUrl, []);

  const mapGmailMessage = useCallback((message: GmailMessage): EmailMessage => {
    const headers = message.payload?.headers ?? [];
    const subject = headers.find((header) => header.name?.toLowerCase() === "subject")?.value ?? null;
    const from = headers.find((header) => header.name?.toLowerCase() === "from")?.value ?? null;

    return {
      id: message.id,
      subject,
      from_address: from,
      snippet: message.snippet ?? null,
      received_at: message.internalDate
        ? new Date(Number(message.internalDate)).toISOString()
        : null,
    };
  }, []);

  const fetchInbox = useCallback(async () => {
    setLoading(true);
    setErrorMessage(null);

    if (!supabase || !apiBaseUrl) {
      setLoading(false);
      return;
    }

    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError) {
      console.error("[INBOX] Failed to get session", sessionError);
      setEmails([]);
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
      const response = await fetch(`${apiBaseUrl}/api/gmail/messages`, {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      const payload = (await response.json()) as GmailMessagesResponse | GmailMessage[];
      console.log("[INBOX] Gmail API response:", payload);

      if (!response.ok) {
        const error = Array.isArray(payload) ? undefined : payload?.error;
        throw new Error(error || `Failed to fetch Gmail messages (${response.status}).`);
      }

      const messages = Array.isArray(payload) ? payload : payload.messages ?? [];
      setEmails(messages.map(mapGmailMessage));
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to load Gmail messages.";
      console.error("[INBOX] Failed to fetch Gmail messages", error);
      setEmails([]);
      setErrorMessage(message);
    }

    setLoading(false);
  }, [mapGmailMessage, router]);

  useEffect(() => {
    if (missingEnv) {
      setLoading(false);
      return;
    }

    let active = true;

    async function loadInbox() {
      await fetchInbox();
      if (!active) {
        return;
      }
    }

    loadInbox();

    return () => {
      active = false;
    };
  }, [fetchInbox, missingEnv]);

  const handleSync = useCallback(async () => {
    if (missingEnv) return;

    setSyncing(true);
    setErrorMessage(null);

    try {
      await fetchInbox();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to load Gmail messages.";
      console.error("[INBOX] manual refresh failed", error);
      setErrorMessage(message);
    } finally {
      setSyncing(false);
    }
  }, [fetchInbox, missingEnv]);

  if (missingEnv) {
    return (
      <main className="mx-auto w-full max-w-7xl p-6">
        <h1 className="text-2xl font-semibold text-slate-900">Inbox</h1>
        <p className="mt-4 rounded-md border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">
          Missing required environment variables. Set NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, and NEXT_PUBLIC_API_URL.
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto flex h-[calc(100vh-2rem)] w-full max-w-7xl flex-col p-6">
      <header className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Inbox</h1>
          <p className="mt-1 text-sm text-slate-500">Latest Gmail messages from your mailbox.</p>
          {errorMessage ? (
            <p className="mt-2 text-sm text-rose-600">{errorMessage}</p>
          ) : null}
        </div>
        <button
          type="button"
          onClick={handleSync}
          disabled={syncing}
          className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {syncing ? "Syncing…" : "Sync"}
        </button>
      </header>

      <section className="min-h-0 flex-1 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        {loading ? (
          <div className="p-6 text-sm text-slate-500">Loading emails...</div>
        ) : (
          <div className="h-full overflow-auto">
            <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
              <thead className="sticky top-0 z-10 bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-4 py-3 font-medium">From</th>
                  <th className="px-4 py-3 font-medium">Subject</th>
                  <th className="px-4 py-3 font-medium">Snippet</th>
                  <th className="px-4 py-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {emails.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-slate-500">
                      No emails found.
                    </td>
                  </tr>
                ) : (
                  emails.map((email) => (
                    <tr key={email.id} className="transition-colors hover:bg-slate-50">
                      <td className="max-w-[220px] truncate px-4 py-3">{email.from_address ?? "—"}</td>
                      <td className="max-w-[280px] truncate px-4 py-3 font-medium text-slate-900">
                        {email.subject ?? "(No subject)"}
                      </td>
                      <td className="max-w-[320px] truncate px-4 py-3 text-slate-600">
                        {email.snippet ?? "—"}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-slate-500">
                        {formatReceivedAt(email.received_at)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}
