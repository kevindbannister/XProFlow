import { useMemo, useState } from 'react';

type EmailProvider = 'Office 365' | 'Gmail';

type EmailLabel = 'Urgent' | 'Follow-up' | 'General' | 'Support' | 'Spam';

type EmailAccount = {
  id: string;
  provider: EmailProvider;
  address: string;
  status: 'Connected' | 'Syncing';
  lastSync: string;
  unread: number;
};

type EmailMessage = {
  id: string;
  provider: EmailProvider;
  senderName: string;
  senderEmail: string;
  subject: string;
  preview: string;
  receivedAt: string;
  receivedDate: string;
  label: EmailLabel;
  unread: boolean;
  body: string[];
};

const accounts: EmailAccount[] = [
  {
    id: 'acct-1',
    provider: 'Office 365',
    address: 'kevin.brooks@firm.co.uk',
    status: 'Connected',
    lastSync: '2 minutes ago',
    unread: 4,
  },
  {
    id: 'acct-2',
    provider: 'Gmail',
    address: 'kevin.brooks@gmail.com',
    status: 'Syncing',
    lastSync: 'Syncing latest activity',
    unread: 7,
  },
];

const messages: EmailMessage[] = [
  {
    id: 'msg-1',
    provider: 'Office 365',
    senderName: 'Sarah Johnson',
    senderEmail: 'sarah.johnson@techcorp.com',
    subject: 'URGENT: Server downtime affecting production',
    preview: 'Hi team, we are seeing intermittent outages across the EU cluster.',
    receivedAt: '15m ago',
    receivedDate: '30/12/2025, 21:12:04',
    label: 'Urgent',
    unread: true,
    body: [
      'Hi team,',
      'We are seeing intermittent outages across the EU cluster. Can you confirm if anything changed in the last deployment?',
      'This is impacting our production workflow and we need immediate updates.',
      'Thanks,',
      'Sarah Johnson',
    ],
  },
  {
    id: 'msg-2',
    provider: 'Office 365',
    senderName: 'Mike Chen',
    senderEmail: 'mike.chen@designstudio.io',
    subject: 'Re: Follow up on project proposal',
    preview: 'Hey, just wanted to follow up on the proposal I sent last week.',
    receivedAt: '2h ago',
    receivedDate: '30/12/2025, 19:26:48',
    label: 'Follow-up',
    unread: false,
    body: [
      'Hey,',
      'Just wanted to follow up on the proposal I sent last week for the website redesign project. Have you had a chance to review it?',
      'Let me know if you need any additional information or would like to schedule a call to discuss further.',
      'Thanks!',
      'Mike Chen',
    ],
  },
  {
    id: 'msg-3',
    provider: 'Gmail',
    senderName: 'Support Team',
    senderEmail: 'support@cloudservices.com',
    subject: 'Your monthly invoice is ready',
    preview: 'Hello, your December invoice is ready for download in the portal.',
    receivedAt: '5h ago',
    receivedDate: '30/12/2025, 16:04:12',
    label: 'General',
    unread: false,
    body: [
      'Hello,',
      'Your December invoice is ready for download in the billing portal.',
      'Let us know if you need any adjustments or purchase order details.',
      'Regards,',
      'Cloud Services Billing',
    ],
  },
  {
    id: 'msg-4',
    provider: 'Gmail',
    senderName: 'Customer Inquiry',
    senderEmail: 'help@customer-inquiry.com',
    subject: 'Question about product features',
    preview: 'Hi, can you clarify if the workflow automation supports tags?',
    receivedAt: '8h ago',
    receivedDate: '30/12/2025, 13:40:22',
    label: 'Support',
    unread: false,
    body: [
      'Hi,',
      'Can you clarify if the workflow automation supports tagging by department and priority?',
      'We are evaluating the rollout for our CX team.',
      'Thanks!',
      'Mila',
    ],
  },
  {
    id: 'msg-5',
    provider: 'Gmail',
    senderName: 'Promo Alerts',
    senderEmail: 'no-reply@spam-deals.xyz',
    subject: 'You won $1,000,000! Claim now!!!',
    preview: 'Congratulations! You have been selected for a special prize.',
    receivedAt: '12h ago',
    receivedDate: '30/12/2025, 09:18:33',
    label: 'Spam',
    unread: true,
    body: [
      'Congratulations!',
      'You have been selected for a special prize. Click the link to claim your winnings.',
    ],
  },
];

const labelStyles: Record<EmailLabel, string> = {
  Urgent: 'border-rose-200 bg-rose-50 text-rose-600 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-200',
  'Follow-up':
    'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200',
  General: 'border-blue-200 bg-blue-50 text-blue-600 dark:border-blue-500/30 dark:bg-blue-500/10 dark:text-blue-200',
  Support: 'border-purple-200 bg-purple-50 text-purple-600 dark:border-purple-500/30 dark:bg-purple-500/10 dark:text-purple-200',
  Spam: 'border-slate-200 bg-slate-100 text-slate-600 dark:border-slate-600/30 dark:bg-slate-800/60 dark:text-slate-200',
};

export const EmailClassifierView = () => {
  const [activeId, setActiveId] = useState(messages[1]?.id ?? messages[0]?.id ?? '');
  const activeMessage = useMemo(() => messages.find((message) => message.id === activeId) ?? messages[0], [activeId]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">AI Email Classifier</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Automatically classify and draft responses from your Office 365 and Gmail inboxes.
          </p>
        </div>
        <div className="grid gap-3 lg:grid-cols-2">
          {accounts.map((account) => (
            <div
              key={account.id}
              className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-sm font-semibold text-white">
                  {account.provider === 'Office 365' ? 'O365' : 'G'}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">{account.provider}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{account.address}</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500">{account.lastSync}</p>
                </div>
              </div>
              <div className="text-right">
                <span
                  className={`inline-flex items-center gap-1 rounded-full border px-2 py-1 text-xs font-semibold ${
                    account.status === 'Connected'
                      ? 'border-emerald-200 bg-emerald-50 text-emerald-600 dark:border-emerald-500/40 dark:bg-emerald-500/10 dark:text-emerald-200'
                      : 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-500/40 dark:bg-amber-500/10 dark:text-amber-200'
                  }`}
                >
                  {account.status}
                </span>
                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">{account.unread} unread</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <div className="space-y-3 rounded-3xl border border-slate-100 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Inbox (4 unread)</p>
            <span className="text-xs text-slate-400 dark:text-slate-500">Unified view</span>
          </div>
          <div className="space-y-2">
            {messages.map((message) => (
              <button
                key={message.id}
                onClick={() => setActiveId(message.id)}
                className={`w-full rounded-2xl border px-3 py-3 text-left transition ${
                  activeId === message.id
                    ? 'border-slate-200 bg-slate-50 shadow-sm dark:border-slate-700 dark:bg-slate-800/70'
                    : 'border-transparent hover:border-slate-100 hover:bg-slate-50/80 dark:hover:border-slate-800 dark:hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-xs font-semibold text-slate-900 dark:text-white">{message.senderEmail}</p>
                    <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">{message.subject}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-xs text-slate-400 dark:text-slate-500">{message.receivedAt}</span>
                    {message.unread ? <span className="h-2 w-2 rounded-full bg-emerald-500" /> : null}
                  </div>
                </div>
                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">{message.preview}</p>
                <div className="mt-2 flex items-center justify-between text-xs text-slate-400 dark:text-slate-500">
                  <span>{message.provider}</span>
                  <span className={`rounded-full border px-2 py-0.5 font-semibold ${labelStyles[message.label]}`}>
                    {message.label}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-5">
          <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-lg font-semibold text-slate-900 dark:text-white">{activeMessage.subject}</p>
                <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                  <span>From {activeMessage.senderName}</span>
                  <span>{activeMessage.senderEmail}</span>
                  <span>{activeMessage.receivedDate}</span>
                  <span className="rounded-full border border-slate-200 px-2 py-0.5 text-slate-600 dark:border-slate-700 dark:text-slate-300">
                    {activeMessage.provider}
                  </span>
                </div>
              </div>
              <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${labelStyles[activeMessage.label]}`}>
                {activeMessage.label}
              </span>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Email Content</p>
            <div className="mt-4 space-y-4 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              {activeMessage.body.map((line, index) => (
                <p key={`${activeMessage.id}-${index}`}>{line}</p>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500">
              ✨ Generate AI Draft Response
            </button>
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <span className="rounded-full border border-slate-200 px-2 py-1 dark:border-slate-700">Intent: Follow-up</span>
              <span className="rounded-full border border-slate-200 px-2 py-1 dark:border-slate-700">Priority: High</span>
              <span className="rounded-full border border-slate-200 px-2 py-1 dark:border-slate-700">
                Suggested reply time: 2 hours
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
