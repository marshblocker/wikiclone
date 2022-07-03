import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewPageEditorComponent } from './new-page-editor.component';

describe('NewPageEditorComponent', () => {
  let component: NewPageEditorComponent;
  let fixture: ComponentFixture<NewPageEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewPageEditorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewPageEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
