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

const metricPlaceholders: Metric[] = [
  {
    id: 'analysed',
    label: 'Emails analysed today',
    value: '—',
    deltaText: 'Syncing inbox activity',
  },
  {
    id: 'categorized',
    label: 'Emails categorised',
    value: '—',
    deltaText: 'Assigning categories',
  },
  {
    id: 'drafts',
    label: 'AI draft replies generated',
    value: '—',
    deltaText: 'Reviewing drafted replies',
  },
  {
    id: 'followups',
    label: 'Follow-ups created',
    value: '—',
    deltaText: 'Building follow-up plan',
  },
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
  { name: 'Activated', count: 33, percentage: 18 },
  { name: 'Marketing', count: 33, percentage: 11 },
  { name: 'FYI', count: 19, percentage: 8 },
];

const quickActions = [
  {
    title: 'Keep Flowiee tuned',
    description: 'Connect another Gmail, Outlook, or IMAP inbox.',
    cta: 'Connect',
    icon: '🔒',
    onClick: () => console.log('TODO: connect another account'),
  },
  {
    title: 'Check integrations',
    description: 'Confirm CRM, calendar, and automation connections.',
    cta: 'View',
    icon: '🧩',
    onClick: () => console.log('TODO: check integrations'),
  },
];

const weeklyHighlights = [
  { label: 'Emails analyzed', value: '318', subtext: 'Last 7 days' },
  { label: 'Draft reply suggestions', value: '37', subtext: 'Last 7 days' },
  { label: 'Follow-up tasks created', value: '15', subtext: 'See more tags' },
];

const MetricCard: FC<{ metric: Metric; isPlaceholder?: boolean }> = ({ metric, isPlaceholder }) => (
  <div
    className={`rounded-[28px] border border-white/70 bg-white/80 p-5 shadow-[0_20px_45px_rgba(15,23,42,0.08)] backdrop-blur dark:border-slate-800/60 dark:bg-slate-900/70 dark:shadow-black/40 ${
      isPlaceholder ? 'animate-pulse' : ''
    }`}
  >
    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{metric.label}</p>
    <p
      className={`mt-3 text-3xl font-semibold ${
        isPlaceholder ? 'text-slate-400 dark:text-slate-500' : 'text-slate-900 dark:text-white'
      }`}
    >
      {metric.value}
    </p>
    <p
      className={`mt-2 text-xs font-semibold ${
        isPlaceholder ? 'text-slate-400 dark:text-slate-500' : 'text-emerald-500 dark:text-emerald-400'
      }`}
    >
      {metric.deltaText}
    </p>
  </div>
);

const QuickActionTile: FC<(typeof quickActions)[number]> = ({ title, description, cta, icon, onClick }) => (
  <div className="flex flex-col rounded-[26px] border border-white/70 bg-white/85 p-5 shadow-[0_22px_50px_rgba(15,23,42,0.08)] dark:border-slate-800/60 dark:bg-slate-900/70 dark:shadow-black/40">
    <div className="flex items-center gap-3">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-100 via-indigo-50 to-violet-100 text-xl shadow-inner dark:from-slate-800 dark:via-slate-900 dark:to-slate-950">
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
        className="inline-flex items-center justify-center rounded-full border border-slate-200/80 bg-white/80 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-900 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-200 dark:hover:border-slate-200 dark:hover:text-white"
      >
        {cta}
      </button>
    </div>
  </div>
);

const VideoPlaceholderCard: FC<{ title: string; description?: string }> = ({ title, description }) => (
  <div className="rounded-[24px] border border-white/70 bg-white/85 p-4 shadow-[0_20px_45px_rgba(15,23,42,0.08)] dark:border-slate-800/60 dark:bg-slate-900/70 dark:shadow-black/40">
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
  connectedProvider: string | null;
  onContinueSetup: () => void;
}

export const DashboardView: FC<DashboardViewProps> = ({
  visibility,
  isMaster,
  isLayoutEditingEnabled,
  connectedProvider,
  onContinueSetup,
}) => {
  const maxTrendValue = Math.max(...automationTrend.map((point) => point.value));
  const gridRef = useRef<HTMLDivElement | null>(null);
  const [layout, setLayout] = useState<LayoutItem[]>(() => loadLayout());
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);
  const [resizeState, setResizeState] = useState<ResizeState | null>(null);
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

  const handleRoleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const nextRole = event.target.value;
    setSelectedRole(nextRole);
    const matchedRole = ROLE_OPTIONS.find((role) => role.value === nextRole);
    if (matchedRole) {
      setHourlyRate(matchedRole.defaultRate);
    }
  };

  const sectionContent: Record<string, JSX.Element> = {
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
      <section className="rounded-[32px] border border-white/70 bg-white/85 p-6 shadow-[0_30px_70px_rgba(15,23,42,0.12)] dark:border-slate-800/60 dark:bg-slate-900/70 dark:shadow-black/40">
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
      <section className="relative overflow-hidden rounded-[32px] border border-white/70 bg-gradient-to-br from-white via-[#f3f7ff] to-[#dfefff] p-8 shadow-[0_35px_90px_rgba(15,23,42,0.15)] dark:border-slate-800/60 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900 dark:shadow-black/40">
        <div className="absolute right-8 top-8 hidden h-40 w-56 rounded-[28px] bg-white/60 shadow-[0_25px_60px_rgba(59,130,246,0.2)] backdrop-blur md:block" />
        <div className="absolute -right-10 -top-10 hidden h-40 w-40 rounded-full bg-sky-200/40 blur-2xl md:block" />
        <div className="absolute -bottom-12 right-16 hidden h-36 w-36 rounded-full bg-indigo-200/40 blur-2xl md:block" />
        <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold text-sky-500 dark:text-sky-300">👋 Welcome back</p>
            <h1 className="mt-2 text-3xl font-semibold leading-tight text-slate-900 dark:text-white md:text-4xl">
              Kevin, your inbox is running smoothly
            </h1>
            <p className="mt-2 text-base text-slate-500 dark:text-slate-400">
              Gmail connected · Calendar not connected
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={onContinueSetup}
                className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-sky-500 via-indigo-500 to-violet-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30"
              >
                Connect new inbox
              </button>
              <button className="inline-flex items-center justify-center rounded-full border border-white/70 bg-white/70 px-6 py-3 text-sm font-semibold text-slate-700 shadow-sm dark:border-slate-700/70 dark:bg-slate-900/60 dark:text-slate-100">
                View all settings →
              </button>
            </div>
          </div>
          <div className="relative hidden w-64 flex-col gap-4 rounded-[28px] border border-white/70 bg-white/60 p-5 shadow-[0_25px_60px_rgba(15,23,42,0.12)] backdrop-blur dark:border-slate-800/60 dark:bg-slate-900/60 md:flex">
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-xl shadow">✉️</span>
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">Unified inbox</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Automation running</p>
              </div>
            </div>
            <div className="flex gap-2">
              {['📨', '🧠', '🗂️', '⚡'].map((icon) => (
                <span
                  key={icon}
                  className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/90 text-lg shadow-sm dark:bg-slate-900/80"
                >
                  {icon}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>
    ),
    'overview.metrics': (
      <section>
        {isInboxConnected ? (
          <>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {metricPlaceholders.map((metric) => (
                <MetricCard key={metric.id} metric={metric} isPlaceholder />
              ))}
            </div>
            <p className="mt-3 text-xs text-slate-400 dark:text-slate-500">
              We&apos;re still processing your inbox. Metrics will populate after the integration completes.
            </p>
          </>
        ) : (
          <div className="rounded-[28px] border border-dashed border-slate-200/70 bg-slate-50/80 p-5 text-sm text-slate-500 dark:border-slate-800/70 dark:bg-slate-950/40 dark:text-slate-400">
            Connect an inbox to unlock your live metrics.
          </div>
        )}
      </section>
    ),
    'overview.activity': (
      <section className="h-full rounded-[32px] border border-white/70 bg-white/85 p-6 shadow-[0_30px_60px_rgba(15,23,42,0.1)] dark:border-slate-800/60 dark:bg-slate-900/70 dark:shadow-black/40">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Automation activity</p>
            <p className="text-lg font-semibold text-slate-900 dark:text-white">Last 7 days</p>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-white/70 bg-white/80 px-3 py-1 text-xs font-semibold text-slate-500 shadow-sm dark:border-slate-800/70 dark:bg-slate-900/70 dark:text-slate-300">
            <span>Last 7 days</span>
            <span className="h-1 w-1 rounded-full bg-slate-300" />
            <span>Settings</span>
          </div>
        </div>
        <div className="mt-6 space-y-4">
          {automationTrend.map((point) => (
            <div key={point.label} className="flex items-center gap-3">
              <span className="w-8 text-xs font-semibold text-slate-500 dark:text-slate-400">{point.label}</span>
              <div className="flex-1 rounded-full bg-slate-100 dark:bg-slate-800">
                <div
                  className="h-2 rounded-full bg-gradient-to-r from-sky-400 via-indigo-400 to-violet-400"
                  style={{ width: `${(point.value / maxTrendValue) * 100}%` }}
                />
              </div>
              <span className="w-8 text-xs font-semibold text-slate-500 dark:text-slate-400">{point.value}</span>
            </div>
          ))}
        </div>
      </section>
    ),
    'overview.categoryBreakdown': (
      <section className="h-full rounded-[32px] border border-white/70 bg-white/85 p-6 shadow-[0_30px_60px_rgba(15,23,42,0.1)] dark:border-slate-800/60 dark:bg-slate-900/70 dark:shadow-black/40">
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
      <section className="h-full rounded-[32px] border border-white/70 bg-white/85 p-6 shadow-[0_30px_70px_rgba(15,23,42,0.12)] dark:border-slate-800/60 dark:bg-slate-900/70 dark:shadow-black/40">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">This week Flowiee saved you</p>
          <span className="text-xs text-slate-400">Last 7 days</span>
        </div>
        <p className="mt-3 text-3xl font-semibold text-slate-900 dark:text-white md:text-4xl">2h 18m</p>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {weeklyHighlights.map((highlight) => (
            <div
              key={highlight.label}
              className="rounded-[22px] border border-white/70 bg-white/80 p-4 shadow-[0_18px_40px_rgba(15,23,42,0.08)] dark:border-slate-800/70 dark:bg-slate-900/60"
            >
              <p className="text-2xl font-semibold text-slate-900 dark:text-white">{highlight.value}</p>
              <p className="mt-1 text-sm font-medium text-slate-600 dark:text-slate-300">{highlight.label}</p>
              <p className="mt-2 text-xs text-slate-400">{highlight.subtext}</p>
            </div>
          ))}
        </div>
        <p className="mt-4 text-xs text-slate-400 dark:text-slate-500">
          * Based on estimated automations and time saved.
        </p>
      </section>
    ),
    'overview.quickActions': (
      <section className="h-full rounded-[32px] border border-white/70 bg-white/85 p-6 shadow-[0_35px_80px_rgba(15,23,42,0.12)] dark:border-slate-800/60 dark:bg-slate-900/70 dark:shadow-black/40">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Quick actions</p>
            <p className="text-xl font-semibold text-slate-900 dark:text-white">Keep Flowiee tuned</p>
          </div>
          <span className="text-xs text-slate-400 dark:text-slate-500">{quickActions.length} suggestions</span>
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
    <div className="space-y-6 text-slate-800 dark:text-slate-200">
      {isMaster ? (
        <div className="rounded-3xl border border-dashed border-sky-200 bg-sky-50/70 px-4 py-3 text-sm text-slate-600 dark:border-slate-700/70 dark:bg-slate-900/60 dark:text-slate-300">
          {canEditLayout
            ? 'Layout editing is enabled. Drag tiles by the handle and resize from the lower-right corner.'
            : 'Layout editing is disabled. Re-enable it from the master login screen.'}
        </div>
      ) : null}
      <div
        ref={gridRef}
        className="grid gap-6 md:gap-8"
        onDragLeave={handleDragLeave}
      >
        {visibleLayout.map((item) => (
          <div
            key={item.id}
            className="group relative rounded-[36px] p-2 md:p-3"
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
