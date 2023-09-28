import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReturnRefundDashboardComponent } from './return-refund-dashboard.component';

describe('ReturnRefundDashboardComponent', () => {
  let component: ReturnRefundDashboardComponent;
  let fixture: ComponentFixture<ReturnRefundDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReturnRefundDashboardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReturnRefundDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
