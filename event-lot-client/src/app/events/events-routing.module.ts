import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddEventComponent } from './add-event/add-event.component';

const routes: Routes = [
  { path: 'add', component: AddEventComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EventsRoutingModule { }
