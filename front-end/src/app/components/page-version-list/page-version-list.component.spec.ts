import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageVersionListComponent } from './page-version-list.component';

describe('PageVersionListComponent', () => {
  let component: PageVersionListComponent;
  let fixture: ComponentFixture<PageVersionListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PageVersionListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PageVersionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
