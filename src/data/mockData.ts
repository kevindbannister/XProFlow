import { Category, EmailRule, Integration, Meeting, Plan, TeamMember, UserProfile } from '../types';

export const categories: Category[] = [
  { id: 'respond', name: 'To respond', description: 'Needs an action soon', color: 'bg-emerald-500', active: true },
  { id: 'fyi', name: 'FYI', description: 'Informational only', color: 'bg-sky-500', active: true },
  { id: 'comment', name: 'Comment', description: 'Requesting feedback', color: 'bg-indigo-500', active: true },
  { id: 'notification', name: 'Notification', description: 'System alerts', color: 'bg-amber-500', active: true },
  { id: 'meeting', name: 'Meeting update', description: 'Meeting info', color: 'bg-purple-500', active: true },
  { id: 'awaiting', name: 'Awaiting reply', description: 'Waiting on others', color: 'bg-rose-500', active: true },
  { id: 'actioned', name: 'Actioned', description: 'Completed tasks', color: 'bg-lime-500', active: true },
  { id: 'marketing', name: 'Marketing', description: 'Campaign emails', color: 'bg-orange-500', active: false },
];

export const initialEmailRules: EmailRule[] = [
  { id: 'rule-1', value: 'vip@client.com', categoryId: 'respond' },
  { id: 'rule-2', value: 'newsletter', categoryId: 'marketing' },
];

export const integrations: Integration[] = [
  { id: 'gmail', name: 'Gmail', description: 'Connect your Gmail account', connected: true },
  { id: 'outlook', name: 'Outlook', description: 'Connect Outlook email', connected: false },
  { id: 'gcal', name: 'Google Calendar', description: 'Sync calendar availability', connected: true },
  { id: 'm365', name: 'Microsoft 365 Calendar', description: 'Sync with Microsoft 365', connected: false },
  { id: 'engager', name: 'Engager', description: 'Practice tool integration', connected: false },
  { id: 'pixie', name: 'Pixie', description: 'Practice workflow automation', connected: true },
];

export const meetings: Meeting[] = [
  { id: 'meet-1', date: 'Mar 12 · 09:00', title: 'Weekly sync with Ops', platform: 'Zoom', sendToNotetaker: true },
  { id: 'meet-2', date: 'Mar 13 · 14:30', title: 'Client onboarding', platform: 'Teams', sendToNotetaker: false },
  { id: 'meet-3', date: 'Mar 14 · 11:00', title: 'Product review', platform: 'Meet', sendToNotetaker: true },
];

export const plan: Plan = {
  name: 'Growth - Monthly',
  seatsUsed: 18,
  seatsTotal: 25,
  nextBillingDate: 'April 12, 2024',
};

export const teamMembers: TeamMember[] = [
  { id: 'tm-1', name: 'Kevin Brooks', email: 'kevin@firm.co.uk', role: 'Admin', status: 'Active' },
  { id: 'tm-2', name: 'Angela Flores', email: 'angela@firm.co.uk', role: 'Member', status: 'Active' },
  { id: 'tm-3', name: 'Marcus Hill', email: 'marcus@firm.co.uk', role: 'Member', status: 'Invited' },
];

export const userProfile: UserProfile = {
  name: 'Kevin Brooks',
  email: 'kevin@firm.co.uk',
  company: 'Fyxer Consulting',
};
