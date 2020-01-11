import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventChecklistDisplayComponent } from './event-checklist-display.component';

describe('EventChecklistDisplayComponent', () => {
  let component: EventChecklistDisplayComponent;
  let fixture: ComponentFixture<EventChecklistDisplayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventChecklistDisplayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventChecklistDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
