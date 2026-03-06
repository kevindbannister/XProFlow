"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

type EmailMessage = {
  id: string;
  user_id: string;
  gmail_message_id: string | null;
  thread_id: string | null;
  subject: string | null;
  from_address: string | null;
  snippet: string | null;
  body_text: string | null;
  body_html: string | null;
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

async function fetchFullEmailBody(gmailMessageId: string) {
  try {
    const response = await fetch(`/api/gmail/messages/${gmailMessageId}`, {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      return null;
    }

    const data = (await response.json()) as {
      body_html?: string | null;
      body_text?: string | null;
    };

    return {
      body_html: data.body_html ?? null,
      body_text: data.body_text ?? null,
    };
  } catch (error) {
    console.error("Failed to fetch full email body", error);
    return null;
  }
}

export default function InboxEmailDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const [email, setEmail] = useState<EmailMessage | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const missingEnv = useMemo(() => !supabase, []);
  const emailId = params?.id;

  useEffect(() => {
    if (missingEnv || !emailId) {
      setLoading(false);
      return;
    }

    let active = true;

    async function loadEmail() {
      setLoading(true);
      setErrorMessage(null);

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
        .eq("id", emailId)
        .single();

      if (!active) return;

      if (error || !data) {
        setEmail(null);
        setErrorMessage("Email not found.");
        setLoading(false);
        return;
      }

      const foundEmail = data as EmailMessage;

      if (foundEmail.user_id !== user.id) {
        setEmail(null);
        setErrorMessage("Access denied.");
        setLoading(false);
        return;
      }

      let hydratedEmail = foundEmail;

      if (!foundEmail.body_html && !foundEmail.body_text && foundEmail.gmail_message_id) {
        const fullBody = await fetchFullEmailBody(foundEmail.gmail_message_id);

        if (fullBody && active) {
          hydratedEmail = {
            ...foundEmail,
            body_html: fullBody.body_html,
            body_text: fullBody.body_text,
          };
        }
      }

      if (!active) return;

      setEmail(hydratedEmail);
      setLoading(false);
    }

    loadEmail();

    return () => {
      active = false;
    };
  }, [emailId, missingEnv, router]);

  if (missingEnv) {
    return (
      <main className="mx-auto w-full max-w-5xl p-6">
        <p className="rounded-md border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">
          Missing Supabase environment variables. Set NEXT_PUBLIC_SUPABASE_URL and
          NEXT_PUBLIC_SUPABASE_ANON_KEY.
        </p>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="mx-auto w-full max-w-5xl p-6">
        <p className="text-sm text-slate-500">Loading email...</p>
      </main>
    );
  }

  if (errorMessage) {
    return (
      <main className="mx-auto w-full max-w-5xl p-6">
        <button
          type="button"
          onClick={() => router.push("/inbox")}
          className="mb-4 inline-flex items-center rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
        >
          Back to Inbox
        </button>
        <p className="text-sm text-slate-600">{errorMessage}</p>
      </main>
    );
  }

  if (!email) {
    return (
      <main className="mx-auto w-full max-w-5xl p-6">
        <p className="text-sm text-slate-600">Email not found.</p>
      </main>
    );
  }

  return (
    <main className="mx-auto flex h-[calc(100vh-2rem)] w-full max-w-5xl flex-col p-6">
      <div className="mb-4 flex items-center justify-between">
        <button
          type="button"
          onClick={() => router.push("/inbox")}
          className="inline-flex items-center rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
        >
          Back to Inbox
        </button>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            className="rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
          >
            Move to Folder
          </button>
          <button
            type="button"
            className="rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
          >
            Mark Processed
          </button>
          <button
            type="button"
            className="rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
          >
            Re-run Automation
          </button>
        </div>
      </div>

      <section className="mb-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">{email.subject ?? "(No subject)"}</h1>

        <div className="mt-3 grid gap-2 text-sm text-slate-600 sm:grid-cols-2">
          <p>
            <span className="font-medium text-slate-700">From:</span> {email.from_address ?? "—"}
          </p>
          <p>
            <span className="font-medium text-slate-700">Received:</span>{" "}
            {formatReceivedAt(email.received_at)}
          </p>
          <p>
            <span className="font-medium text-slate-700">Classification:</span>{" "}
            <span className="inline-flex rounded-full bg-indigo-100 px-2.5 py-1 text-xs font-medium text-indigo-700">
              {email.classification ?? "Unclassified"}
            </span>
          </p>
          <p>
            <span className="font-medium text-slate-700">Status:</span>{" "}
            <span
              className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                email.processed
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-blue-100 text-blue-700"
              }`}
            >
              {email.processed ? "Processed" : "New"}
            </span>
          </p>
        </div>
      </section>

      <section className="min-h-0 flex-1 overflow-auto rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        {email.body_html ? (
          <article
            className="prose prose-slate max-w-none"
            dangerouslySetInnerHTML={{ __html: email.body_html }}
          />
        ) : (
          <article className="whitespace-pre-wrap text-sm text-slate-700">
            {email.body_text ?? email.snippet ?? "No email content available."}
          </article>
        )}
      </section>
    </main>
  );
}
