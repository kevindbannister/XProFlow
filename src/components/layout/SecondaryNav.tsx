import { Link, useLocation } from 'react-router-dom';
import {
  BookText,
  CalendarClock,
  CircuitBoard,
  FilePenLine,
  FolderKanban,
  Inbox,
  LayoutDashboard,
  LayoutTemplate,
  PenSquare,
  RadioTower,
  ScrollText,
  Send,
  Shapes,
  Signature,
  SlidersHorizontal,
  Sparkles,
  Stamp,
  UserRound,
  Waves,
  Workflow,
  Wrench,
  CreditCard,
  Headphones,
  Mic
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { SelectedModule } from './PrimaryNav';

type SecondaryNavProps = {
  selectedModule: SelectedModule;
  selectedItems: Record<SelectedModule, string>;
  onSelectItem: (module: SelectedModule, itemId: string) => void;
};

type NavItem = {
  id: string;
  label: string;
  icon: LucideIcon;
  to?: string;
  matchPrefix?: string;
};

const secondaryNavItems: Record<SelectedModule, NavItem[]> = {
  email: [
    { id: 'dashboard', label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
    { id: 'inbox', label: 'Inbox', to: '/inbox', icon: Inbox },
    { id: 'categorisation', label: 'Categorisation', to: '/categorisation', icon: Workflow },
    { id: 'rules', label: 'Rules', to: '/rules', icon: SlidersHorizontal },
    { id: 'drafting', label: 'Drafting', to: '/drafting', icon: PenSquare },
    { id: 'writing-style', label: 'Writing Style', to: '/writing-style', icon: Sparkles },
    { id: 'signature', label: 'Signature', to: '/signature', icon: Signature },
    { id: 'scheduling', label: 'Scheduling', to: '/scheduling', icon: CalendarClock },
    { id: 'integrations', label: 'Integrations', to: '/integrations', icon: CircuitBoard },
    { id: 'professional-context', label: 'Pro Context', to: '/professional-context', icon: Wrench },
    { id: 'account', label: 'Account', to: '/account', icon: UserRound },
    { id: 'billing', label: 'Billing', to: '/billing', icon: CreditCard },
    { id: 'onboarding', label: 'Onboarding', to: '/onboarding', icon: BookText, matchPrefix: '/onboarding/' }
  ],
  voice: [
    { id: 'overview', label: 'Overview', icon: Headphones },
    { id: 'prompts', label: 'Prompts', icon: Mic },
    { id: 'scripts', label: 'Scripts', icon: ScrollText },
    { id: 'tones', label: 'Tones', icon: Waves },
    { id: 'automation', label: 'Automation', icon: RadioTower },
    { id: 'quality', label: 'Quality', icon: Sparkles },
    { id: 'controls', label: 'Controls', icon: SlidersHorizontal }
  ],
  letters: [
    { id: 'overview', label: 'Overview', icon: BookText },
    { id: 'drafts', label: 'Drafts', icon: FilePenLine },
    { id: 'templates', label: 'Templates', icon: LayoutTemplate },
    { id: 'signoffs', label: 'Sign-offs', icon: Stamp },
    { id: 'delivery', label: 'Delivery', icon: Send },
    { id: 'matter-folders', label: 'Matter Folders', icon: FolderKanban },
    { id: 'styles', label: 'Styles', icon: Shapes }
  ]
};

const SecondaryNav = ({ selectedModule, selectedItems, onSelectItem }: SecondaryNavProps) => {
  const { pathname } = useLocation();
  const items = secondaryNavItems[selectedModule];

  return (
    <aside
      className="xp-sidebar flex h-full shrink-0 flex-col border-r border-slate-200/70 bg-white/70 pb-4 pt-20 dark:border-slate-800 dark:bg-[#0f1724]"
      style={{ width: 'var(--sidebar-width, 200px)' }}
      aria-label={`${selectedModule} navigation`}
    >
      <div className="px-3 pb-4">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">
          {selectedModule}
        </p>
      </div>
      <nav className="flex w-full min-h-0 flex-1 flex-col gap-1 overflow-y-auto">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = item.to
            ? pathname === item.to || (item.matchPrefix ? pathname.startsWith(item.matchPrefix) : false)
            : selectedItems[selectedModule] === item.id;

          if (item.to) {
            return (
              <Link
                key={item.id}
                to={item.to}
                className={`xp-nav-item flex w-full items-center gap-2.5 px-3 py-2 text-sm font-medium transition ${
                  isActive
                    ? 'rounded-l-xl bg-gradient-to-r from-[#27B0FF] to-[#3B82F6] text-white shadow-[0_10px_24px_rgba(59,130,246,0.24)] hover:brightness-[1.03]'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white'
                }`}
                data-active={isActive}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon className="h-4 w-4 shrink-0" strokeWidth={1.8} />
                <span className="truncate">{item.label}</span>
              </Link>
            );
          }

          return (
            <button
              key={item.id}
              type="button"
              className={`xp-nav-item flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm font-medium transition ${
                isActive
                  ? 'rounded-l-xl bg-gradient-to-r from-[#27B0FF] to-[#3B82F6] text-white shadow-[0_10px_24px_rgba(59,130,246,0.24)] hover:brightness-[1.03]'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white'
              }`}
              data-active={isActive}
              aria-pressed={isActive}
              onClick={() => onSelectItem(selectedModule, item.id)}
            >
              <Icon className="h-4 w-4 shrink-0" strokeWidth={1.8} />
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
};

export default SecondaryNav;
