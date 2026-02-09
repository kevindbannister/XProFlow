import { Search } from 'lucide-react';

type InboxItem = {
  id: string;
  sender: string;
  subject: string;
  time: string;
  status?: string;
  statusTone?: string;
  unread?: boolean;
  date?: string;
};

type InboxSection = {
  title: string;
  summary?: string;
  items: InboxItem[];
};

const folderLinks = [
  'Main',
  'Promotions',
  'Drafts',
  'Recents',
  'Spam',
  'Sweep',
  'Trash',
  'All'
];

const inboxSections: InboxSection[] = [
  {
    title: 'Today',
    summary: 'Preparing your recent email history...',
    items: [
      {
        id: 'today-1',
        sender: 'Fryd at Jace AI',
        subject: 'Jace setup is complete',
        time: '10:52 PM',
        status: 'Complete',
        statusTone: 'bg-blue-100 text-blue-700',
        unread: true
      },
      {
        id: 'today-2',
        sender: 'Fryd at Jace AI',
        subject: 'Your Jace trial has started!',
        time: '10:16',
        status: 'Active',
        statusTone: 'bg-amber-100 text-amber-700',
        unread: true
      }
    ]
  },
  {
    title: 'November 2023',
    items: [
      {
        id: 'nov-1',
        sender: 'Alexa @ Pyxer AI',
        subject: "You've connected your email",
        time: '10:52 PM',
        status: 'Completed',
        statusTone: 'bg-blue-100 text-blue-700'
      },
      {
        id: 'nov-2',
        sender: 'Google',
        subject: 'Kev, review your Google Account settings...',
        time: '10:21 PM',
        status: 'Replied',
        statusTone: 'bg-emerald-100 text-emerald-700'
      },
      {
        id: 'nov-3',
        sender: 'Reza Hooda',
        subject: 'I lost an 80,000 client',
        time: '12:45 PM',
        status: 'Read',
        statusTone: 'bg-teal-100 text-teal-700'
      },
      {
        id: 'nov-4',
        sender: 'Ben Pope',
        subject: 'Nice To Meet You!',
        time: '10:36 AM',
        status: 'Organized',
        statusTone: 'bg-emerald-100 text-emerald-700'
      }
    ]
  },
  {
    title: 'October 2023',
    items: [
      {
        id: 'oct-1',
        sender: 'Craig Tiddesley',
        subject: 'Re: smitty',
        time: '11:02 PM',
        date: 'Oct 28'
      },
      {
        id: 'oct-2',
        sender: 'Swain, Matthew M.',
        subject: 'Fed up with high software costs...',
        time: '10:42 PM',
        status: 'Replied',
        statusTone: 'bg-emerald-100 text-emerald-700'
      },
      {
        id: 'oct-3',
        sender: 'Brendon Burchard',
        subject: 'PROGRESS MODE podcast is up!',
        time: '9:59 PM',
        status: 'Draft',
        statusTone: 'bg-violet-100 text-violet-700'
      },
      {
        id: 'oct-4',
        sender: 'Daniel Priestley',
        subject: 'What happens in the next 48 hours matters',
        time: '9:42 PM'
      }
    ]
  }
];

const Inbox = () => {
  return (
    <section className="glass-card rounded-3xl border p-6 lg:p-8">
      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
        <aside className="flex h-full flex-col gap-6 rounded-2xl border border-white/70 bg-white/60 p-4 shadow-sm">
          <button className="button-primary w-full rounded-full px-4 py-3 text-sm font-semibold">
            Create New Email
          </button>
          <nav className="space-y-1 text-sm">
            {folderLinks.map((item) => (
              <button
                key={item}
                type="button"
                className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left transition ${
                  item === 'Main'
                    ? 'bg-white/90 font-semibold text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:bg-white/70'
                }`}
              >
                <span>{item}</span>
              </button>
            ))}
          </nav>
          <div className="mt-auto rounded-2xl border border-white/80 bg-white/70 p-4 text-xs text-slate-500">
            New account insights are ready. Review your last sync summary to stay up to date.
          </div>
        </aside>

        <div className="space-y-8">
          <div className="space-y-3">
            <label className="flex items-center gap-3 rounded-full border border-white/70 bg-white/80 px-4 py-3 text-sm text-slate-500 shadow-sm">
              <Search className="h-4 w-4 text-slate-400" aria-hidden="true" />
              <input
                type="text"
                placeholder="Search or ask Jace a question"
                className="w-full bg-transparent text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none"
              />
            </label>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Inbox assistant</p>
          </div>

          <div className="space-y-8">
            {inboxSections.map((section) => (
              <div key={section.title} className="space-y-4">
                <div className="space-y-1">
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                    {section.title}
                  </p>
                  {section.summary && (
                    <p className="text-sm text-slate-500">{section.summary}</p>
                  )}
                </div>
                <div className="space-y-2">
                  {section.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex flex-col gap-3 rounded-2xl border border-white/70 bg-white/70 px-4 py-3 shadow-sm transition hover:bg-white/90 lg:flex-row lg:items-center lg:justify-between"
                    >
                      <div className="flex items-start gap-3">
                        <span
                          className={`mt-1 h-2 w-2 rounded-full ${
                            item.unread ? 'bg-blue-500' : 'bg-slate-200'
                          }`}
                          aria-hidden="true"
                        />
                        <div>
                          <p className="text-sm font-semibold text-slate-900">{item.sender}</p>
                          <p className="text-sm text-slate-600">{item.subject}</p>
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 lg:justify-end">
                        {item.status && item.statusTone && (
                          <span
                            className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wide ${item.statusTone}`}
                          >
                            {item.status}
                          </span>
                        )}
                        {item.date && <span className="text-xs text-slate-400">{item.date}</span>}
                        <span className="text-xs text-slate-500">{item.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Inbox;
