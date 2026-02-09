import Card from '../components/ui/Card';
import { classNames } from '../lib/utils';

type StatusPill = {
  label: string;
  tone: 'blue' | 'violet' | 'amber' | 'green' | 'slate';
};

type EmailItem = {
  sender: string;
  subject: string;
  time: string;
  status?: StatusPill;
  unread?: boolean;
  dateNote?: string;
};

const statusStyles: Record<StatusPill['tone'], string> = {
  blue: 'bg-sky-100 text-sky-700 dark:bg-sky-500/20 dark:text-sky-200',
  violet: 'bg-violet-100 text-violet-700 dark:bg-violet-500/20 dark:text-violet-200',
  amber: 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-200',
  green: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-200',
  slate: 'bg-slate-100 text-slate-700 dark:bg-slate-700/40 dark:text-slate-200'
};

const menuItems = [
  'Main',
  'Promotions',
  'Drafts',
  'Recents',
  'Spam',
  'Sweep',
  'Trash',
  'All'
];

const todayEmails: EmailItem[] = [
  {
    sender: 'Fryd at Jace AI',
    subject: 'Jace setup is complete',
    time: '10:52 PM',
    status: { label: 'Complete', tone: 'blue' }
  },
  {
    sender: 'Fryd at Jace AI',
    subject: 'Your Jace trial has started!',
    time: '10:16',
    status: { label: 'Active', tone: 'violet' }
  }
];

const novemberEmails: EmailItem[] = [
  {
    sender: 'Alexa @ Pyxer AI',
    subject: "You've connected your email",
    time: '10:52 PM',
    status: { label: 'Completed', tone: 'blue' },
    unread: true
  },
  {
    sender: 'Google',
    subject: 'Kev, review your Google Account settings...',
    time: '10:21 PM',
    status: { label: 'Replied', tone: 'green' },
    unread: true
  },
  {
    sender: 'Reza Hooda',
    subject: 'I lost an 80,000 client ▤',
    time: '12:45 PM',
    status: { label: 'Read', tone: 'green' },
    unread: true
  },
  {
    sender: 'Ben Pope',
    subject: 'Nice To Meet You!',
    time: '10:36 AM',
    status: { label: 'Organized', tone: 'green' },
    unread: true
  }
];

const octoberEmails: EmailItem[] = [
  {
    sender: 'Craig Tiddesley',
    subject: 'Re: smitty',
    time: '11:02 PM',
    dateNote: 'Oct 28',
    unread: true
  },
  {
    sender: 'Swain, Matthew M.',
    subject: 'Fed up with high software costs...',
    time: '10:42 PM',
    status: { label: 'Replied', tone: 'green' },
    unread: true
  },
  {
    sender: 'Brendon Burchard',
    subject: 'PROGRESS MODE podcast is up!',
    time: '9:59 PM',
    status: { label: 'Draft', tone: 'violet' },
    unread: true
  },
  {
    sender: 'Daniel Priestley',
    subject: 'What happens in the next 48 hours matters',
    time: '9:42 PM',
    unread: true
  }
];

const InboxRow = ({ item }: { item: EmailItem }) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 py-4 last:border-b-0 dark:border-slate-800/60">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <span
          className={classNames(
            'h-2.5 w-2.5 rounded-full',
            item.unread ? 'bg-slate-700 dark:bg-slate-200' : 'bg-transparent'
          )}
        />
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
            {item.sender}
          </p>
          <p className="truncate text-sm text-slate-500 dark:text-slate-400">{item.subject}</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        {item.status ? (
          <span
            className={classNames(
              'rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide',
              statusStyles[item.status.tone]
            )}
          >
            {item.status.label}
          </span>
        ) : null}
        {item.dateNote ? (
          <span className="text-xs font-medium text-slate-400 dark:text-slate-500">
            {item.dateNote}
          </span>
        ) : null}
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
          {item.time}
        </span>
      </div>
    </div>
  );
};

const Dashboard = () => {
  return (
    <section>
      <Card className="p-0">
        <div className="grid gap-0 lg:grid-cols-[260px_minmax(0,1fr)]">
          <aside className="flex h-full flex-col gap-8 border-b border-slate-100 p-6 dark:border-slate-800/60 lg:border-b-0 lg:border-r">
            <button className="rounded-2xl bg-sky-100 px-4 py-3 text-left text-sm font-semibold text-slate-800 transition hover:bg-sky-200 dark:bg-sky-500/20 dark:text-sky-100 dark:hover:bg-sky-500/30">
              Create New Email
            </button>
            <nav className="space-y-2">
              {menuItems.map((item) => (
                <button
                  key={item}
                  className={classNames(
                    'flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm transition',
                    item === 'Main'
                      ? 'bg-slate-100 font-semibold text-slate-900 dark:bg-slate-800 dark:text-slate-100'
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-slate-200'
                  )}
                >
                  {item}
                </button>
              ))}
            </nav>
            <div className="mt-auto space-y-2 text-xs text-slate-500 dark:text-slate-400">
              <p>Invite teammates</p>
              <p>Get 1 month free</p>
              <div className="flex items-center gap-3 pt-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-sm font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-200">
                  K
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Kiera M.</p>
                  <p className="text-xs">kiera@xproflow.co</p>
                </div>
              </div>
            </div>
          </aside>
          <div className="p-6 lg:p-8">
            <div className="space-y-2">
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                Search or ask Jace a question
              </p>
              <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-500 shadow-sm dark:border-slate-800/60 dark:bg-slate-900">
                <span className="text-slate-400">⌘</span>
                <span className="flex-1">Type to search inbox, people, or tags</span>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                  Enter
                </span>
              </div>
              <p className="pt-3 text-xs text-slate-400 dark:text-slate-500">
                Preparing your recent email history...
              </p>
            </div>

            <div className="mt-8 space-y-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
                  Today
                </p>
                <div className="mt-3">
                  {todayEmails.map((item) => (
                    <InboxRow key={item.subject} item={item} />
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
                  November 2023
                </p>
                <div className="mt-3">
                  {novemberEmails.map((item) => (
                    <InboxRow key={item.subject} item={item} />
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
                  October 2023
                </p>
                <div className="mt-3">
                  {octoberEmails.map((item) => (
                    <InboxRow key={item.subject} item={item} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </section>
  );
};

export default Dashboard;
