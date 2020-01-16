import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, AbstractControl,
	       Validators, ValidationErrors, ValidatorFn } from '@angular/forms';
import * as moment from 'moment';

@Component({
  selector: 'app-event-scheduler',
  templateUrl: './event-scheduler.component.html',
  styleUrls: ['./event-scheduler.component.scss']
})
export class EventSchedulerComponent implements OnInit {
  @Input() preSchedule: any;
  @Output() transmit = new EventEmitter<any>();

  eventScheduleGroup: FormGroup;

  constructor(private _formBuilder: FormBuilder) {
    this.eventScheduleGroup = this._formBuilder.group({
      type: ['range', Validators.required],
      startdate: [moment(), Validators.required],
      enddate: [moment(), Validators.required]
    }, { validator: this._dateRangeValidator() });
  }

  ngOnInit() {
    if (this.preSchedule) {
      for (let key in this.preSchedule)
        this.eventScheduleGroup.controls[key].setValue(this.preSchedule[key]);
    }
  }

  checkValid(id: string): boolean {
    if (this.eventScheduleGroup.valid) {
      let data = { type: this.eventScheduleGroup.value.type };
      if (data.type == 'range') {
        data['startdate'] = this.eventScheduleGroup.value.startdate;
        data['enddate'] = this.eventScheduleGroup.value.enddate;
      }
      this.transmit.emit({ child: id, data: data });
      return true;
    } else {
      return false;
    }
  }

  toggleValidator(event: any) {
    if (event.value === 'forever' ) {
      this.eventScheduleGroup.get('startdate').clearValidators();
      this.eventScheduleGroup.get('enddate').clearValidators();
    } else {
      this.eventScheduleGroup.get('startdate').setValidators([Validators.required]);
      this.eventScheduleGroup.get('enddate').setValidators([Validators.required]);
    }
    this.eventScheduleGroup.get('startdate').updateValueAndValidity();
    this.eventScheduleGroup.get('enddate').updateValueAndValidity();
  }

  private _dateRangeValidator(): ValidatorFn {
    return (group: FormGroup): ValidationErrors | null => {
      let ret: any = null;
      if (group.value.type != 'forever') {
        const start = group.value.startdate;
        const end = group.value.enddate;

        if (start && end && start > end)
          ret = { dataRangeError: true };
      }

      return ret;
    }
  }
}
