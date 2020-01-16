import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { switchMap, mergeMap } from 'rxjs/operators';

import { Event, BasicEvent, formDataToEvent } from '../../_models/event';
import { EventService } from '../../_services/event.service';

@Component({
  selector: 'app-event-modification',
  templateUrl: './event-modification.component.html',
  styleUrls: ['./event-modification.component.scss']
})
export class EventModificationComponent implements OnInit {
  eventDoc$: Observable<Event>;

  eventId: string;
  groupId: string;
  eventFormData: any;
  isDone: any;

  constructor(
    private _eventService: EventService,
    private _route: ActivatedRoute,
    private _infoSnackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.eventDoc$ = this._route.paramMap.pipe(
      switchMap((params: ParamMap) => {
        this.eventId = params.get('id');
        this.groupId = params.get('gropuid');
        return this._eventService.getEvent(params.get('id'), params.get('groupid'));
      })
    );
  }

  receiveChildData(event: any): void {
    this.eventFormData = event;
    this.isDone = true;
    //console.log(this.eventFormData);
  }

  updateEvent(event: any): void {
    if (this.eventId)
      this._eventService.updateEvent(
        formDataToEvent(this.eventFormData), this.eventId, this.groupId
      ).subscribe((promise: Promise<any>) => promise.then(
        res => this._infoSnackBar.open(
          `Event ${this.eventFormData.metadata.topic} updated`,
          'OK',
          { duration: 2000 }
        ),
        err => console.log(err)
      ));
  }
}
