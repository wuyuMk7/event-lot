import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MaterialModule } from '../material.module';
import { EventsRoutingModule } from './events-routing.module';

import { AddEventComponent } from './add-event/add-event.component';
import { EventFormComponent } from './event-form/event-form.component';
import { EventSchedulerComponent } from './event-scheduler/event-scheduler.component';
import {
  EventNotificationComponent,
  EventNotificationFreqDialog
} from './event-notification/event-notification.component';

import { DateSuffixPipe } from './date-suffix.pipe';
import {
  EventChecklistComponent,
  EventChecklistDialog
} from './event-checklist/event-checklist.component';
import { EventSummaryComponent } from './event-summary/event-summary.component';
import { EventDetailComponent } from './event-detail/event-detail.component';

import { TextualStatusPipe } from './textual-status.pipe';
import { MomentToDatePipe } from './moment-to-date.pipe';
import { UnixTsToDatePipe } from '../_shared/event-metadata/unix-ts-to-date.pipe';
import { DaysLeftPipe } from '../_shared/event-metadata/days-left.pipe';

import { EventMetadataComponent } from '../_shared/event-metadata/event-metadata.component';
import { EventChecklistDisplayComponent } from '../_shared/event-checklist-display/event-checklist-display.component';
import { EventsInfoComponent } from '../_shared/events-info/events-info.component';

@NgModule({
  declarations: [
    AddEventComponent,
    EventFormComponent,
    EventSchedulerComponent,
    EventNotificationComponent,
    EventNotificationFreqDialog,
    DateSuffixPipe,
    EventChecklistComponent,
    EventChecklistDialog,
    TextualStatusPipe,
    EventSummaryComponent,
    MomentToDatePipe,
    EventDetailComponent,
    EventMetadataComponent,
    UnixTsToDatePipe,
    DaysLeftPipe,
    EventChecklistDisplayComponent,
    EventsInfoComponent
  ],
  imports: [
    CommonModule,
    EventsRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ],
  entryComponents: [
    EventNotificationFreqDialog,
    EventChecklistDialog
  ]
})
export class EventsModule { }
