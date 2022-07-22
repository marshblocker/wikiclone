import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalChoiceNoBtnComponent } from './modal-choice-no-btn.component';

describe('ModalChoiceNoBtnComponent', () => {
  let component: ModalChoiceNoBtnComponent;
  let fixture: ComponentFixture<ModalChoiceNoBtnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalChoiceNoBtnComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalChoiceNoBtnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
