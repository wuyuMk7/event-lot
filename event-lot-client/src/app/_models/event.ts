import * as moment from 'moment-timezone';

export enum EventStatus { Pending, Ongoing, Checked };
export enum RepeatMode { Year, Month, Week, Day };
export enum Lifecycle { Range, Lifelong }

export class ChecklistItem {
  content: string;
  status: EventStatus;
}

export interface BasicEvent {
  topic: string;
  tags?: string[];
  content: string;
  timezone: string;
  time_offset: number;
  status: EventStatus;

  lifecycle: Lifecycle;
  start_time?: number;
  end_time?: number;
  last_triggered_at: number;
  check_at: number;
  created_at: number;
  modified_at: number;

  has_notification: boolean;
  repeat_mode: RepeatMode;
  repeat_frequency?: [number, number][];

  author: string;
  priority: number;
  milestones?: string[];
  checklist?: ChecklistItem[];
}

export interface Event extends BasicEvent{
  id: string;
}

export function formDataToEvent(form: any): BasicEvent {
  const curTimestamp = (new Date()).getTime();
  let event: BasicEvent = {
    topic: form.metadata.topic,
    tags: form.metadata.tags,
    content: form.metadata.content,
    status: EventStatus.Pending,

    timezone: '',
    time_offset: 0,
    lifecycle: Lifecycle.Lifelong,
    last_triggered_at: -1,
    check_at: -1,
    created_at: curTimestamp,
    modified_at: curTimestamp,

    has_notification: (form.notification.switch === 'on' ? true : false),
    repeat_mode: RepeatMode.Day,
    repeat_frequency: [],

    author: '',
    priority: 0
  };


  const timezone = form.metadata.timezone.split(',')[0];
  event.timezone = timezone;
  event.time_offset = moment.tz(timezone).utcOffset();

  event.lifecycle =
    (form.schedule.type === 'range' ? Lifecycle.Range : Lifecycle.Lifelong);
  if (event.lifecycle === Lifecycle.Range) {
    event.start_time = moment(form.startdate).startOf('day').valueOf();
    event.end_time = moment(form.enddate).startOf('day').valueOf();
  } else {
    event.start_time = -1;
    event.end_time = -1;
  }

  if (event.has_notification) {
    switch (form.notification.type) {
    case 'week':
      event.repeat_mode = RepeatMode.Week;
      for (let day of form.notification.freq)
        event.repeat_frequency.push([ moment().day(day).weekday(), -1 ]);
      break;
    case 'month':
      event.repeat_mode = RepeatMode.Month;
      event.repeat_frequency = form.notification.freq.map(
        day => { return [ moment().date(parseInt(day)).date(), -1 ]}
      );
      break;
    case 'year':
      event.repeat_mode = RepeatMode.Year;
      event.repeat_frequency = form.notification.freq.map((day) => {
        const res = day.split(' ');
        return [ moment().month(res[0]).month(),
          moment().date(parseInt(res[1])).date() ];
      });
      break;
    default:
      break;
    }
  }

  event.milestones = [];
  event.checklist = form.checklist.checklist;

  return event;
}

export function eventToFormData(): any {

}
