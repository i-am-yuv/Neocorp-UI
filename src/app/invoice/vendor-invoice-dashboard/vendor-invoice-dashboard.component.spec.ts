import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorInvoiceDashboardComponent } from './vendor-invoice-dashboard.component';

describe('VendorInvoiceDashboardComponent', () => {
  let component: VendorInvoiceDashboardComponent;
  let fixture: ComponentFixture<VendorInvoiceDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VendorInvoiceDashboardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VendorInvoiceDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
