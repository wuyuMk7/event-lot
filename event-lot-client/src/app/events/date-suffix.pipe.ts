import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'dateSuffix'
})
export class DateSuffixPipe implements PipeTransform {
  transform(value: any, ...args: any[]): any {
    return moment().set('date', value).format('Do');
  }

}
