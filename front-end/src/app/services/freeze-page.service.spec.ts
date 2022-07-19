import { TestBed } from '@angular/core/testing';

import { FreezePageService } from './freeze-page.service';

describe('FreezePageService', () => {
  let service: FreezePageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FreezePageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
