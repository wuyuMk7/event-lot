import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap, mergeMap } from 'rxjs/operators';

import { Event, BasicEvent } from '../../_models/event';
import { EventService } from '../../_services/event.service';

@Component({
  selector: 'app-event-modification',
  templateUrl: './event-modification.component.html',
  styleUrls: ['./event-modification.component.scss']
})
export class EventModificationComponent implements OnInit {
  eventDoc$: Observable<Event>;

  constructor(
    private _eventService: EventService,
    private _route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.eventDoc$ = this._route.paramMap.pipe(
      switchMap((params: ParamMap) =>
        this._eventService.getEvent(params.get('id'), params.get('groupid')))
    );
  }

}
