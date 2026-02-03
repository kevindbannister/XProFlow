import type { InboxThread } from '../types/inbox';

export const mockThreads: InboxThread[] = [
  {
    id: 'thread-001',
    subject: 'Q2 payroll clarification',
    preview: 'Need confirmation on overtime reimbursements before Friday...',
    client: 'Arrow Accounting LLC',
    status: 'Needs reply',
    updatedAt: '10:42 AM'
  },
  {
    id: 'thread-002',
    subject: '1099 vendor follow-up',
    preview: 'Attached updated W-9 for review. Please confirm...',
    client: 'Harbor Freight Logistics',
    status: 'Waiting on client',
    updatedAt: '9:12 AM'
  },
  {
    id: 'thread-003',
    subject: 'Invoice discrepancy for April',
    preview: 'We noticed the invoice total is higher than expected...',
    client: 'Mason Group',
    status: 'Escalated',
    updatedAt: 'Yesterday'
  },
  {
    id: 'thread-004',
    subject: 'Year-end close checklist',
    preview: 'Can you provide the outstanding checklist items...',
    client: 'Brightline Partners',
    status: 'Needs reply',
    updatedAt: 'Yesterday'
  }
];
