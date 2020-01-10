import { Pipe, PipeTransform } from '@angular/core';

import * as moment from 'moment-timezone';

@Pipe({
  name: 'unixTsToDate'
})
export class UnixTsToDatePipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    const timestamp = (value / 1000);
    const timezone = args[0];

    if (moment.tz.names().includes(timezone))
      return moment.unix(timestamp).tz(timezone).format('YYYY-MM-DD [GMT]Z');
    else
      return '';
  }

}
