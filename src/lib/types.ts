export interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  notes?: string;
  notificationEnabled: boolean;
  category?: string;
  color?: string;
}
