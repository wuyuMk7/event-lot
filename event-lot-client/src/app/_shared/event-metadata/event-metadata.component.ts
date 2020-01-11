import { Component, OnInit, Input } from '@angular/core';

import { Event, Lifecycle, EventStatus } from '../../_models/event';

@Component({
  selector: 'app-event-metadata',
  templateUrl: './event-metadata.component.html',
  styleUrls: ['./event-metadata.component.scss']
})
export class EventMetadataComponent implements OnInit {
  @Input() event: Event;

  lifecycles = Lifecycle;
  eventStatus = EventStatus;

  constructor() { }

  ngOnInit() {
    console.log(this.event);
  }

  noLaterThanNow(time: number): boolean {
    return Date.now() >= time;
  }
}
