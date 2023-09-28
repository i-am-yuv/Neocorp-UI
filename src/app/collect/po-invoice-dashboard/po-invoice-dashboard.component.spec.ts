import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoInvoiceDashboardComponent } from './po-invoice-dashboard.component';

describe('PoInvoiceDashboardComponent', () => {
  let component: PoInvoiceDashboardComponent;
  let fixture: ComponentFixture<PoInvoiceDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PoInvoiceDashboardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PoInvoiceDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
