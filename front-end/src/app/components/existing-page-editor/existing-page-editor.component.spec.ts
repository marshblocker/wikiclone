import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExistingPageEditorComponent } from './existing-page-editor.component';

describe('ExistingPageEditorComponent', () => {
  let component: ExistingPageEditorComponent;
  let fixture: ComponentFixture<ExistingPageEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExistingPageEditorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExistingPageEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
