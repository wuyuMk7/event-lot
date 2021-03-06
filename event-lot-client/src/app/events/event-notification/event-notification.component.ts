import { Component, OnInit, ViewChild, Input,
  EventEmitter, Inject, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, AbstractControl,
	 Validators, ValidationErrors, ValidatorFn } from '@angular/forms';
import { map, startWith } from 'rxjs/operators';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';

import { DateSuffixPipe } from '../date-suffix.pipe';

const allDaysOfWeek: string[] = [
  'Monday', 'Tuesday', 'Wednesday', 'Thursday',
  'Friday', 'Saturday', 'Sunday'
];
const allDaysOfMonth: string[] = Array.from({length: 31}, (v, i)=> String(i+1));
const allMonthsOfYear: string[] = [
  'Jan.', 'Feb.', 'Mar.', 'Apr.', 'May', 'Jun.',
  'Jul.', 'Aug.', 'Sep.', 'Oct.', 'Nov.', 'Dec.'
];
const allDaysOfEachMonth: string[] = [
  '31', '29', '31', '30', '31', '30',
  '31', '31', '30', '31', '30', '31'
];

@Component({
  selector: 'app-event-notification',
  templateUrl: './event-notification.component.html',
  styleUrls: ['./event-notification.component.scss']
})

export class EventNotificationComponent implements OnInit {
  @Input() preNotification: any;
  @Output() transmit = new EventEmitter<any>();
  eventNotificationGroup: FormGroup;

  selectedDaysForFreq = { week: [], month: [], year: [] };

  constructor(
    private _formBuilder: FormBuilder,
    private _freqDialog: MatDialog
  ) {
    this.eventNotificationGroup = this._formBuilder.group({
      switch: ['on', Validators.required],
      frequency: ['day', [Validators.required, this._anotherRequiredValidator()]]
    });
  }

  ngOnInit() {
    if (this.preNotification) {
      this.eventNotificationGroup.controls['switch'].setValue(this.preNotification.switch);
      this.eventNotificationGroup.controls['frequency'].setValue(this.preNotification.type);

      if (this.preNotification.type === 'week')
        this.selectedDaysForFreq.week = this.preNotification.freq;
      else if (this.preNotification.type === 'month')
        this.selectedDaysForFreq.month = this.preNotification.freq;
      else if (this.preNotification.type === 'year')
        this.selectedDaysForFreq.year = this.preNotification.freq;
    }
  }

  checkValid(id: string): boolean {
    let ret = false;
    if (this.eventNotificationGroup.value.switch == 'off') {
      this.transmit.emit({ child: id, data: { switch: 'off' } });
      ret = true;
    } else if (this.eventNotificationGroup.valid) {
      let data = {
        switch: 'on',
        type: this.eventNotificationGroup.value.frequency
      };

      if (data.type !== 'day' && this.selectedDaysForFreq[data.type])
        data['freq'] = this.selectedDaysForFreq[data.type];

      this.transmit.emit({ child: id, data: data });
      ret = true;
    }

    return ret;
  }

  openDialog(event: any): void {
    this._openDialog(event.value);
  }

  private _openDialog(type: string): void {
    if (type != 'week' && type != 'month' && type != 'year') return;

    const value = this.selectedDaysForFreq[type];
    const dialogRef = this._freqDialog.open(
      EventNotificationFreqDialog, { minWidth: '50%', data: { type: type, value: value } }
    );
    dialogRef.afterClosed().subscribe(result => {
      if (result === undefined)
        result = [];
      this.selectedDaysForFreq[type] = result;
      this.eventNotificationGroup.get('frequency').updateValueAndValidity();
    })
  }

  private _anotherRequiredValidator(): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} | null => {
      let ret = null;
      if (control.value === 'week' && this.selectedDaysForFreq.week.length == 0)
        ret = { daysOfWeekError: true };
      else if (control.value === 'month' && this.selectedDaysForFreq.month.length == 0)
        ret = { daysOfMonthError: true };
      else if (control.value === 'year' && this.selectedDaysForFreq.year.length == 0)
        ret = { daysOfYearError: true };

        return ret;
    }
  }
}


@Component({
  selector: 'app-event-notification-freq-dialog',
  templateUrl: './event-notification-freq-dialog.html',
  styles: [`
      mat-form-field.freq-year {
        margin-right: 1em;
      }
  `]
})
export class EventNotificationFreqDialog implements OnInit{
  cacheData: any;
  retnData: any;

  daysOfWeek = allDaysOfWeek;
  daysOfMonth = allDaysOfMonth;

  monthsOfYear = allMonthsOfYear;
  daysOfEachMonth = allDaysOfEachMonth;
  daysOfCurMonth: {
    s1: string[], s2: string[], s3: string[], s4: string[], s5: string[]
  } = { s1: [], s2: [], s3: [], s4: [], s5: [] };
  selectedDaysOfYear: object = {
    s1: { m: '', d: '' },
    s2: { m: '', d: '' },
    s3: { m: '', d: '' },
    s4: { m: '', d: '' },
    s5: { m: '', d: '' }
  };

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _dialogRef: MatDialogRef<EventNotificationFreqDialog>
  ) {
    //this._dialogRef.backdropClick().subscribe(() => {
    //  this._dialogRef.close(this.retnData);
    //});
    this._dialogRef.disableClose = true;
  }

  ngOnInit() {
    this.cacheData = this.data.value;
    this.retnData = this.data.value;

    if (this.data.type === 'year') {
      const curLength = this.data.value.length > 5 ? 5 : this.data.value.length;
      for (let i=0;i < curLength; ++i) {
        const key = `s${i+1}`;
        const value = this.data.value[i].split(' ');
        if (value.length === 2) {
          const days = this._getDaysOfOneMonth(value[0]);
          if (days.length > 0) {
            this.daysOfCurMonth[key] = days;
            this.selectedDaysOfYear[key].m = value[0];
            this.selectedDaysOfYear[key].d = value[1];
          }
        }
      }
    }
  }

  changeMonth(event: any, key: string): void {
    const days = this._getDaysOfOneMonth(event.value);
    if (days.length > 0)
      this.daysOfCurMonth[key] = days;
  }

  submit(): void {
    if (this.data.type == 'year') {
      let dataArray = [];
      for (const item of Object.values(this.selectedDaysOfYear))
        if (item.m && item.d && item.m.length > 0 && item.d.length > 0)
          dataArray.push(`${item.m} ${item.d}`)
      this.retnData = dataArray;
    }
    this._dialogRef.close(this.retnData);
  }

  cancel(): void {
    this._dialogRef.close(this.cacheData);
  }

  private _getDaysOfOneMonth(month: string): string[] {
    const index = this.monthsOfYear.indexOf(month);
    if (index != -1)
      return this.daysOfMonth.slice(0, parseInt(this.daysOfEachMonth[index]));
    else
      return [];
  }
}
