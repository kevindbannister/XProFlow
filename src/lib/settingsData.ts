import {
  IntegrationDefinition,
  LabelDefinition,
  OnboardingAccount,
  OnboardingStep,
  PreferenceToggle,
  RuleDefinition,
  SettingsSection,
  WorkflowDefinition
} from '../types/settings';

export const onboardingSteps: OnboardingStep[] = [
  {
    id: 'connect',
    title: 'Connect your primary inbox',
    description: 'Authenticate Gmail or Outlook so X-ProFlow can read and draft replies.',
    status: 'complete',
    actionLabel: 'Review connection'
  },
  {
    id: 'tone',
    title: 'Import writing samples',
    description: 'Upload recent sent emails to train tone, format, and sign-off preferences.',
    status: 'in-progress',
    actionLabel: 'Upload samples'
  },
  {
    id: 'labels',
    title: 'Confirm smart labels',
    description: 'Approve the labels X-ProFlow can apply so triage stays consistent.',
    status: 'todo',
    actionLabel: 'Review labels'
  },
  {
    id: 'rules',
    title: 'Set approval rules',
    description: 'Decide which messages need approval before sending or filing.',
    status: 'todo',
    actionLabel: 'Configure rules'
  }
];

export const onboardingAccounts: OnboardingAccount[] = [
  {
    id: 'acct-1',
    provider: 'Google Workspace',
    address: 'susan.smith@xproflow.com',
    status: 'connected',
    lastSync: 'Synced 12 minutes ago'
  },
  {
    id: 'acct-2',
    provider: 'Shared Support Inbox',
    address: 'support@xproflow.com',
    status: 'needs-review',
    lastSync: 'Permissions review required'
  }
];

export const onboardingPreferences: PreferenceToggle[] = [
  {
    id: 'approval',
    title: 'Require approval before sending',
    description: 'X-ProFlow will always queue drafts for manual review.',
    enabled: true
  },
  {
    id: 'auto-label',
    title: 'Allow auto-labeling',
    description: 'Apply smart labels to new mail so workflows run consistently.',
    enabled: true
  },
  {
    id: 'archive-low',
    title: 'Archive low-priority updates',
    description: 'File newsletters and FYIs after you confirm the label rules.',
    enabled: false
  }
];

export const settingsSections: SettingsSection[] = [
  {
    id: 'account',
    title: 'Account & workspace',
    description: 'Manage profile, team members, and permissions.',
    path: '/settings',
    items: ['Profile', 'Security', 'Team access', 'Audit log']
  },
  {
    id: 'drafts',
    title: 'Drafting preferences',
    description: 'Define when X-ProFlow drafts replies and what tone to use.',
    path: '/settings/drafts',
    items: ['Draft controls', 'Tone prompt', 'Approval rules']
  },
  {
    id: 'labels',
    title: 'Labels',
    description: 'Review the labels X-ProFlow uses to organize conversations.',
    path: '/labels',
    items: ['Smart labels', 'Manual overrides', 'Retention']
  },
  {
    id: 'rules',
    title: 'Rules',
    description: 'Configure automation triggers and approval checkpoints.',
    path: '/rules',
    items: ['Triage rules', 'Escalations', 'Auto-archive']
  },
  {
    id: 'integrations',
    title: 'Integrations',
    description: 'Connect inboxes, calendars, and CRM tools.',
    path: '/integrations',
    items: ['Email providers', 'CRM', 'Calendar sync']
  },
  {
    id: 'workflows',
    title: 'Workflows',
    description: 'Design multi-step automations with human approval points.',
    path: '/workflows',
    items: ['Inbound triage', 'Follow-up nudges', 'VIP escalation']
  }
];

export const labelDefinitions: LabelDefinition[] = [
  {
    id: 'vip',
    name: 'VIP Clients',
    description: 'High-priority accounts that need fast response times.',
    color: '#2563EB',
    appliedCount: 84,
    enabled: true,
    updatedAt: 'Updated yesterday'
  },
  {
    id: 'billing',
    name: 'Billing Questions',
    description: 'Invoices, renewal questions, and pricing updates.',
    color: '#0D9488',
    appliedCount: 132,
    enabled: true,
    updatedAt: 'Updated 3 days ago'
  },
  {
    id: 'low-priority',
    name: 'Low Priority Updates',
    description: 'Newsletters, releases, and FYI updates for later review.',
    color: '#64748B',
    appliedCount: 312,
    enabled: false,
    updatedAt: 'Updated 1 week ago'
  }
];

export const ruleDefinitions: RuleDefinition[] = [
  {
    id: 'vip-escalate',
    name: 'VIP escalation',
    description: 'Escalate and notify when VIP clients email the team.',
    enabled: true,
    trigger: 'New email labeled VIP Clients',
    conditions: ['Contains billing or contract terms', 'Received during business hours'],
    actions: ['Draft reply in tone', 'Slack notify #leadership', 'Assign to Susan'],
    lastRun: 'Ran 2 hours ago'
  },
  {
    id: 'support-triage',
    name: 'Support intake triage',
    description: 'Route support questions to the right queue and draft answers.',
    enabled: true,
    trigger: 'New email to support@xproflow.com',
    conditions: ['Detect product area', 'Check SLA tier'],
    actions: ['Apply label', 'Draft response', 'Create workflow task'],
    lastRun: 'Ran 15 minutes ago'
  },
  {
    id: 'newsletter',
    name: 'Newsletter auto-archive',
    description: 'Archive low-priority newsletters after labeling.',
    enabled: false,
    trigger: 'New email labeled Low Priority Updates',
    conditions: ['Sender matches newsletter list'],
    actions: ['Archive message', 'Log summary in digest'],
    lastRun: 'Paused'
  }
];

export const integrationDefinitions: IntegrationDefinition[] = [
  {
    id: 'gmail',
    name: 'Gmail',
    description: 'Sync your primary inbox and draft replies in Gmail.',
    status: 'connected',
    owner: 'Susan Smith',
    lastSync: 'Synced 12 minutes ago',
    dataShared: 'Labels, threads, drafts',
    primaryAction: 'Manage access'
  },
  {
    id: 'outlook',
    name: 'Outlook',
    description: 'Connect shared support inboxes and team aliases.',
    status: 'attention',
    owner: 'Operations',
    lastSync: 'Needs admin approval',
    dataShared: 'Shared mailbox, folders',
    primaryAction: 'Review permissions'
  },
  {
    id: 'slack',
    name: 'Slack',
    description: 'Send notifications when VIP or urgent emails arrive.',
    status: 'connected',
    owner: 'Support Team',
    lastSync: 'Synced 1 hour ago',
    dataShared: 'Channels, alerts',
    primaryAction: 'Edit channels'
  },
  {
    id: 'hubspot',
    name: 'HubSpot CRM',
    description: 'Pull customer context into every email summary.',
    status: 'available',
    owner: 'Sales Ops',
    lastSync: 'Not connected',
    dataShared: 'Company records',
    primaryAction: 'Connect'
  }
];

export const workflowDefinitions: WorkflowDefinition[] = [
  {
    id: 'inbound-triage',
    name: 'Inbound triage',
    description: 'Categorize incoming email and draft first responses.',
    status: 'active',
    trigger: 'New email arrives',
    steps: ['Apply smart label', 'Draft response', 'Queue for approval'],
    lastUpdated: 'Updated 2 days ago'
  },
  {
    id: 'follow-up',
    name: 'Follow-up nudges',
    description: 'Remind clients if no response is received after 3 days.',
    status: 'active',
    trigger: 'No reply after 72 hours',
    steps: ['Check CRM stage', 'Draft follow-up', 'Notify owner'],
    lastUpdated: 'Updated 5 days ago'
  },
  {
    id: 'vip-brief',
    name: 'VIP briefing',
    description: 'Summarize VIP conversations for leadership each morning.',
    status: 'draft',
    trigger: 'Daily at 8:00 AM',
    steps: ['Summarize threads', 'Highlight risks', 'Send digest'],
    lastUpdated: 'Draft saved yesterday'
  }
];
