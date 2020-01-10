import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment-timezone';

@Pipe({
  name: 'daysLeft'
})
export class DaysLeftPipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    let ret = '';
    const cur = moment();
    const timestamp = (value/1000);
    const diff_days = cur.diff(moment.unix(timestamp).endOf('day'), 'days');

    if (args[0] === 'start') {
      if (diff_days < 0)
        ret = `Event will start in ${-diff_days} ` + (diff_days == -1 ? 'day.': 'days.');
    } else {
      if (diff_days > 0) {
        ret = 'Event has expired.';
      } else if (diff_days < 0) {
        ret = `Event will expire in ${-diff_days} ` + (diff_days == -1 ? 'day.': 'days.');
      } else {
        const diff_hours = moment.unix(timestamp).endOf('day').diff(cur, 'hours');
        if (diff_hours === 0) {
          const diff_mins = moment.unix(timestamp).endOf('day').diff(cur, 'minutes');
          if (diff_mins >= 0)
            ret = `Event will expire in ${diff_mins} minutes.`;
        } else {
          ret = `Event will expire in ${diff_hours} hours.`;
        }
      }
    }
    return ret;
  }

}
