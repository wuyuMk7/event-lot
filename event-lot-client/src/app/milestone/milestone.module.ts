import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MilestoneRoutingModule } from './milestone-routing.module';
import { AddMilestoneComponent } from './add-milestone/add-milestone.component';


@NgModule({
  declarations: [AddMilestoneComponent],
  imports: [
    CommonModule,
    MilestoneRoutingModule
  ]
})
export class MilestoneModule { }
