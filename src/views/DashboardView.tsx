import { FC, useEffect, useMemo, useRef, useState } from 'react';
import type { DragEvent } from 'react';


export type Metric = {
  id: string;
  label: string;
  value: string;
  deltaText: string;
};

export type AutomationPoint = {
  label: string;
  value: number;
};

export type CategoryStat = {
  name: string;
  count: number;
  percentage: number;
};

type EmailAssumptions = {
  averageReadSeconds: number;
  averageResponseMinutes: number;
  responseRate: number;
  periodMonths: number;
};

type RoleOption = {
  value: string;
  label: string;
  defaultRate: number;
};

type LayoutItem = {
  id: string;
  w: number;
  h: number;
};

type ResizeState = {
  id: string;
  startX: number;
  startY: number;
  startW: number;
  startH: number;
  gridWidth: number;
};

const metrics: Metric[] = [
  { id: 'analysed', label: 'Emails analysed today', value: '82', deltaText: '+12% vs last week' },
  { id: 'categorized', label: 'Emails categorised', value: '61', deltaText: '+8% vs last week' },
  { id: 'drafts', label: 'AI draft replies generated', value: '19', deltaText: '+21% vs last week' },
  { id: 'followups', label: 'Follow-ups created', value: '11', deltaText: '+5% vs last week' },
];

const EMAIL_ASSUMPTIONS: EmailAssumptions = {
  averageReadSeconds: 45,
  averageResponseMinutes: 2.5,
  responseRate: 0.35,
  periodMonths: 12,
};

const ROLE_OPTIONS: RoleOption[] = [
  { value: 'practiceOwner', label: 'Practice Owner', defaultRate: 180 },
  { value: 'financeDirector', label: 'Finance Director', defaultRate: 150 },
  { value: 'accountant', label: 'Accountant', defaultRate: 120 },
  { value: 'bookkeeper', label: 'Bookkeeper', defaultRate: 85 },
];

const EDUCATION_VIDEOS = [
  {
    title: 'Why email feels overwhelming',
    description: 'Understand the hidden queues, handoffs, and interruptions that create drag.',
  },
  {
    title: 'How Flowiee decides what matters',
    description: 'See how relevance, urgency, and client value drive what surfaces first.',
  },
  {
    title: 'How to use time savings strategically',
    description: 'Reinvest reclaimed hours into advisory work, deep focus, or client service.',
  },
];

const EMAIL_IMPACT_SNAPSHOT = {
  today: {
    emailsProcessed: 36,
    timeSavedHours: 1.4,
  },
  month: {
    hoursReclaimed: 18.5,
    valueReclaimed: 2220,
  },
  sinceJoining: {
    hoursSaved: 86.2,
    valueSaved: 10340,
  },
};

const automationTrend: AutomationPoint[] = [
  { label: 'Mon', value: 28 },
  { label: 'Tue', value: 42 },
  { label: 'Wed', value: 36 },
  { label: 'Thu', value: 51 },
  { label: 'Fri', value: 48 },
  { label: 'Sat', value: 22 },
  { label: 'Sun', value: 30 },
];

const categoryStats: CategoryStat[] = [
  { name: 'To respond', count: 124, percentage: 42 },
  { name: 'Awaiting reply', count: 63, percentage: 21 },
  { name: 'Actioned', count: 52, percentage: 18 },
  { name: 'Marketing', count: 32, percentage: 11 },
  { name: 'FYI', count: 23, percentage: 8 },
];

const quickActions = [
  {
    title: 'Connect another account',
    description: 'Bring in Yahoo, Outlook or any IMAP inbox.',
    cta: 'Connect',
    icon: '🔗',
    onClick: () => console.log('TODO: connect another account'),
  },
  {
    title: 'Adjust categories',
    description: 'Tune how Flowiee sorts your messages.',
    cta: 'Edit',
    icon: '🗂️',
    onClick: () => console.log('TODO: adjust categories'),
  },
  {
    title: 'Review draft prompt',
    description: 'Improve AI tone and messaging guidance.',
    cta: 'Review',
    icon: '✍️',
    onClick: () => console.log('TODO: review draft prompt'),
  },
  {
    title: 'Check integrations',
    description: 'Confirm CRM and calendar automations.',
    cta: 'View',
    icon: '⚙️',
    onClick: () => console.log('TODO: check integrations'),
  },
];

const MetricCard: FC<{ metric: Metric }> = ({ metric }) => (
  <div className="rounded-[28px] border border-white/70 bg-white/90 p-5 shadow-[0_25px_50px_rgba(15,23,42,0.08)] backdrop-blur dark:border-slate-800/60 dark:bg-slate-900/70 dark:shadow-black/40">
    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{metric.label}</p>
    <p className="mt-3 text-3xl font-semibold text-slate-900 dark:text-white">{metric.value}</p>
    <p className="mt-2 text-xs font-semibold text-emerald-500 dark:text-emerald-400">{metric.deltaText}</p>
  </div>
);

const QuickActionTile: FC<(typeof quickActions)[number]> = ({ title, description, cta, icon, onClick }) => (
  <div className="flex flex-col rounded-[28px] border border-white/70 bg-white/90 p-5 shadow-[0_25px_60px_rgba(15,23,42,0.08)] dark:border-slate-800/60 dark:bg-slate-900/70 dark:shadow-black/40">
    <div className="flex items-center gap-3">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-100 via-indigo-50 to-violet-100 text-xl dark:from-slate-800 dark:via-slate-900 dark:to-slate-950">
        {icon}
      </div>
      <div>
        <p className="text-base font-semibold text-slate-900 dark:text-white">{title}</p>
        <p className="text-sm text-slate-500 dark:text-slate-400">{description}</p>
      </div>
    </div>
    <div className="mt-4">
      <button
        onClick={onClick}
        className="inline-flex items-center justify-center rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-900 hover:text-slate-900 dark:border-slate-700 dark:text-slate-200 dark:hover:border-slate-200 dark:hover:text-white"
      >
        {cta}
      </button>
    </div>
  </div>
);

const VideoPlaceholderCard: FC<{ title: string; description?: string }> = ({ title, description }) => (
  <div className="rounded-[24px] border border-white/70 bg-white/90 p-4 shadow-[0_20px_45px_rgba(15,23,42,0.08)] dark:border-slate-800/60 dark:bg-slate-900/70 dark:shadow-black/40">
    <div className="relative flex aspect-video items-center justify-center overflow-hidden rounded-[20px] bg-gradient-to-br from-slate-100 via-slate-50 to-sky-100 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">
      <div className="absolute inset-0 opacity-60 mix-blend-multiply dark:opacity-40">
        <div className="absolute left-6 top-6 h-16 w-28 rounded-2xl bg-white/70 dark:bg-slate-800/70" />
        <div className="absolute bottom-6 right-6 h-12 w-20 rounded-2xl bg-white/70 dark:bg-slate-800/70" />
      </div>
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 text-2xl text-slate-700 shadow-md dark:bg-slate-950/80 dark:text-slate-200">
        ▶
      </div>
    </div>
    <div className="mt-4">
      <p className="text-base font-semibold text-slate-900 dark:text-white">{title}</p>
      {description ? <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{description}</p> : null}
    </div>
  </div>
);

const ImpactMetric: FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="flex flex-col gap-1 rounded-2xl border border-slate-200/60 bg-white/70 p-4 shadow-sm dark:border-slate-800/80 dark:bg-slate-900/50">
    <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">{label}</span>
    <span className="text-xl font-semibold text-slate-900 dark:text-white">{value}</span>
  </div>
);

const formatNumber = (value: number) => new Intl.NumberFormat('en-GB').format(Math.round(value));
const formatHours = (value: number) => `${value.toFixed(1)}h`;
const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    maximumFractionDigits: 0,
  }).format(value);

const DEFAULT_LAYOUT: LayoutItem[] = [
  { id: 'overview.onboarding', w: 12, h: 4 },
  { id: 'overview.historyAnalysis', w: 7, h: 3 },
  { id: 'overview.costCalculator', w: 5, h: 3 },
  { id: 'overview.emailImpact', w: 12, h: 3 },
  { id: 'overview.education', w: 12, h: 3 },
  { id: 'overview.hero', w: 12, h: 2 },
  { id: 'overview.metrics', w: 12, h: 2 },
  { id: 'overview.activity', w: 7, h: 3 },
  { id: 'overview.categoryBreakdown', w: 5, h: 3 },
  { id: 'overview.weeklySummary', w: 7, h: 3 },
  { id: 'overview.quickActions', w: 5, h: 4 },
];

const OVERVIEW_LAYOUT_STORAGE_KEY = 'overviewLayout';
const GRID_COLUMNS = 12;
const GRID_ROW_HEIGHT = 120;
const MIN_ITEM_SIZE = { w: 3, h: 2 };

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const loadLayout = () => {
  if (typeof window === 'undefined') {
    return DEFAULT_LAYOUT;
  }

  const raw = window.localStorage.getItem(OVERVIEW_LAYOUT_STORAGE_KEY);
  if (!raw) {
    return DEFAULT_LAYOUT;
  }

  try {
    const parsed = JSON.parse(raw) as LayoutItem[];
    if (!Array.isArray(parsed)) {
      return DEFAULT_LAYOUT;
    }
    const sanitized = parsed
      .filter((item) => typeof item?.id === 'string')
      .map((item) => ({
        id: item.id,
        w: clamp(Number(item.w) || 1, MIN_ITEM_SIZE.w, GRID_COLUMNS),
        h: clamp(Number(item.h) || 1, MIN_ITEM_SIZE.h, 8),
      }));
    const knownIds = new Set(sanitized.map((item) => item.id));
    const missing = DEFAULT_LAYOUT.filter((item) => !knownIds.has(item.id));
    return [...sanitized, ...missing];
  } catch {
    return DEFAULT_LAYOUT;
  }
};

interface DashboardViewProps {
  visibility: Record<string, boolean>;
  isMaster: boolean;
  isLayoutEditingEnabled: boolean;
}

export const DashboardView: FC<DashboardViewProps> = ({ visibility, isMaster, isLayoutEditingEnabled }) => {
  const maxTrendValue = Math.max(...automationTrend.map((point) => point.value));
  const gridRef = useRef<HTMLDivElement | null>(null);
  const connectSectionRef = useRef<HTMLDivElement | null>(null);
  const [layout, setLayout] = useState<LayoutItem[]>(() => loadLayout());
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);
  const [resizeState, setResizeState] = useState<ResizeState | null>(null);
  const [connectedProvider, setConnectedProvider] = useState<string | null>(null);
  const [assumptions] = useState<EmailAssumptions>(EMAIL_ASSUMPTIONS);
  const [estimatedEmailVolume] = useState(12480);
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [hourlyRate, setHourlyRate] = useState<number>(ROLE_OPTIONS.find((role) => role.value === 'accountant')?.defaultRate ?? 120);
  const canEditLayout = isMaster && isLayoutEditingEnabled;

  const visibleLayout = useMemo(() => layout.filter((item) => visibility[item.id]), [layout, visibility]);
  const isInboxConnected = Boolean(connectedProvider);

  const estimatedHistory = useMemo(() => {
    const totalEmails = estimatedEmailVolume;
    const readHours = (totalEmails * assumptions.averageReadSeconds) / 3600;
    const responseHours = (totalEmails * assumptions.responseRate * assumptions.averageResponseMinutes) / 60;
    const totalHours = readHours + responseHours;
    return {
      totalEmails,
      readHours,
      responseHours,
      totalHours,
    };
  }, [assumptions, estimatedEmailVolume]);

  const estimatedAnnualCost = useMemo(
    () => estimatedHistory.totalHours * hourlyRate,
    [estimatedHistory.totalHours, hourlyRate],
  );

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    window.localStorage.setItem(OVERVIEW_LAYOUT_STORAGE_KEY, JSON.stringify(layout));
  }, [layout]);

  useEffect(() => {
    if (!resizeState) {
      return;
    }

    const handlePointerMove = (event: PointerEvent) => {
      const columnWidth = resizeState.gridWidth / GRID_COLUMNS;
      const deltaX = event.clientX - resizeState.startX;
      const deltaY = event.clientY - resizeState.startY;
      const nextW = clamp(
        resizeState.startW + Math.round(deltaX / columnWidth),
        MIN_ITEM_SIZE.w,
        GRID_COLUMNS,
      );
      const nextH = clamp(resizeState.startH + Math.round(deltaY / GRID_ROW_HEIGHT), MIN_ITEM_SIZE.h, 10);

      setLayout((prev) =>
        prev.map((item) => (item.id === resizeState.id ? { ...item, w: nextW, h: nextH } : item)),
      );
    };

    const handlePointerUp = () => {
      setResizeState(null);
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [resizeState]);

  const handleDragStart = (id: string) => (event: DragEvent<HTMLButtonElement>) => {
    if (!canEditLayout) {
      return;
    }
    setDraggedId(id);
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/plain', id);
  };

  const handleDragOver = (id: string) => (event: DragEvent<HTMLDivElement>) => {
    if (!canEditLayout) {
      return;
    }
    event.preventDefault();
    setDragOverId(id);
  };

  const handleDragLeave = () => {
    setDragOverId(null);
  };

  const handleDrop = (id: string) => (event: DragEvent<HTMLDivElement>) => {
    if (!canEditLayout) {
      return;
    }
    event.preventDefault();
    const dragged = draggedId ?? event.dataTransfer.getData('text/plain');
    setDragOverId(null);
    setDraggedId(null);

    if (!dragged || dragged === id) {
      return;
    }

    setLayout((prev) => {
      const next = [...prev];
      const fromIndex = next.findIndex((item) => item.id === dragged);
      const toIndex = next.findIndex((item) => item.id === id);
      if (fromIndex === -1 || toIndex === -1) {
        return prev;
      }
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);
      return next;
    });
  };

  const handleResizeStart = (id: string) => (event: React.PointerEvent<HTMLButtonElement>) => {
    if (!canEditLayout || !gridRef.current) {
      return;
    }
    event.preventDefault();
    event.stopPropagation();

    const item = layout.find((entry) => entry.id === id);
    if (!item) {
      return;
    }

    const gridRect = gridRef.current.getBoundingClientRect();
    setResizeState({
      id,
      startX: event.clientX,
      startY: event.clientY,
      startW: item.w,
      startH: item.h,
      gridWidth: gridRect.width,
    });
  };

  const handleConnectProvider = (provider: string) => {
    setConnectedProvider(provider);
  };

  const handleScrollToConnect = () => {
    if (!connectSectionRef.current) {
      return;
    }
    connectSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleRoleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const nextRole = event.target.value;
    setSelectedRole(nextRole);
    const matchedRole = ROLE_OPTIONS.find((role) => role.value === nextRole);
    if (matchedRole) {
      setHourlyRate(matchedRole.defaultRate);
    }
  };

  const sectionContent: Record<string, JSX.Element> = {
    'overview.onboarding': (
      <section className="rounded-[32px] border border-white/70 bg-white/90 p-8 shadow-[0_35px_90px_rgba(15,23,42,0.12)] dark:border-slate-800/60 dark:bg-slate-900/70 dark:shadow-black/40">
        <div className="flex flex-col gap-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">New user experience</p>
            <h2 className="mt-3 text-2xl font-semibold text-slate-900 dark:text-white">
              Start by measuring what your inbox is really costing you.
            </h2>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              We will guide you through connection, estimation, and the control panel in a few short steps.
            </p>
          </div>
          <div className="rounded-[28px] border border-slate-200/70 bg-slate-50/80 p-6 dark:border-slate-800/70 dark:bg-slate-950/60">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">Step 1</p>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Intro Video – Problem, Solution, What to Expect
              </span>
            </div>
            <div className="mt-4">
              <div className="relative flex aspect-video items-center justify-center overflow-hidden rounded-[24px] bg-gradient-to-br from-slate-100 via-white to-sky-100 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">
                <div className="absolute inset-0 opacity-60 mix-blend-multiply dark:opacity-40">
                  <div className="absolute left-6 top-6 h-16 w-28 rounded-2xl bg-white/70 dark:bg-slate-800/70" />
                  <div className="absolute bottom-6 right-6 h-12 w-20 rounded-2xl bg-white/70 dark:bg-slate-800/70" />
                </div>
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/90 text-3xl text-slate-700 shadow-md dark:bg-slate-950/80 dark:text-slate-200">
                  ▶
                </div>
              </div>
              <div className="mt-5 space-y-3">
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                  Your inbox isn’t disorganised. It’s unmeasured.
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Email creates hidden time and cost that rarely make it into planning. Flowiee makes that impact visible so
                  you can control it with confidence.
                </p>
                <button
                  type="button"
                  onClick={handleScrollToConnect}
                  className="inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
                >
                  Connect my inbox to see my numbers
                </button>
              </div>
            </div>
          </div>
          <div
            ref={connectSectionRef}
            id="connect-inbox"
            className="rounded-[28px] border border-slate-200/70 bg-slate-50/80 p-6 dark:border-slate-800/70 dark:bg-slate-950/60"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">Step 2</p>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Email connection</span>
            </div>
            <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
              Connect Gmail or Outlook so we can estimate your last {assumptions.periodMonths} months of email impact.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => handleConnectProvider('Gmail')}
                className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-900 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-slate-200 dark:hover:text-white"
              >
                Connect Gmail
              </button>
              <button
                type="button"
                onClick={() => handleConnectProvider('Outlook')}
                className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-900 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-slate-200 dark:hover:text-white"
              >
                Connect Outlook
              </button>
            </div>
            {isInboxConnected ? (
              <div className="mt-4 rounded-2xl border border-emerald-200/60 bg-emerald-50/80 p-4 text-sm text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-200">
                Connected to {connectedProvider}. Reviewing the last {assumptions.periodMonths} months now.
              </div>
            ) : null}
          </div>
        </div>
      </section>
    ),
    'overview.historyAnalysis': (
      <section className="h-full rounded-[32px] border border-white/70 bg-white/90 p-6 shadow-[0_35px_80px_rgba(15,23,42,0.12)] dark:border-slate-800/60 dark:bg-slate-900/70 dark:shadow-black/40">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Email history analysis</p>
            <p className="text-lg font-semibold text-slate-900 dark:text-white">
              Estimated impact over the last {assumptions.periodMonths} months
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-400">Estimated based on typical professional usage</span>
        </div>
        {isInboxConnected ? (
          <div className="mt-6 space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-200/60 bg-slate-50/80 p-4 dark:border-slate-800/70 dark:bg-slate-950/40">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Emails received</p>
                <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">
                  {formatNumber(estimatedHistory.totalEmails)}
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200/60 bg-slate-50/80 p-4 dark:border-slate-800/70 dark:bg-slate-950/40">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Reading time</p>
                <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">
                  {formatHours(estimatedHistory.readHours)}
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200/60 bg-slate-50/80 p-4 dark:border-slate-800/70 dark:bg-slate-950/40">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Response time</p>
                <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">
                  {formatHours(estimatedHistory.responseHours)}
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200/60 bg-slate-50/80 p-4 dark:border-slate-800/70 dark:bg-slate-950/40">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Total time on email</p>
                <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">
                  {formatHours(estimatedHistory.totalHours)}
                </p>
              </div>
            </div>
            <div className="rounded-2xl border border-slate-200/70 bg-slate-50/80 p-5 text-sm text-slate-600 dark:border-slate-800/70 dark:bg-slate-950/40 dark:text-slate-300">
              <p className="font-semibold text-slate-700 dark:text-slate-200">
                In the last {assumptions.periodMonths} months, your inbox demanded approximately:
              </p>
              <ul className="mt-3 space-y-1">
                <li>• {formatNumber(estimatedHistory.totalEmails)} emails</li>
                <li>• {formatHours(estimatedHistory.totalHours)} of attention</li>
              </ul>
              <p className="mt-3 text-xs text-slate-400">These numbers aren’t here to judge — they’re here to give you control.</p>
            </div>
            <p className="text-xs text-slate-400">
              Assumptions: {assumptions.averageReadSeconds}s average read time, {assumptions.averageResponseMinutes} minutes
              average response time, {Math.round(assumptions.responseRate * 100)}% of emails require a response.
            </p>
          </div>
        ) : (
          <div className="mt-6 rounded-2xl border border-dashed border-slate-200/70 bg-slate-50/80 p-6 text-sm text-slate-500 dark:border-slate-800/70 dark:bg-slate-950/40 dark:text-slate-400">
            Connect your inbox to calculate your estimated history and make the hidden time visible.
          </div>
        )}
      </section>
    ),
    'overview.costCalculator': (
      <section className="h-full rounded-[32px] border border-white/70 bg-white/90 p-6 shadow-[0_30px_70px_rgba(15,23,42,0.12)] dark:border-slate-800/60 dark:bg-slate-900/70 dark:shadow-black/40">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Email cost calculator</p>
            <p className="text-lg font-semibold text-slate-900 dark:text-white">Turn time into a measurable value</p>
          </div>
          <span className="text-xs font-semibold text-slate-400">Estimated</span>
        </div>
        {isInboxConnected ? (
          <div className="mt-6 space-y-6">
            <div className="grid gap-4">
              <label className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                Role (optional)
                <select
                  value={selectedRole}
                  onChange={handleRoleChange}
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm focus:border-slate-400 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                >
                  <option value="">Select role</option>
                  {ROLE_OPTIONS.map((role) => (
                    <option key={role.value} value={role.value}>
                      {role.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                Charge-out rate
                <div className="relative mt-2">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-500">£</span>
                  <input
                    type="number"
                    min={0}
                    step={5}
                    value={hourlyRate}
                    onChange={(event) => setHourlyRate(Number(event.target.value))}
                    className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-8 pr-4 text-sm text-slate-700 shadow-sm focus:border-slate-400 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                  />
                </div>
              </label>
            </div>
            <div className="rounded-2xl border border-slate-200/70 bg-slate-50/80 p-5 text-sm text-slate-600 dark:border-slate-800/70 dark:bg-slate-950/40 dark:text-slate-300">
              <p className="font-semibold text-slate-700 dark:text-slate-200">
                {formatHours(estimatedHistory.totalHours)} × {formatCurrency(hourlyRate)} = estimated annual email cost
              </p>
              <p className="mt-3 text-2xl font-semibold text-slate-900 dark:text-white">
                Estimated annual cost of email: {formatCurrency(estimatedAnnualCost)}
              </p>
              <p className="mt-2 text-xs text-slate-400">This reflects the value of your time, not money paid out.</p>
            </div>
          </div>
        ) : (
          <div className="mt-6 rounded-2xl border border-dashed border-slate-200/70 bg-slate-50/80 p-6 text-sm text-slate-500 dark:border-slate-800/70 dark:bg-slate-950/40 dark:text-slate-400">
            Connect your inbox to pull in total hours and unlock a personalised cost estimate.
          </div>
        )}
      </section>
    ),
    'overview.emailImpact': (
      <section className="rounded-[32px] border border-white/70 bg-white/90 p-6 shadow-[0_30px_70px_rgba(15,23,42,0.12)] dark:border-slate-800/60 dark:bg-slate-900/70 dark:shadow-black/40">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Email Impact</p>
            <p className="text-lg font-semibold text-slate-900 dark:text-white">
              A calm view of what Flowiee is reclaiming for you
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-400">Updated daily</span>
        </div>
        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          <div className="rounded-2xl border border-slate-200/70 bg-slate-50/80 p-5 dark:border-slate-800/70 dark:bg-slate-950/40">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Today</p>
            <div className="mt-4 grid gap-3">
              <ImpactMetric label="Emails processed" value={formatNumber(EMAIL_IMPACT_SNAPSHOT.today.emailsProcessed)} />
              <ImpactMetric label="Estimated time saved" value={formatHours(EMAIL_IMPACT_SNAPSHOT.today.timeSavedHours)} />
            </div>
          </div>
          <div className="rounded-2xl border border-slate-200/70 bg-slate-50/80 p-5 dark:border-slate-800/70 dark:bg-slate-950/40">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">This month</p>
            <div className="mt-4 grid gap-3">
              <ImpactMetric label="Hours reclaimed" value={formatHours(EMAIL_IMPACT_SNAPSHOT.month.hoursReclaimed)} />
              <ImpactMetric label="Value reclaimed" value={formatCurrency(EMAIL_IMPACT_SNAPSHOT.month.valueReclaimed)} />
            </div>
          </div>
          <div className="rounded-2xl border border-slate-200/70 bg-slate-50/80 p-5 dark:border-slate-800/70 dark:bg-slate-950/40">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Since joining Flowiee</p>
            <div className="mt-4 grid gap-3">
              <ImpactMetric label="Total hours saved" value={formatHours(EMAIL_IMPACT_SNAPSHOT.sinceJoining.hoursSaved)} />
              <ImpactMetric label="Total value saved" value={formatCurrency(EMAIL_IMPACT_SNAPSHOT.sinceJoining.valueSaved)} />
            </div>
          </div>
        </div>
      </section>
    ),
    'overview.education': (
      <section className="rounded-[32px] border border-white/70 bg-white/90 p-6 shadow-[0_30px_70px_rgba(15,23,42,0.12)] dark:border-slate-800/60 dark:bg-slate-900/70 dark:shadow-black/40">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Understanding your email</p>
            <p className="text-lg font-semibold text-slate-900 dark:text-white">
              Short briefings to support better decisions
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-400">Video placeholders</span>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {EDUCATION_VIDEOS.map((video) => (
            <VideoPlaceholderCard key={video.title} title={video.title} description={video.description} />
          ))}
        </div>
      </section>
    ),
    'overview.hero': (
      <section className="rounded-[32px] border border-white/70 bg-gradient-to-br from-white via-slate-50 to-[#e4f3ff] p-8 shadow-[0_35px_90px_rgba(15,23,42,0.15)] dark:border-slate-800/60 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900 dark:shadow-black/40">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-sky-500 dark:text-sky-300">Dashboard</p>
            <h1 className="mt-2 text-3xl font-semibold leading-tight text-slate-900 dark:text-white md:text-4xl">
              Welcome back, Kevin
            </h1>
            <p className="mt-2 text-base text-slate-500 dark:text-slate-400">
              Gmail connected · Calendar not connected
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-sky-500 via-indigo-500 to-violet-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30">
              Continue setup
            </button>
            <button className="inline-flex items-center justify-center rounded-full border border-white/70 bg-white/70 px-6 py-3 text-sm font-semibold text-slate-700 shadow-sm dark:border-slate-700/70 dark:bg-slate-900/60 dark:text-slate-100">
              View all settings
            </button>
          </div>
        </div>
      </section>
    ),
    'overview.metrics': (
      <section>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {metrics.map((metric) => (
            <MetricCard key={metric.id} metric={metric} />
          ))}
        </div>
      </section>
    ),
    'overview.activity': (
      <section className="h-full rounded-[32px] border border-white/70 bg-white/90 p-6 shadow-[0_30px_60px_rgba(15,23,42,0.1)] dark:border-slate-800/60 dark:bg-slate-900/70 dark:shadow-black/40">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Automation activity</p>
            <p className="text-lg font-semibold text-slate-900 dark:text-white">Last 7 days</p>
          </div>
          <span className="text-xs text-emerald-500 dark:text-emerald-400">Live</span>
        </div>
        <div className="mt-6 h-36">
          <div className="flex h-full items-end gap-3">
            {automationTrend.map((point) => (
              <div key={point.label} className="flex w-full flex-col items-center gap-2">
                <div
                  className="w-full rounded-t-[20px] bg-gradient-to-t from-sky-200 to-sky-500 dark:from-sky-900 dark:to-sky-500"
                  style={{ height: `${(point.value / maxTrendValue) * 100}%` }}
                ></div>
                <span className="text-xs text-slate-500 dark:text-slate-400">{point.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    ),
    'overview.categoryBreakdown': (
      <section className="h-full rounded-[32px] border border-white/70 bg-white/90 p-6 shadow-[0_30px_60px_rgba(15,23,42,0.1)] dark:border-slate-800/60 dark:bg-slate-900/70 dark:shadow-black/40">
        <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Category breakdown</p>
        <p className="text-lg font-semibold text-slate-900 dark:text-white">Where Flowiee filed things</p>
        <div className="mt-6 space-y-4">
          {categoryStats.map((category) => (
            <div key={category.name}>
              <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-300">
                <span>{category.name}</span>
                <span>{category.count}</span>
              </div>
              <div className="mt-2 h-2 rounded-full bg-slate-100 dark:bg-slate-800">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-sky-400 via-indigo-400 to-violet-400"
                  style={{ width: `${category.percentage}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </section>
    ),
    'overview.weeklySummary': (
      <section className="h-full rounded-[32px] border border-white/70 bg-white/90 p-6 shadow-[0_30px_70px_rgba(15,23,42,0.12)] dark:border-slate-800/60 dark:bg-slate-900/70 dark:shadow-black/40">
        <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">What Flowiee did for you this week</p>
        <p className="mt-3 text-4xl font-semibold text-slate-900 dark:text-white">
          This week Flowiee saved you 2h 18m
        </p>
        <ul className="mt-6 space-y-2 text-slate-600 dark:text-slate-300">
          <li>• 318 emails analysed</li>
          <li>• 27 draft replies generated</li>
          <li>• 15 follow-ups created</li>
        </ul>
        <p className="mt-4 text-xs text-slate-400 dark:text-slate-500">
          * Based on estimated automations and time saved.
        </p>
      </section>
    ),
    'overview.quickActions': (
      <section className="h-full rounded-[32px] border border-white/70 bg-white/90 p-6 shadow-[0_35px_80px_rgba(15,23,42,0.12)] dark:border-slate-800/60 dark:bg-slate-900/70 dark:shadow-black/40">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Quick actions</p>
            <p className="text-xl font-semibold text-slate-900 dark:text-white">Keep Flowiee tuned</p>
          </div>
          <span className="text-xs text-slate-400 dark:text-slate-500">4 suggestions</span>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
          {quickActions.map((action) => (
            <QuickActionTile key={action.title} {...action} />
          ))}
        </div>
      </section>
    ),
  };

  return (
    <div className="space-y-4 text-slate-800 dark:text-slate-200">
      {isMaster ? (
        <div className="rounded-3xl border border-dashed border-sky-200 bg-sky-50/70 px-4 py-3 text-sm text-slate-600 dark:border-slate-700/70 dark:bg-slate-900/60 dark:text-slate-300">
          {canEditLayout
            ? 'Layout editing is enabled. Drag tiles by the handle and resize from the lower-right corner.'
            : 'Layout editing is disabled. Re-enable it from the master login screen.'}
        </div>
      ) : null}
      <div
        ref={gridRef}

        onDragLeave={handleDragLeave}
      >
        {visibleLayout.map((item) => (
          <div
            key={item.id}

            onDragOver={handleDragOver(item.id)}
            onDrop={handleDrop(item.id)}
          >
            {canEditLayout ? (
              <div className="pointer-events-none absolute inset-0 rounded-[32px] border border-transparent transition group-hover:border-sky-200" />
            ) : null}
            <div className="relative h-full">
              {sectionContent[item.id]}
              {canEditLayout ? (
                <div className="absolute right-4 top-4 flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-slate-500 shadow-sm backdrop-blur dark:bg-slate-900/80 dark:text-slate-300">
                  <span className="pointer-events-none">Move</span>
                  <button
                    type="button"
                    draggable
                    onDragStart={handleDragStart(item.id)}
                    onDragEnd={() => setDraggedId(null)}
                    className="pointer-events-auto cursor-grab rounded-full bg-slate-100 px-2 py-0.5 text-slate-600 active:cursor-grabbing dark:bg-slate-800 dark:text-slate-200"
                    aria-label="Drag to move section"
                  >
                    ⇅
                  </button>
                </div>
              ) : null}
              {canEditLayout ? (
                <button
                  type="button"
                  onPointerDown={handleResizeStart(item.id)}
                  className="absolute bottom-4 right-4 inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-900/80 text-xs text-white shadow-lg dark:bg-slate-100/90 dark:text-slate-900"
                  aria-label="Resize section"
                >
                  ↘
                </button>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
