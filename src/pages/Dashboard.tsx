import { Filter, Mail } from 'lucide-react';
import Card from '../components/ui/Card';
import { xProFlowAccents, xProFlowBlue } from '../lib/designTokens';

const sidebarLinks = [
  { label: 'Main', active: true },
  { label: 'Promotions' },
  { label: 'Drafts' },
  { label: 'Recents' },
  { label: 'Spam' },
  { label: 'Sweep' },
  { label: 'Trash' },
  { label: 'All' }
];

type StatusTone = 'blue' | 'teal' | 'amber' | 'violet' | 'slate';

type EmailItem = {
  sender: string;
  subject: string;
  time: string;
  status?: {
    label: string;
    tone: StatusTone;
  };
  unread?: boolean;
};

type EmailGroup = {
  title: string;
  subtitle?: string;
  items: EmailItem[];
};

const statusStyles: Record<StatusTone, { bg: string; text: string }> = {
  blue: { bg: 'bg-sky-100 dark:bg-sky-500/20', text: 'text-sky-700 dark:text-sky-200' },
  teal: { bg: 'bg-teal-100 dark:bg-teal-500/20', text: 'text-teal-700 dark:text-teal-200' },
  amber: { bg: 'bg-amber-100 dark:bg-amber-500/20', text: 'text-amber-700 dark:text-amber-200' },
  violet: { bg: 'bg-violet-100 dark:bg-violet-500/20', text: 'text-violet-700 dark:text-violet-200' },
  slate: { bg: 'bg-slate-200 dark:bg-slate-700', text: 'text-slate-600 dark:text-slate-200' }
};

const inboxGroups: EmailGroup[] = [
  {
    title: 'Today',
    items: [
      {
        sender: 'Fryd at Jace AI',
        subject: 'Jace setup is complete',
        time: '10:52 PM',
        status: { label: 'Complete', tone: 'blue' }
      },
      {
        sender: 'Fryd at Jace AI',
        subject: 'Your Jace trial has started!',
        time: '10:16 PM',
        status: { label: 'Active', tone: 'amber' },
        unread: true
      }
    ]
  },
  {
    title: 'November 2023',
    items: [
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
        status: { label: 'Replied', tone: 'teal' }
      },
      {
        sender: 'Reza Hooda',
        subject: 'I lost an 80,000 client',
        time: '12:45 PM',
        status: { label: 'Read', tone: 'teal' }
      },
      {
        sender: 'Ben Pope',
        subject: 'Nice to Meet You!',
        time: '10:36 AM',
        status: { label: 'Organized', tone: 'teal' }
      }
    ]
  },
  {
    title: 'October 2023',
    items: [
      {
        sender: 'Craig Tiddesley',
        subject: 'Re: smitty',
        time: '11:02 PM'
      },
      {
        sender: 'Swain, Matthew M.',
        subject: 'Fed up with high software costs...',
        time: '10:42 PM',
        status: { label: 'Replied', tone: 'teal' }
      },
      {
        sender: 'Brendon Burchard',
        subject: 'PROGRESS MODE podcast is up!',
        time: '9:59 PM',
        status: { label: 'Draft', tone: 'violet' }
      },
      {
        sender: 'Daniel Priestley',
        subject: 'What happens in the next 48 hours matters',
        time: '9:42 PM'
      }
    ]
  }
];

const Dashboard = () => {
  return (
    <section className="space-y-6">
      <Card className="rounded-[32px] p-0 shadow-lg">
        <div className="grid gap-8 p-6 lg:grid-cols-[260px_1fr] lg:gap-10">
          <aside className="flex h-full flex-col justify-between rounded-3xl border border-slate-200/70 bg-white/70 p-5 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/70">
            <div className="space-y-6">
              <button
                className={`flex w-full items-center justify-center gap-2 rounded-2xl bg-sky-100 px-4 py-3 text-sm font-semibold text-sky-700 transition hover:bg-sky-200 dark:bg-slate-800 dark:text-sky-200 dark:hover:bg-slate-700 ${xProFlowBlue.focusRing}`}
              >
                <Mail className="h-4 w-4" />
                Create New Email
              </button>
              <nav className="space-y-3">
                {sidebarLinks.map((link) => (
                  <div
                    key={link.label}
                    className={`rounded-2xl px-3 py-2 text-sm font-medium transition ${
                      link.active
                        ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                        : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:text-slate-300 dark:hover:bg-slate-800'
                    }`}
                  >
                    {link.label}
                  </div>
                ))}
              </nav>
            </div>
            <div className="space-y-6 text-xs text-slate-500 dark:text-slate-400">
              <div className="space-y-2">
                <p className="font-semibold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
                  Team
                </p>
                <p>Invite teammates</p>
                <p>Get 1 month free</p>
              </div>
              <div className="flex items-center gap-3 rounded-2xl bg-slate-100 px-3 py-3 text-sm font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-slate-700 shadow-sm dark:bg-slate-900 dark:text-slate-100">
                  K
                </div>
                Kayla Johnson
              </div>
            </div>
          </aside>

          <div className="space-y-6">
            <div className="rounded-3xl border border-slate-200/70 bg-white/70 p-6 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/70">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                    Search or ask Jace a question
                  </p>
                  <p className="mt-2 text-xs text-slate-400 dark:text-slate-500">
                    Preparing your recent email history...
                  </p>
                </div>
                <div className="flex w-full items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-500 shadow-sm dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300 lg:max-w-sm">
                  <Filter className="h-4 w-4" />
                  <span>Search your inbox</span>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              {inboxGroups.map((group) => (
                <div key={group.title} className="space-y-4">
                  <div className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500">
                    {group.title}
                  </div>
                  <div className="space-y-3">
                    {group.items.map((item) => (
                      <div
                        key={`${group.title}-${item.sender}-${item.subject}`}
                        className="flex flex-col gap-3 rounded-3xl border border-slate-200/70 bg-white/70 p-4 shadow-sm transition hover:border-slate-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900/70"
                      >
                        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                          <div className="flex flex-1 items-start gap-3">
                            <div
                              className={`mt-1 h-2.5 w-2.5 rounded-full ${
                                item.unread ? xProFlowAccents.violet.chartDot : 'bg-slate-300'
                              }`}
                            />
                            <div>
                              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                                {item.sender}
                              </p>
                              <p className="text-sm text-slate-500 dark:text-slate-400">
                                {item.subject}
                              </p>
                            </div>
                          </div>
                          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                            {item.status ? (
                              <span
                                className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wide ${
                                  statusStyles[item.status.tone].bg
                                } ${statusStyles[item.status.tone].text}`}
                              >
                                {item.status.label}
                              </span>
                            ) : null}
                            <span className="text-xs text-slate-400 dark:text-slate-500">
                              {item.time}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </section>
  );
};

export default Dashboard;
