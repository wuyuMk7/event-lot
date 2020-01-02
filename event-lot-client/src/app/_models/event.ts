export enum EventStatus { Pending, Ongoing, Checked };
export enum RepeatMode { Year, Month, Week, Day };

export class ChecklistItem {
  content: string;
  status: EventStatus;
}

export class Event {
  id: string;
  topic: string;
  tags: string[];
  content: string[];
  status: EventStatus;

  start_time: number;
  end_time: number;
  last_triggered_at: number;
  created_at: number;
  modified_at: number;

  has_notificiation: boolean;
  notification: string; // -number, 0, +number

  author: string;
  priority: number;
  milestones: string[];
  checklist: ChecklistItem[];

  repeat: boolean;
  repeat_mode: RepeatMode;
  period: [number, number];
}
