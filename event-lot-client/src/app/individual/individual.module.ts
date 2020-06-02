import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthService } from '../_services/auth.service';

import { IndividualRoutingModule } from './individual-routing.module';
import { HomeComponent } from './home/home.component';


@NgModule({
  declarations: [HomeComponent],
  imports: [
    CommonModule,
    IndividualRoutingModule
  ],
  providers: [
    AuthService
  ]
})
export class IndividualModule { }
