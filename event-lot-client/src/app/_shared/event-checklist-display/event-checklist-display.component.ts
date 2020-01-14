import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';

import { startWith, map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

import { ChecklistItem, EventStatus } from '../../_models/event';

interface ChecklistItemID extends ChecklistItem{
  id: number;
}

@Component({
  selector: 'app-event-checklist-display',
  templateUrl: './event-checklist-display.component.html',
  styleUrls: ['./event-checklist-display.component.scss']
})
export class EventChecklistDisplayComponent implements OnInit {
  @Input() checklist: ChecklistItem[];
  @Output() transmit = new EventEmitter<any>();
  eventStatus = EventStatus;

  filteredList: Observable<ChecklistItemID[]>;
  filterValue = new FormControl('');

  displayOngoingEvents = true;
  displayCheckedEvents = true;

  constructor() {
  }

  ngOnInit() {
    this.callFilter();
  }

  transmitData(): void {
    this.transmit.emit(this.checklist);
  }

  checkItem(idx: number): void {
    this.checklist[idx].status = EventStatus.Checked;
    this.callFilter();
  }

  ongoingItem(idx: number): void {
    this.checklist[idx].status = EventStatus.Ongoing;
    this.callFilter();
  }

  modifyItem(idx: number, content: string): void {
    const newContent = prompt("Please enter checklist item content", content);
    if (newContent !== null) {
      this.checklist[idx].content = newContent;
      this.callFilter();
    }
  }

  deleteItem(idx: number): void {
    this.checklist.splice(idx, 1);
    this.callFilter();
  }

  callFilter(): void {
    this.filteredList = this.filterValue.valueChanges
      .pipe(
        startWith(''),
        map(_ => this._filterItem())
      );
  }

  private _filterItem(): ChecklistItemID[] {
    const filterValue = this.filterValue.value.toLowerCase();

    return this.checklist.map((item, index) => {
      return { id: index, ...item };
    }).filter((item) => {
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