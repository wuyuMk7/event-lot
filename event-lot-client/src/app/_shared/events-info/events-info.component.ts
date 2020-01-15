import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import * as moment from 'moment-timezone';

import { EventService } from '../../_services/event.service';
import { Event, BasicEvent, EventStatus, ChecklistItem } from '../../_models/event';

@Component({
  selector: 'app-events-info',
  templateUrl: './events-info.component.html',
  styleUrls: ['./events-info.component.scss']
})
export class EventsInfoComponent implements OnInit {
  events$: Observable<Event[]>;
  eventStatus = EventStatus;

  constructor(
    private _eventService: EventService,
    private _checklistDialog: MatDialog,
    private _infoSnackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.events$ = this._eventService.getAllEvents(
      moment.unix(Date.now() / 1000).startOf('day').valueOf()
    );
  }

  openChecklist(event: Event): void {
    const dialogRef = this._checklistDialog.open(
      AppEventsInfoChecklistDialog,
      { minWidth: '50%', data: { list: event.checklist, topic: event.topic } }
    );
    dialogRef.afterClosed().subscribe(dialogData => {
      if (dialogData) {
        this._eventService.updateEvent({ checklist: dialogData }, event.id, '')
          .subscribe((promise:Promise<any>) => promise
            .then(
              res => this._infoSnackBar.open(
                `Event ${event.topic} checklist updated`, 'OK', { duration: 2000 }),
              err => console.log(err)
            )
          );
      }
    })
  }

  checkEvent(event: Event): void {
    this._eventService.updateEvent({ status: EventStatus.Checked }, event.id, '')
      .subscribe((promise: Promise<any>) => promise
        .then(
          res => this._infoSnackBar.open(
            `Event ${event.topic} has been checked`, 'OK', {duration: 2000}),
          err => console.log(err)
        )
      );
  }

  resetEvent(event: Event): void {
    this._eventService.updateEvent({ status: EventStatus.Ongoing }, event.id, '')
      .subscribe((promise: Promise<any>) => promise
        .then(
          res => this._infoSnackBar.open(
            `Event ${event.topic} has been reset to ongoing`, 'OK', {duration: 2000}),
          err => console.log(err)
        )
      );
  }
}

@Component({
  selector: 'app-events-info-checklist-dialog',
  templateUrl: 'app-events-info-checklist-dialog.html'
})
export class AppEventsInfoChecklistDialog {
  checklist: ChecklistItem[];
  clean: boolean = true;

  constructor(
    private _dialogRef: MatDialogRef<AppEventsInfoChecklistDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.checklist = this.data.list.map(item => ({...item}));
  }

  cancelClick(): void {
    this._dialogRef.close();
  }

  okClick(): void {
    this.clean ? this._dialogRef.close() : this._dialogRef.close(this.checklist);
  }

  updateClean(clean: boolean): void {
    this.clean = clean;
  }
}
