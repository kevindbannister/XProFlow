export type MainView = 'overview' | 'classifier' | 'settings' | 'billing' | 'team' | 'account' | 'setup';

export type SettingsTab =
  | 'preferences'
  | 'emailRules'
  | 'draftReplies'
  | 'followUps'
  | 'scheduling'
  | 'meetingNotetaker'
  | 'integrations'
  | 'faq'
  | 'roles';

export interface Category {
  id: string;
  name: string;
  description: string;
  color: string;
  active: boolean;
}

export interface EmailRule {
  id: string;
  value: string;
  categoryId: string;
}

export interface Integration {
  id: string;
  name: string;
  description: string;
  connected: boolean;
}

export interface Meeting {
  id: string;
  date: string;
  title: string;
  platform: 'Zoom' | 'Teams' | 'Meet';
  sendToNotetaker: boolean;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Member';
  status: 'Active' | 'Invited';
}

export interface Plan {
  name: string;
  seatsUsed: number;
  seatsTotal: number;
  nextBillingDate: string;
}

export interface UserProfile {
  name: string;
  email: string;
  company: string;
}

export type ThinkingMode = 'Processor' | 'Reviewer' | 'Advisor' | 'Owner';

export interface RoleProfile {
  primaryRole: string;
  secondaryRoles: string[];
  responsibilities: string[];
  industryFocus: string[];
  lastUpdatedAt: string | null;
  thinkingMode: ThinkingMode;
}
