import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoodsReceiptDashboardComponent } from './goods-receipt-dashboard.component';

describe('GoodsReceiptDashboardComponent', () => {
  let component: GoodsReceiptDashboardComponent;
  let fixture: ComponentFixture<GoodsReceiptDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GoodsReceiptDashboardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GoodsReceiptDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
