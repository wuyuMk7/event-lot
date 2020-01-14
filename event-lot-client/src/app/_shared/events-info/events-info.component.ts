import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
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
    private _checklistDialog: MatDialog
  ) { }

  ngOnInit() {
    this.events$ = this._eventService.getAllEvents(
      moment.unix(Date.now() / 1000).startOf('day').valueOf()
    );
  }

  openChecklist(list: ChecklistItem[]): void {
    const dialogRef = this._checklistDialog.open(
      AppEventsInfoChecklistDialog, { minWidth: '50%', data: { list: list } }
    );
    dialogRef.afterClosed().subscribe(res => {
    })
  }
}

@Component({
  selector: 'app-events-info-checklist-dialog',
  templateUrl: 'app-events-info-checklist-dialog.html'
})
export class AppEventsInfoChecklistDialog {
  checklist: ChecklistItem[];

  constructor(
    private _dialogRef: MatDialogRef<AppEventsInfoChecklistDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any
	) {
    this.checklist = this.data.list;
  }

  cancelClick(): void {
    this._dialogRef.close();
  }

  okClick(): void {
    this._dialogRef.close(this.checklist);
  }
}
