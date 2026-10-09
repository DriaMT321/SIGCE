export interface AlertEntity {
  id: string;
  userId: string;
  title: string;
  message: string;
  severity: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED';
  isRead: boolean;
  link: string | null;
  metadata: unknown;
  createdAt: Date;
}
