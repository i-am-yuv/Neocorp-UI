import { TestBed } from '@angular/core/testing';

import { PayPageService } from './pay-page.service';

describe('PayPageService', () => {
  let service: PayPageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PayPageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
