import { useEffect, useRef } from 'react';
import { Search } from 'lucide-react';
import Card from '../components/ui/Card';

type InboxEmail = {
  sender: string;
  subject: string;
  preview?: string;
  time: string;
  status: string;
  statusStyle: string;
};

type InboxGroup = {
  title: string;
  emails: InboxEmail[];
};

const inboxGroups: InboxGroup[] = [
  {
    title: 'Today',
    emails: [
      {
        sender: 'Lena Soto',
        subject: 'Q4 operations review and staffing follow-up',
        preview: 'Sharing the final headcount adjustments and onboarding timeline.',
        time: '11:08 AM',
        status: 'Active',
        statusStyle: 'bg-emerald-100 text-emerald-700'
      },
      {
        sender: 'XProFlow',
        subject: 'Weekly inbox summary is ready',
        preview: 'Take a quick look at what needs your attention before EOD.',
        time: '9:42 AM',
        status: 'Complete',
        statusStyle: 'bg-sky-100 text-sky-700'
      },
      {
        sender: 'Marcus Hill',
        subject: 'Re: Vendor contract renewal',
        preview: 'Attached the updated pricing table and our notes.',
        time: '8:15 AM',
        status: 'Replied',
        statusStyle: 'bg-violet-100 text-violet-700'
      }
    ]
  },
  {
    title: 'November 2023',
    emails: [
      {
        sender: 'Priya Desai',
        subject: 'Campaign launch assets (final)',
        preview: 'Deliverables are in the shared folder with the final edits.',
        time: 'Nov 28',
        status: 'Read',
        statusStyle: 'bg-slate-100 text-slate-700'
      },
      {
        sender: 'Daniel Cho',
        subject: 'Board deck review',
        preview: 'Need feedback on slide 12 and the financial summary.',
        time: 'Nov 26',
        status: 'Draft',
        statusStyle: 'bg-amber-100 text-amber-700'
      },
      {
        sender: 'People Ops',
        subject: 'Benefits enrollment reminder',
        preview: 'Your selections are due Friday. Let us know if you need help.',
        time: 'Nov 22',
        status: 'Organized',
        statusStyle: 'bg-teal-100 text-teal-700'
      }
    ]
  },
  {
    title: 'October 2023',
    emails: [
      {
        sender: 'Amelia Rhodes',
        subject: 'Product feedback session recap',
        preview: 'Summarizing the themes from the customer interviews.',
        time: 'Oct 31',
        status: 'Read',
        statusStyle: 'bg-slate-100 text-slate-700'
      },
      {
        sender: 'Finance Team',
        subject: 'Expense approvals pending',
        preview: 'There are three items waiting for your sign-off.',
        time: 'Oct 27',
        status: 'Active',
        statusStyle: 'bg-emerald-100 text-emerald-700'
      }
    ]
  }
];

const captureElementAsPng = async (element: HTMLElement, filename: string) => {
  const rect = element.getBoundingClientRect();
  if (!rect.width || !rect.height) {
    return;
  }

  const xml = new XMLSerializer().serializeToString(element);
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${Math.ceil(rect.width)}" height="${Math.ceil(
      rect.height
    )}">
      <foreignObject width="100%" height="100%">${xml}</foreignObject>
    </svg>
  `;

  const url = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml;charset=utf-8' }));

  try {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error('Failed to render dashboard screenshot.'));
      img.src = url;
    });

    const canvas = document.createElement('canvas');
    canvas.width = Math.ceil(rect.width);
    canvas.height = Math.ceil(rect.height);

    const context = canvas.getContext('2d');
    if (!context) {
      return;
    }

    context.drawImage(image, 0, 0);

    const pngUrl = canvas.toDataURL('image/png');
    const anchor = document.createElement('a');
    anchor.href = pngUrl;
    anchor.download = filename;
    anchor.click();
  } finally {
    URL.revokeObjectURL(url);
  }
};

const Dashboard = () => {
  const dashboardRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const capturePending = window.sessionStorage.getItem('xproflow-dashboard-capture-pending');
    const captured = window.sessionStorage.getItem('xproflow-dashboard-captured');

    if (capturePending !== 'true' || captured === 'true') {
      return;
    }

    const captureTimeout = window.setTimeout(() => {
      if (!dashboardRef.current) {
        return;
      }

      void captureElementAsPng(dashboardRef.current, 'dashboard-initial.png').finally(() => {
        window.sessionStorage.setItem('xproflow-dashboard-captured', 'true');
        window.sessionStorage.removeItem('xproflow-dashboard-capture-pending');
      });
    }, 600);

    return () => {
      window.clearTimeout(captureTimeout);
    };
  }, []);

  return (
    <section ref={dashboardRef} className="space-y-6">
      <Card className="p-4">
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search or ask XProFlow a question"
            className="w-full rounded-2xl border border-transparent bg-slate-100/80 py-3 pl-11 pr-4 text-sm text-slate-700 outline-none transition focus:border-slate-200 focus:bg-white focus:ring-2 focus:ring-sky-100"
          />
        </div>
      </Card>

      <div className="space-y-6">
        {inboxGroups.map((group) => (
          <div key={group.title} className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                {group.title}
              </h2>
              <span className="text-xs text-slate-400">{group.emails.length} messages</span>
            </div>
            <Card className="divide-y divide-slate-200/70">
              {group.emails.map((email, index) => (
                <div
                  key={`${email.sender}-${email.subject}-${index}`}
                  className="flex cursor-pointer items-center justify-between gap-4 px-4 py-4 transition hover:bg-slate-50"
                >
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-slate-900">{email.sender}</p>
                      <span className="h-1 w-1 rounded-full bg-slate-300" />
                      <p className="text-sm font-medium text-slate-700">{email.subject}</p>
                    </div>
                    {email.preview ? (
                      <p className="truncate text-xs text-slate-500">{email.preview}</p>
                    ) : null}
                  </div>
                  <div className="flex flex-col items-end gap-2 text-right">
                    <span className="text-xs font-medium text-slate-400">{email.time}</span>
                    <span
                      className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide ${email.statusStyle}`}
                    >
                      {email.status}
                    </span>
                  </div>
                </div>
              ))}
            </Card>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Dashboard;
