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
  <div className="rounded-[28px] border border-white/70 bg-white/90 p-5 shadow-[0_25px_50px_rgba(15,23,42,0.08)] backdrop-blur">
    <p className="text-sm font-medium text-slate-500">{metric.label}</p>
    <p className="mt-3 text-3xl font-semibold text-slate-900">{metric.value}</p>
    <p className="mt-2 text-xs font-semibold text-emerald-500">{metric.deltaText}</p>
  </div>
);

const QuickActionTile: FC<(typeof quickActions)[number]> = ({ title, description, cta, icon, onClick }) => (
  <div className="flex flex-col rounded-[28px] border border-white/70 bg-white/90 p-5 shadow-[0_25px_60px_rgba(15,23,42,0.08)]">
    <div className="flex items-center gap-3">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-100 via-indigo-50 to-violet-100 text-xl">
        {icon}
      </div>
      <div>
        <p className="text-base font-semibold text-slate-900">{title}</p>
        <p className="text-sm text-slate-500">{description}</p>
      </div>
    </div>
    <div className="mt-4">
      <button
        onClick={onClick}
        className="inline-flex items-center justify-center rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-900 hover:text-slate-900"
      >
        {cta}
      </button>
    </div>
  </div>
);

const DEFAULT_LAYOUT: LayoutItem[] = [
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
}

export const DashboardView: FC<DashboardViewProps> = ({ visibility, isMaster }) => {
  const maxTrendValue = Math.max(...automationTrend.map((point) => point.value));
  const gridRef = useRef<HTMLDivElement | null>(null);
  const [layout, setLayout] = useState<LayoutItem[]>(() => loadLayout());
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);
  const [resizeState, setResizeState] = useState<ResizeState | null>(null);

  const visibleLayout = useMemo(() => layout.filter((item) => visibility[item.id]), [layout, visibility]);

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
    if (!isMaster) {
      return;
    }
    setDraggedId(id);
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/plain', id);
  };

  const handleDragOver = (id: string) => (event: DragEvent<HTMLDivElement>) => {
    if (!isMaster) {
      return;
    }
    event.preventDefault();
    setDragOverId(id);
  };

  const handleDragLeave = () => {
    setDragOverId(null);
  };

  const handleDrop = (id: string) => (event: DragEvent<HTMLDivElement>) => {
    if (!isMaster) {
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
    if (!isMaster || !gridRef.current) {
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

  const sectionContent: Record<string, JSX.Element> = {
    'overview.hero': (
      <section className="rounded-[32px] border border-white/70 bg-gradient-to-br from-white via-slate-50 to-[#e4f3ff] p-8 shadow-[0_35px_90px_rgba(15,23,42,0.15)]">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-sky-500">Dashboard</p>
            <h1 className="mt-2 text-3xl font-semibold leading-tight text-slate-900 md:text-4xl">Welcome back, Kevin</h1>
            <p className="mt-2 text-base text-slate-500">Gmail connected · Calendar not connected</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-sky-500 via-indigo-500 to-violet-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30">
              Continue setup
            </button>
            <button className="inline-flex items-center justify-center rounded-full border border-white/70 bg-white/70 px-6 py-3 text-sm font-semibold text-slate-700 shadow-sm">
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
      <section className="h-full rounded-[32px] border border-white/70 bg-white/90 p-6 shadow-[0_30px_60px_rgba(15,23,42,0.1)]">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-500">Automation activity</p>
            <p className="text-lg font-semibold text-slate-900">Last 7 days</p>
          </div>
          <span className="text-xs text-emerald-500">Live</span>
        </div>
        <div className="mt-6 h-36">
          <div className="flex h-full items-end gap-3">
            {automationTrend.map((point) => (
              <div key={point.label} className="flex w-full flex-col items-center gap-2">
                <div
                  className="w-full rounded-t-[20px] bg-gradient-to-t from-sky-200 to-sky-500"
                  style={{ height: `${(point.value / maxTrendValue) * 100}%` }}
                ></div>
                <span className="text-xs text-slate-500">{point.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    ),
    'overview.categoryBreakdown': (
      <section className="h-full rounded-[32px] border border-white/70 bg-white/90 p-6 shadow-[0_30px_60px_rgba(15,23,42,0.1)]">
        <p className="text-sm font-semibold text-slate-500">Category breakdown</p>
        <p className="text-lg font-semibold text-slate-900">Where Flowiee filed things</p>
        <div className="mt-6 space-y-4">
          {categoryStats.map((category) => (
            <div key={category.name}>
              <div className="flex items-center justify-between text-sm text-slate-600">
                <span>{category.name}</span>
                <span>{category.count}</span>
              </div>
              <div className="mt-2 h-2 rounded-full bg-slate-100">
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
      <section className="h-full rounded-[32px] border border-white/70 bg-white/90 p-6 shadow-[0_30px_70px_rgba(15,23,42,0.12)]">
        <p className="text-sm font-semibold text-slate-500">What Flowiee did for you this week</p>
        <p className="mt-3 text-4xl font-semibold text-slate-900">This week Flowiee saved you 2h 18m</p>
        <ul className="mt-6 space-y-2 text-slate-600">
          <li>• 318 emails analysed</li>
          <li>• 27 draft replies generated</li>
          <li>• 15 follow-ups created</li>
        </ul>
        <p className="mt-4 text-xs text-slate-400">* Based on estimated automations and time saved.</p>
      </section>
    ),
    'overview.quickActions': (
      <section className="h-full rounded-[32px] border border-white/70 bg-white/90 p-6 shadow-[0_35px_80px_rgba(15,23,42,0.12)]">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-500">Quick actions</p>
            <p className="text-xl font-semibold text-slate-900">Keep Flowiee tuned</p>
          </div>
          <span className="text-xs text-slate-400">4 suggestions</span>
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
    <div className="space-y-4 text-slate-800">
      {isMaster ? (
        <div className="rounded-3xl border border-dashed border-sky-200 bg-sky-50/70 px-4 py-3 text-sm text-slate-600">
          Layout editing is enabled. Drag tiles by the handle and resize from the lower-right corner.
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
            {isMaster ? (
              <div className="pointer-events-none absolute inset-0 rounded-[32px] border border-transparent transition group-hover:border-sky-200" />
            ) : null}
            <div className="relative h-full">
              {sectionContent[item.id]}
              {isMaster ? (
                <div className="absolute right-4 top-4 flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-slate-500 shadow-sm backdrop-blur">
                  <span className="pointer-events-none">Move</span>
                  <button
                    type="button"
                    draggable
                    onDragStart={handleDragStart(item.id)}
                    onDragEnd={() => setDraggedId(null)}
                    className="pointer-events-auto cursor-grab rounded-full bg-slate-100 px-2 py-0.5 text-slate-600 active:cursor-grabbing"
                    aria-label="Drag to move section"
                  >
                    ⇅
                  </button>
                </div>
              ) : null}
              {isMaster ? (
                <button
                  type="button"
                  onPointerDown={handleResizeStart(item.id)}
                  className="absolute bottom-4 right-4 inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-900/80 text-xs text-white shadow-lg"
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
