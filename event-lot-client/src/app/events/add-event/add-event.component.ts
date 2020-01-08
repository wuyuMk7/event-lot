import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup,
         Validators, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import { EventService } from '../../_services/event.service';

@Component({
  selector: 'app-add-event',
  templateUrl: './add-event.component.html',
  styleUrls: ['./add-event.component.scss']
})
export class AddEventComponent implements OnInit {
  firstStep: FormGroup;
  secondStep: FormGroup;
  lastStep: FormGroup;

  isSecondStepDone = false;

  ownerTypes: string[] = ['Yourself', 'Group'];
  ownerGroups: string[] = ['fffff', 'kkkk','a','b','c','d','e'];
  filteredOwnerGroups: Observable<string[]>;

  eventFormData: any;

  constructor(
    private _eventService: EventService,
    private _formBuilder: FormBuilder
  ) {
    this.firstStep = this._formBuilder.group({
      ownerTypeCtrl: ['Yourself', Validators.required],
      ownerGroupNameCtrl: ['']
    }, {
      validator: this._customValidatorOnGroupName()
    });
    this.secondStep = this._formBuilder.group({});
  }

  ngOnInit() {
    this.filteredOwnerGroups = this.firstStep.controls.ownerGroupNameCtrl
      .valueChanges.pipe(
        startWith(''),
        map(group => group ? this._filterOwnerGroups(group) : this.ownerGroups.slice())
      );
  }

  receiveChildData(event: any): void {
    this.eventFormData = event;
    this.isSecondStepDone = true;
    console.log(this.eventFormData);
  }

  submitEvent(event: any): void {
    this._eventService.addEventByForm(
      this.eventFormData, this.eventFormData.metadata.group
    ).then((res) => {
      if (res && res.status == 'success') {
        console.log('Success!' + res.data.id);
      } else if (res && res.status == 'err') {
        console.log('Error!' + res.data.msg);
      } else {
        console.log('No response!');
      }
    }, (err) => { console.log(err) });
  }

  private _filterOwnerGroups(value: string): string[] {
    const filter = value.toLowerCase();
    return this.ownerGroups.filter(group => group.toLowerCase().indexOf(filter) == 0)
  }

  private _customValidatorOnGroupName(): ValidatorFn {
    return (fg: FormGroup): ValidationErrors | null => {
      const control = fg.controls.ownerGroupNameCtrl;
      if (fg.value.ownerTypeCtrl === 'Group') {
        if (control.value == null || control.value.length === 0)
          control.setErrors({ groupNameEmptyError: true });
        else if (!this.ownerGroups.includes(control.value))
          control.setErrors({ groupNameInvalidError: true });
      } else {
        control.setErrors(null);
      }

      return null;
    }
  }
}
