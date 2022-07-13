import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaginationEntryCardComponent } from './pagination-entry-card.component';

describe('PaginationEntryCardComponent', () => {
  let component: PaginationEntryCardComponent;
  let fixture: ComponentFixture<PaginationEntryCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaginationEntryCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaginationEntryCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
