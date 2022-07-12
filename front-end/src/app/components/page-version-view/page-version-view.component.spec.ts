import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageVersionViewComponent } from './page-version-view.component';

describe('PageVersionViewComponent', () => {
  let component: PageVersionViewComponent;
  let fixture: ComponentFixture<PageVersionViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PageVersionViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PageVersionViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
