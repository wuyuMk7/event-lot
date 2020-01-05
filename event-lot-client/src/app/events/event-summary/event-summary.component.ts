import { Component, OnInit, Input } from '@angular/core';

import { Event } from '../../_models/event';

@Component({
  selector: 'app-event-summary',
  templateUrl: './event-summary.component.html',
  styleUrls: ['./event-summary.component.scss']
})
export class EventSummaryComponent implements OnInit {
  @Input() eventFormData: any;

  constructor() { }

  ngOnInit() {
  }
}
