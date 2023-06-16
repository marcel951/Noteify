import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleNoteComponent } from './single-note.component';

describe('SingleNoteComponent', () => {
  let component: SingleNoteComponent;
  let fixture: ComponentFixture<SingleNoteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SingleNoteComponent]
    });
    fixture = TestBed.createComponent(SingleNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
