import { TestBed } from '@angular/core/testing';

import { DeliveryPartnersService } from './delivery-partners.service';

describe('DeliveryPartnersService', () => {
  let service: DeliveryPartnersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DeliveryPartnersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
