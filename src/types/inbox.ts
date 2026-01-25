export type InboxThreadStatus = 'Needs reply' | 'Waiting on client' | 'Escalated';

export interface InboxThread {
  id: string;
  subject: string;
  preview: string;
  client: string;
  status: InboxThreadStatus;
  updatedAt: string;
}
