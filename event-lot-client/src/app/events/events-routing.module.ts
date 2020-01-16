import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddEventComponent } from './add-event/add-event.component';
import { EventDetailComponent } from './event-detail/event-detail.component';
import { EventModificationComponent } from './event-modification/event-modification.component';

const routes: Routes = [
  { path: 'add', component: AddEventComponent },
  { path: 'detail/:id', component: EventDetailComponent },
  { path: 'update/:id', component: EventModificationComponent },
  { path: 'update/:id/group/:groupid', component: EventModificationComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EventsRoutingModule { }
