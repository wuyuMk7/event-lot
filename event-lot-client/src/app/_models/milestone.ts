import { Event } from './event';

export class MilestoneGoal {
  topic: string;
  tags: string[];
  description: string;
  complete: boolean;
  events: Event[];
}

export class Milestone {
  topic: string;
  tags: string[];
  description: string;

  start_time: number;
  end_time: number;
  created_at: number;
  modified_at: number;

  priority: number;
  running: boolean;
  goals: MilestoneGoal[];
}
