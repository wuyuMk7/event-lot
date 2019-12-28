import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-add-event',
  templateUrl: './add-event.component.html',
  styleUrls: ['./add-event.component.scss']
})
export class AddEventComponent implements OnInit {
  firstStep: FormGroup;
  secondStep: FormGroup;
  lastStep: FormGroup;

  ownerTypes: string[] = ['Yourself', 'Group'];

  ownerGroups: string[] = ['fffff', 'kkkk'];
  filteredOwnerGroups: Observable<string[]>;

  constructor(private _formBuilder: FormBuilder) {
    this.ownerGroupSelectionControl = new FormControl();

    this.filteredOwnerGroups = this.ownerGroupSelectionControl.valueChanges.pipe(
      startWith(''), 
      map(group => group ? this._filterOwnerGroups(group) : this.ownerGroups.slice())
    );
  }

  ngOnInit() {
    this.firstStep = this._formBuilder.group({
      ownerTypeCtrl: ['', Validators.required],
      ownerGroupNameCtrl: ['']
    }, {
      validator: this._customValidatorOnGroupName()
    });

    this.secondStep = this._formBuilder.group({
      secondCtrl: ['', Validators.required]
    });
  }

  private _filterOwnerGroups(value: string): string[] {
    const filter = value.toLowerCase();
    return this.ownerGroups.filter(group => group.toLowerCase().indexOf(filter) == 0)
  }

  private _customValidatorOnGroupName(toBeChecked: boolean): ValidatorFn {
    return (control: FormGroup): ValidationErrors | null => {
      let vals = control.value;
      let toBeChecked = vals.ownerTypeCtrl === 'Group';
      let isEmpty = vals.ownerGroupNameCtrl == null || vals.ownerGroupNameCtrl.length === 0;
      let isInGroups = this.ownerGroups.includes(vals.ownerGroupNameCtrl);

      return toBeChecked ? ((!isEmpty && isInGroups) ? null: {groupNameError: true}): null;
    }
  }
}
