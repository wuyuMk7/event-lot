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
  repeat_frequency?: any[];

  author: string;
  priority: number;
  milestones?: string[];
  checklist?: ChecklistItem[];
}

export interface Event extends BasicEvent{
  id: string;
  groupid: string;
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
    event.start_time = moment(form.schedule.startdate).startOf('day').valueOf();
    event.end_time = moment(form.schedule.enddate).startOf('day').valueOf();
  } else {
    event.start_time = -1;
    event.end_time = -1;
  }

  if (event.has_notification) {
    switch (form.notification.type) {
    case 'week':
      event.repeat_mode = RepeatMode.Week;
      for (let day of form.notification.freq)
        event.repeat_frequency.push({ 0: moment().day(day).weekday(), 1: -1 });
      break;
    case 'month':
      event.repeat_mode = RepeatMode.Month;
      event.repeat_frequency = form.notification.freq.map(
        day => { return { 0: moment().date(parseInt(day)).date(), 1: -1 }}
      );
      break;
    case 'year':
      event.repeat_mode = RepeatMode.Year;
      event.repeat_frequency = form.notification.freq.map((day) => {
        const res = day.split(' ');
        return {
          0: moment().month(res[0]).month(),
          1: moment().date(parseInt(res[1])).date()
        };
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

export function eventToFormData(event: Event): any {
  let form: any = {
    metadata: {
      group: event.groupid,
      topic: event.topic,
      content: event.content,
      tags: event.tags,
      timezone: `${event.timezone}, ` + moment.tz(event.timezone).format('[GMT]Z, z')
    },
    checklist: {
      checklist: event.checklist
    },
    schedule: {
      type: event.lifecycle === Lifecycle.Range ? 'range' : 'forever',
      startdate: -1,
      enddate: -1
    },
    notification: {
      switch: event.has_notification ? 'on' : 'off',
      type: ''
    }
  };

  if (event.lifecycle === Lifecycle.Range) {
    form.schedule.startdate = moment.unix(event.start_time/1000).startOf('day');
    form.schedule.enddate = moment.unix(event.end_time/1000).startOf('day');
  }

  if (event.has_notification) {
    switch (event.repeat_mode) {
    case RepeatMode.Week:
      form.notification.type = 'week';
      form.notification.freq = event.repeat_frequency.map(
        day => moment().weekday(day[0]).format('dddd')
      );
      break;
    case RepeatMode.Month:
      form.notification.type = 'month';
      form.notification.freq = event.repeat_frequency.map(
        day => moment().date(day[0]).format('Do')
      );
      break;
    case RepeatMode.Year:
      form.notification.type = 'year';
      form.notification.freq = event.repeat_frequency.map(
        day => {
          let month = moment().month(day[0]).format('MMM');
          let date = moment().date(day[1]).format('Do');
          if (month !== 'May')
            month = `${month}.`;

          return `${month} ${date}`;
        }
      );
      break;
    default:
      form.notification.type = 'day';
      break;
    }
  }

  return form;

}
