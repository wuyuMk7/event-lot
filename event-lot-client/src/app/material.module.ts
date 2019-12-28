import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  MatAutocompleteModule,
  MatButtonModule,
  MatChipsModule,
  MatDividerModule,
  MatDatepickerModule,
  MatFormFieldModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatSidenavModule,
  MatStepperModule,
  MatToolbarModule,
  MatTooltipModule
} from '@angular/material';

import {
  MatMomentDateModule,
  MomentDateAdapter,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS
} from '@angular/material-moment-adapter';

@NgModule({
  imports: [
    FlexLayoutModule,
    BrowserAnimationsModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatChipsModule,
    MatDividerModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatMomentDateModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatSidenavModule,
    MatStepperModule,
    MatToolbarModule,
    MatTooltipModule
  ],
  exports: [
    FlexLayoutModule,
    BrowserAnimationsModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatChipsModule,
    MatDividerModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatMomentDateModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatSidenavModule,
    MatStepperModule,
    MatToolbarModule,
    MatTooltipModule
  ],
  providers: [
    { 
      provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, 
      useValue: { strict: true }
    }
  ]
})

export class MaterialModule {}
