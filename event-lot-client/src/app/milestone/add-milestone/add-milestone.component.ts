import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup,
         Validators, ValidationErrors, ValidatorFn } from '@angular/forms';

@Component({
  selector: 'app-add-milestone',
  templateUrl: './add-milestone.component.html',
  styleUrls: ['./add-milestone.component.scss']
})
export class AddMilestoneComponent implements OnInit {
  firstStep: FormGroup;
  secondStep: FormGroup;
  lastStep: FormGroup;

  constructor() { }

  ngOnInit() {
  }

}
