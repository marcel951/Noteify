import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateNoteComponent } from './update-note.component';

describe('UpdateNoteComponent', () => {
  let component: UpdateNoteComponent;
  let fixture: ComponentFixture<UpdateNoteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpdateNoteComponent]
    });
    fixture = TestBed.createComponent(UpdateNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
