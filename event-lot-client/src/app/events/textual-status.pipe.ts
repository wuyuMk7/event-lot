import { Pipe, PipeTransform } from '@angular/core';

import { EventStatus } from '../_models/event';

@Pipe({
  name: 'textualStatus'
})
export class TextualStatusPipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    let text: string = '';
    switch(value) {
    case EventStatus.Pending:
      text = 'pending';
      break;
    case EventStatus.Ongoing:
      text = 'ongoing';
      break;
    case EventStatus.Checked:
      text = 'checked';
      break;
    default:
      break;
    }

    return text;
  }

}
