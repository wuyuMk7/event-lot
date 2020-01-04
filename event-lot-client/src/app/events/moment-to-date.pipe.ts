import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment-timezone';

@Pipe({
  name: 'momentToDate'
})
export class MomentToDatePipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    return value.startOf('day').format('YYYY-MM-DD [GMT]Z');
  }

}
