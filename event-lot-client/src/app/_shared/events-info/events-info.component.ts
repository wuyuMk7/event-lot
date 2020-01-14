import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import * as moment from 'moment-timezone';

import { EventService } from '../../_services/event.service';
import { Event, BasicEvent, EventStatus } from '../../_models/event';

@Component({
  selector: 'app-events-info',
  templateUrl: './events-info.component.html',
  styleUrls: ['./events-info.component.scss']
})
export class EventsInfoComponent implements OnInit {
  events$: Observable<Event[]>;
  eventStatus = EventStatus;

  constructor(
    private _eventService: EventService
  ) { }

  ngOnInit() {
    this.events$ = this._eventService.getAllEvents(
      moment.unix(Date.now() / 1000).startOf('day').valueOf()
    );
  }

}
