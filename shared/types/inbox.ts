export type InboxFolder = 'INBOX' | 'PROMOTIONS' | 'DRAFT' | 'SPAM' | 'TRASH' | 'ALL';

export type InboxStatus =
  | 'NONE'
  | 'READ'
  | 'REPLIED'
  | 'DRAFT'
  | 'COMPLETE'
  | 'ACTIVE'
  | 'ORGANIZED';

export interface InboxMessage {
  id?: string;
  user_id: string;
  provider: 'gmail';
  external_id: string;
  thread_id?: string | null;
  folder: InboxFolder;
  from_name?: string | null;
  from_email?: string | null;
  subject?: string | null;
  snippet?: string | null;
  internal_date?: number | null;
  received_at?: string | null;
  is_unread?: boolean;
  status?: InboxStatus;
}

export type GroupedInboxResponse = {
  today: InboxMessage[];
  thisMonth: InboxMessage[];
  older: InboxMessage[];
};
