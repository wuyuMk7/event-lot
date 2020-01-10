import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventMetadataComponent } from './event-metadata.component';

describe('EventMetadataComponent', () => {
  let component: EventMetadataComponent;
  let fixture: ComponentFixture<EventMetadataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventMetadataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventMetadataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
