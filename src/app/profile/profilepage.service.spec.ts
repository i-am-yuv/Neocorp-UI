import { TestBed } from '@angular/core/testing';

import { ProfilepageService } from './profilepage.service';

describe('ProfilepageService', () => {
  let service: ProfilepageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProfilepageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
