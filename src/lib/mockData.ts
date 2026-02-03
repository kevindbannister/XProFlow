export const dashboardStats = [
  {
    id: 'emails',
    label: 'Emails processed',
    value: '1,284'
  },
  {
    id: 'time',
    label: 'Time saved',
    value: '14h 32m'
  },
  {
    id: 'cost',
    label: 'Cost saved',
    value: '£1,284'
  }
];

export const emailMakeup = [
  { name: 'Awaiting Response', value: 45, color: '#3B82F6' },
  { name: 'FYI', value: 33, color: '#4FD1C5' },
  { name: 'Marketing', value: 17, color: '#F4B740' }
];

export const dashboardHighlights = [
  {
    id: 'writes',
    title: 'Writes Like You',
    value: '87%',
    description: 'Emails drafted in your tone'
  },
  {
    id: 'sent',
    title: 'Sent Emails',
    value: '462',
    description: 'Total emails sent'
  }
];

export const connectedAccounts = [
  {
    id: 'acc-1',
    provider: 'Microsoft 365',
    email: 'susan.smith@xproflow.com',
    status: 'Connected',
    lastSync: '2 hours ago'
  },
  {
    id: 'acc-2',
    provider: 'Gmail',
    email: 'ssmith@gmail.com',
    status: 'Connected',
    lastSync: 'Yesterday'
  }
];

export const settingsData = {
  profile: {
    name: 'Susan Smith',
    email: 'susan.smith@xproflow.com'
  },
  preferences: {
    tone: 'Professional, warm, concise',
    signature: 'Susan Smith\nHead of Client Experience'
  },
  notifications: [
    { id: 'daily', label: 'Daily summary email', enabled: true },
    { id: 'mentions', label: 'Mentions & handoffs', enabled: true },
    { id: 'marketing', label: 'Product updates', enabled: false }
  ]
};
