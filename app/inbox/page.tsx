"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  createClient,
  RealtimeChannel,
  RealtimePostgresChangesPayload,
} from "@supabase/supabase-js";

type EmailMessage = {
  id: string;
  user_id: string;
  gmail_message_id: string | null;
  thread_id: string | null;
  subject: string | null;
  from_address: string | null;
  snippet: string | null;
  classification: string | null;
  processed: boolean;
  label_applied: boolean | null;
  received_at: string | null;
  created_at: string;
};

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

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

  const missingEnv = useMemo(() => !supabase, []);

  useEffect(() => {
    if (missingEnv) {
      setLoading(false);
      return;
    }

    let active = true;

    async function loadInbox() {
      setLoading(true);

      const {
        data: { user },
      } = await supabase!.auth.getUser();

      if (!user) {
        router.replace("/login");
        return;
      }

      const { data, error } = await supabase!
        .from("email_messages")
        .select("*")
        .eq("user_id", user.id)
        .order("received_at", { ascending: false })
        .limit(50);

      if (!active) return;

      if (error) {
        console.error("Failed to fetch inbox emails", error);
        setEmails([]);
      } else {
        setEmails((data ?? []) as EmailMessage[]);
      }

      setLoading(false);
    }

    loadInbox();

    return () => {
      active = false;
    };
  }, [missingEnv, router]);

  useEffect(() => {
    if (missingEnv) return;

    let channelName = "";
    let didUnmount = false;
    let realtimeChannel: RealtimeChannel | null = null;

    async function subscribe() {
      const {
        data: { user },
      } = await supabase!.auth.getUser();

      if (!user || didUnmount) return;

      channelName = `email_messages_${user.id}`;

      const channel = supabase!
        .channel(channelName)
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "email_messages",
            filter: `user_id=eq.${user.id}`,
          },
          (payload: RealtimePostgresChangesPayload<EmailMessage>) => {
            if (payload.eventType === "INSERT") {
              const inserted = payload.new as EmailMessage;

              setEmails((prev) => {
                const deduped = prev.filter((email) => email.id !== inserted.id);
                return [inserted, ...deduped].slice(0, 50);
              });
            }

            if (payload.eventType === "UPDATE") {
              const updated = payload.new as EmailMessage;

              setEmails((prev) =>
                prev.map((email) => (email.id === updated.id ? updated : email)),
              );
            }
          },
        )
        .subscribe();

      realtimeChannel = channel;

      if (didUnmount && realtimeChannel) {
        supabase!.removeChannel(realtimeChannel);
      }
    }

    subscribe();

    return () => {
      didUnmount = true;
      if (realtimeChannel) {
        supabase!.removeChannel(realtimeChannel);
      }
    };
  }, [missingEnv]);

  if (missingEnv) {
    return (
      <main className="mx-auto w-full max-w-7xl p-6">
        <h1 className="text-2xl font-semibold text-slate-900">Inbox</h1>
        <p className="mt-4 rounded-md border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">
          Missing Supabase environment variables. Set NEXT_PUBLIC_SUPABASE_URL and
          NEXT_PUBLIC_SUPABASE_ANON_KEY.
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto flex h-[calc(100vh-2rem)] w-full max-w-7xl flex-col p-6">
      <header className="mb-4">
        <h1 className="text-2xl font-semibold text-slate-900">Inbox</h1>
        <p className="mt-1 text-sm text-slate-500">Latest 50 messages from your synced mailbox.</p>
      </header>

      <section className="min-h-0 flex-1 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        {loading ? (
          <div className="p-6 text-sm text-slate-500">Loading inbox...</div>
        ) : (
          <div className="h-full overflow-auto">
            <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
              <thead className="sticky top-0 z-10 bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-4 py-3 font-medium">From</th>
                  <th className="px-4 py-3 font-medium">Subject</th>
                  <th className="px-4 py-3 font-medium">Snippet</th>
                  <th className="px-4 py-3 font-medium">Classification</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Received</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {emails.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
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
                      <td className="px-4 py-3">{email.classification ?? "Unclassified"}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                            email.processed
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {email.processed ? "Processed" : "New"}
                        </span>
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
