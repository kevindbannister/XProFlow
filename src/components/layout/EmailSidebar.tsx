import {
  BriefcaseBusiness,
  CalendarClock,
  CircuitBoard,
  CreditCard,
  Inbox,
  LayoutDashboard,
  PenSquare,
  Signature,
  SlidersHorizontal,
  Sparkles,
  UserRound,
  Workflow,
  Wrench
} from 'lucide-react';
import { SidebarShell, type SidebarNavItem } from './SidebarShell';

type EmailSidebarProps = {
  isCollapsed: boolean;
  onToggleCollapsed: () => void;
};

const emailNavItems: SidebarNavItem[] = [
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
  { id: 'onboarding', label: 'Onboarding', to: '/onboarding', icon: BriefcaseBusiness, matchPrefix: '/onboarding/' }
];

const EmailSidebar = ({ isCollapsed, onToggleCollapsed }: EmailSidebarProps) => (
  <SidebarShell isCollapsed={isCollapsed} onToggleCollapsed={onToggleCollapsed} items={emailNavItems} />
);

export default EmailSidebar;
