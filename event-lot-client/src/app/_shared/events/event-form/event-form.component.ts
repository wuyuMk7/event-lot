import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, AbstractControl,
	 Validators, ValidationErrors, ValidatorFn } from '@angular/forms';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';

import { MatDatepicker } from '@angular/material/datepicker';

import { ChecklistItem, Event } from '../../../_models/event';

@Component({
  selector: 'app-event-form',
  templateUrl: './event-form.component.html',
  styleUrls: ['./event-form.component.scss']
})

export class EventFormComponent implements OnInit {
  eventCreationForm: FormGroup;

  eventTags: string[] = [];
  addOnBlur = true;
  tagsRemovable = true;
  tagsSelectable = false;
  readonly separatorKeyCodes: number[] = [ ENTER, COMMA ];

  constructor(private _formBuilder: FormBuilder) { 
    this.eventCreationForm = this._formBuilder.group({
      topic: ['', Validators.required],
      content: ['', Validators.required],
      tags: ['', this._customValidatorOnTagsList(5)],
      startdate: ['', Validators.required],
      enddate: ['', Validators.required]
    });
  }

  ngOnInit() {
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

  private _customValidatorOnTagsList(maximumVal: number): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} | null => {
      return this.eventTags.length >= maximumVal ? { noMoreTags: true } : null;
    }
  }
}
