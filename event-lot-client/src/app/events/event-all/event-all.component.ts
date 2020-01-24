import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';

import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import * as moment from 'moment-timezone';

import { EventService } from '../../_services/event.service';
import { Event, BasicEvent, EventStatus, ChecklistItem } from '../../_models/event';

@Component({
  selector: 'app-event-all',
  templateUrl: './event-all.component.html',
  styleUrls: ['./event-all.component.scss']
})
export class EventAllComponent implements OnInit {
  events$: Observable<Event[]>;

  constructor(
    private _eventService: EventService,
    private _route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.events$ = this._route.queryParamMap.pipe(
      switchMap((params: ParamMap) => {
        const date = params.get('date');
        const timezone = params.get('timezone');
        //let ts = moment.unix(Date.now() / 1000).startOf('day').valueOf();
        let ts = moment.unix(Date.now() / 1000).valueOf();

        if (date && moment(date).isValid) {
          ts = moment(date).startOf('day').valueOf();
          if (timezone) {
            ts = moment(date).utcOffset(parseInt(timezone)).startOf('day').valueOf();
          }
        }
        return this._eventService.getAllEvents(ts);
      })
    );
  }

}
