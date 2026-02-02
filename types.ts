
export interface Term {
  id: string;
  term: string;
  definition: string;
  category: TermCategory;
  example?: string;
  tags?: string[];
  status?: 'pending' | 'approved' | 'rejected';
  created_at?: string;
}

export enum TermCategory {
  ALL = 'All',
  ACRONYM = 'Acronym',
  STATUS = 'Status/Tiers',
  QUEUE = 'Queues',
  GENERAL = 'General',
  SLANG = 'Slang'
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  isError?: boolean;
}
