import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, AbstractControl,
	 Validators, ValidationErrors, ValidatorFn } from '@angular/forms';

@Component({
  selector: 'app-event-scheduler',
  templateUrl: './event-scheduler.component.html',
  styleUrls: ['./event-scheduler.component.scss']
})
export class EventSchedulerComponent implements OnInit {
  eventScheduleGroup: FormGroup;

  constructor(private _formBuilder: FormBuilder) { 
    this.eventScheduleGroup = this._formBuilder.group({
      type: ['range', Validators.required],
      startdate: [new Date(Date.now()), Validators.required],
      enddate: [new Date(Date.now()), Validators.required]
    });
  }

  ngOnInit() {
  }

}
