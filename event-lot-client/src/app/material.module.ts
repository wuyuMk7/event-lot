import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  MatAutocompleteModule,
  MatButtonModule,
  MatBottomSheetModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDialogModule,
  MatDividerModule,
  MatDatepickerModule,
  MatExpansionModule,
  MatFormFieldModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatPaginatorModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatSelectModule,
  MatSidenavModule,
  MatStepperModule,
  MatTableModule,
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
    //BrowserAnimationsModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatBottomSheetModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDialogModule,
    MatDividerModule,
    MatDatepickerModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMomentDateModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatSelectModule,
    MatSidenavModule,
    MatStepperModule,
    MatTableModule,
    MatToolbarModule,
    MatTooltipModule
  ],
  exports: [
    FlexLayoutModule,
    //BrowserAnimationsModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatBottomSheetModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDialogModule,
    MatDividerModule,
    MatDatepickerModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMomentDateModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatSelectModule,
    MatSidenavModule,
    MatStepperModule,
    MatTableModule,
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
