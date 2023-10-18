import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayToVendorComponent } from './pay-to-vendor.component';

describe('PayToVendorComponent', () => {
  let component: PayToVendorComponent;
  let fixture: ComponentFixture<PayToVendorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PayToVendorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PayToVendorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
