import { Component, OnInit, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

import { startWith, map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

import { ChecklistItem, EventStatus } from '../../_models/event';

@Component({
  selector: 'app-event-checklist-display',
  templateUrl: './event-checklist-display.component.html',
  styleUrls: ['./event-checklist-display.component.scss']
})
export class EventChecklistDisplayComponent implements OnInit {
  @Input() checklist: ChecklistItem[];

  filteredList: Observable<ChecklistItem[]>;
  filterValue = new FormControl('');

  displayOngoingEvents = true;
  displayCheckedEvents = true;

  constructor() {
  }

  ngOnInit() {
    this.filterStatus();
  }

  filterStatus(): void {
    this.filteredList = this.filterValue.valueChanges
      .pipe(
        startWith(''),
        map(_ => this._filterItem())
      );
  }

  private _filterItem(): ChecklistItem[] {
    const filterValue = this.filterValue.value.toLowerCase();

    return this.checklist.filter((item) => {
      let ret = item ? item.content.toLowerCase().indexOf(filterValue) >= 0 : true;

      if (ret)
        if (this.displayOngoingEvents && this.displayCheckedEvents)
          ret = ret && (item.status === EventStatus.Ongoing || item.status === EventStatus.Checked);
        else if (this.displayOngoingEvents)
          ret = ret && (item.status === EventStatus.Ongoing);
        else if (this.displayCheckedEvents)
          ret = ret && (item.status === EventStatus.Checked);
        else
          ret = false;

      return ret;
    });
  }
}
