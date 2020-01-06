import * as moment from 'moment-timezone';

export enum EventStatus { Pending, Ongoing, Checked };
export enum RepeatMode { Year, Month, Week, Day };
export enum Lifecycle { Range, Lifelong }

export class ChecklistItem {
  content: string;
  status: EventStatus;
}

export class Event {
  id: string;
  topic: string;
  tags: string[];
  content: string;
  time_offset: number;
  status: EventStatus;

  lifecycle: Lifecycle;
  start_time: number;
  end_time: number;
  last_triggered_at: number;
  created_at: number;
  modified_at: number;

  has_notification: boolean;
  repeat_mode: RepeatMode;
  repeat_frequency: [number, number][];

  author: string;
  priority: number;
  milestones: string[];
  checklist: ChecklistItem[];

  formDataToEvent(form: any) {
    this.id = '';
    this.topic = form.metadata.topic;
    this.tags = form.metadata.tags;
    this.content = form.metadata.content;
    this.status = EventStatus.Pending;

    const timezone = form.metadata.timezone.split(',')[0];
    this.time_offset = moment.tz(timezone).utcOffset();

    this.lifecycle =
      (form.schedule.type === 'range' ? Lifecycle.Range : Lifecycle.Lifelong);
    if (this.lifecycle === Lifecycle.Range) {
      this.start_time = moment(form.startdate).startOf('day').valueOf();
      this.end_time = moment(form.enddate).startOf('day').valueOf();
    } else {
      this.start_time = -1;
      this.end_time = -1;
    }
    this.last_triggered_at = -1;
    this.created_at = (new Date()).getTime();
    this.modified_at = this.created_at;

    this.has_notification = (form.notification.switch === 'on' ? true : false);
    this.repeat_mode = RepeatMode.Day;
    this.repeat_frequency = [];
    if (this.has_notification) {
      switch (form.notification.type) {
      case 'week':
        this.repeat_mode = RepeatMode.Week;
        for (let day of form.notification.freq)
          this.repeat_frequency.push([ moment().day(day).weekday(), -1 ]);
        break;
      case 'month':
        this.repeat_mode = RepeatMode.Month;
        this.repeat_frequency = form.notification.freq.map(
          day => { return [ moment().date(parseInt(day)).date(), -1 ]}
        );
        break;
      case 'year':
        this.repeat_mode = RepeatMode.Year;
        this.repeat_frequency = form.notification.freq.map((day) => {
          const res = day.split(' ');
          return [ moment().month(res[0]).month(),
            moment().date(parseInt(res[1])).date() ];
        });
        break;
      default:
        break;
      }
    }

    this.author = '';
    this.priority = 0;
    this.milestones = [];
    this.checklist = form.checklist.checklist;
  }

  eventToFormData(): any {

  }
}
