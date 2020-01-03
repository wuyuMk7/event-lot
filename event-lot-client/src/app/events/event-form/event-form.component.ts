import { Component, OnInit, OnChanges, Output, EventEmitter,
  ViewChild, Input, QueryList } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, AbstractControl,
  Validators, ValidationErrors, ValidatorFn } from '@angular/forms';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { map, startWith } from 'rxjs/operators';

import { MatAccordion, MatExpansionPanel } from '@angular/material/expansion';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatDatepicker } from '@angular/material/datepicker';

import * as moment from 'moment-timezone';

import {
  EventChecklistComponent
} from '../event-checklist/event-checklist.component';
import {
  EventSchedulerComponent
} from '../event-scheduler/event-scheduler.component';
import {
  EventNotificationComponent
} from '../event-notification/event-notification.component';

import { ChecklistItem, Event } from '../../_models/event';

@Component({
  selector: 'app-event-form',
  templateUrl: './event-form.component.html',
  styleUrls: ['./event-form.component.scss']
})

export class EventFormComponent implements OnInit {
  @Input() eventMode: string;
  @Input() groupID: string;
  @Output() transmit = new EventEmitter<any>();

  @ViewChild('step1', { static: false }) stepPanel_1: MatExpansionPanel;
  @ViewChild('step3', { static: false }) stepPanel_3: MatExpansionPanel;
  @ViewChild('step4', { static: false }) stepPanel_4: MatExpansionPanel;

  @ViewChild('eventChecklist', { static: false }) childCheck: EventChecklistComponent;
  @ViewChild('eventScheduler', { static: false }) childSch: EventSchedulerComponent;
  @ViewChild('eventNotification', { static: false }) childNotify: EventNotificationComponent;

  childrenData: any = {};
  childrenNames: string[] = [ 'step1', 'step2', 'step3', 'step4' ];
  childrenNameRelations: any = {
    step1: 'metadata', step2: 'checklist', step3: 'schedule', step4: 'notification'
  };

  eventCreationFormGroup: FormGroup;

  eventTags: string[] = [];
  addOnBlur = true;
  tagsRemovable = true;
  tagsSelectable = false;
  readonly separatorKeyCodes: number[] = [ ENTER, COMMA ];

  timezones: any = { name: [], desc: [] };
  filteredTimezones: any;

  constructor(private _formBuilder: FormBuilder) {
    // this.timezones.name = moment.tz.names();
    // this.timezones.desc = this.timezones.name
    //   .map(name => name + ', ' + moment.tz(name).format('[GMT]Z, z')) ;

    this.timezones = moment.tz.names().map((name) => {
      return { name: name, desc: name + ', ' + moment.tz(name).format('[GMT]Z, z') };
    });

    this.eventCreationFormGroup = this._formBuilder.group({
      group: [''],
      topic: ['', [Validators.required, Validators.maxLength(60)]],
      content: ['', Validators.required],
      tags: ['', this._customValidatorOnTagsList(5)],
      timezone: [
        this.timezones[this._findTimezoneIndex(moment.tz.guess())].desc,
        [Validators.required, this._customValidatorOnTimezone()]
      ]
    });

  }

  ngOnInit() {
    this.eventCreationFormGroup.controls.group.disable();
    this.filteredTimezones = this.eventCreationFormGroup.controls.timezone.valueChanges
      .pipe(
        startWith(''),
        map(name => name ? this._filterTimezones(name): this.timezones.slice())
      );
  }

  ngOnChanges() {
    //console.log(this);
  }

  checkValid(id: string): boolean {
    let ret = false;
    if (!this.eventCreationFormGroup.valid){
      for (let key in this.eventCreationFormGroup.controls) {
        this.eventCreationFormGroup.get(key).markAsTouched();
        this.eventCreationFormGroup.get(key).updateValueAndValidity();
      }
      this.stepPanel_1.open();
    } else if (!this.childSch.checkValid('step3')){
      this.stepPanel_3.open();
    } else if (!this.childNotify.checkValid('step4')) {
      this.stepPanel_4.open();
    } else if (!this.childCheck.checkValid('step2')){
      ;
    } else {
      this.childrenData['step1'] = {
        group: this.groupID,
        topic: this.eventCreationFormGroup.value.topic,
        content: this.eventCreationFormGroup.value.content,
        tags: this.eventTags,
        timezone: this.eventCreationFormGroup.value.timezone
      };

      let transmitData = {};
      for (let key in this.childrenNameRelations)
        if (this.childrenData[key])
          transmitData[this.childrenNameRelations[key]] = this.childrenData[key];
        else
          transmitData[this.childrenNameRelations[key]] = undefined;
      this.transmit.emit(transmitData);

      ret = true;
    }

    return ret;
  }

  receiveChildData(result: any) {
    console.log(result);
    if (result) {
      const child = result.child;
      const data = result.data;
      if (child && this.childrenNames.includes(child) && data != undefined && data != '') {
        this.childrenData[child] = data;
      }
    }
  }

  addTag(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    if (this.eventTags.length >= 5)
      return;
    if ((value || '').trim())
      this.eventTags.push(value);
    if (input)
      input.value = '';
  }

  removeTag(eventTag: string): void {
    const index = this.eventTags.indexOf(eventTag);
    if (index >= 0)
      this.eventTags.splice(index, 1);
  }

  private _findTimezoneIndex(tzName: string): number {
    return this.timezones.findIndex(tz => tz.name == tzName);
  }

  private _filterTimezones(name: string): any{
    const tar = name.toLowerCase();

    return this.timezones.filter(tz => tz.desc.toLowerCase().indexOf(tar) === 0);
  }

  private _customValidatorOnTagsList(maximumVal: number): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} | null => {
      return this.eventTags.length >= maximumVal ? { noMoreTags: true } : null;
    }
  }

  private _customValidatorOnTimezone(): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} | null => {
      const index = this.timezones.findIndex(tz => tz.desc == control.value);
      return index >= 0 ? null : { tzInvalidError: true };
    }
  }
}
