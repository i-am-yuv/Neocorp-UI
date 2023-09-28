import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesInvoiceDashboardComponent } from './sales-invoice-dashboard.component';

describe('SalesInvoiceDashboardComponent', () => {
  let component: SalesInvoiceDashboardComponent;
  let fixture: ComponentFixture<SalesInvoiceDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalesInvoiceDashboardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalesInvoiceDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
