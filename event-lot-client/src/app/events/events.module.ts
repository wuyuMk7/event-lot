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
import { TextualStatusPipe } from './textual-status.pipe';

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
    TextualStatusPipe
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
