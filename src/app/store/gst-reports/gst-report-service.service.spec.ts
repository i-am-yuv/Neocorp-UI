import { TestBed } from '@angular/core/testing';

import { GstReportServiceService } from './gst-report-service.service';

describe('GstReportServiceService', () => {
  let service: GstReportServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GstReportServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
