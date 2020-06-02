import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddMilestoneComponent } from './add-milestone/add-milestone.component';

const routes: Routes = [
  { path: 'add', component: AddMilestoneComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MilestoneRoutingModule { }
