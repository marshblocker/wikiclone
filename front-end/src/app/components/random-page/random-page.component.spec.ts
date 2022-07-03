import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RandomPageComponent } from './random-page.component';

describe('RandomPageComponent', () => {
  let component: RandomPageComponent;
  let fixture: ComponentFixture<RandomPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RandomPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RandomPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
