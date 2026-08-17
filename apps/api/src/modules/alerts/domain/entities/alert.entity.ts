export interface AlertEntity {
  id: string;
  userId: string;
  title: string;
  message: string;
  severity: string;
  isRead: boolean;
  link: string | null;
  metadata: unknown;
  createdAt: Date;
}
