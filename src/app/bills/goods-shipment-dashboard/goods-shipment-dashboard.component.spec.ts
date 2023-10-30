import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoodsShipmentDashboardComponent } from './goods-shipment-dashboard.component';

describe('GoodsShipmentDashboardComponent', () => {
  let component: GoodsShipmentDashboardComponent;
  let fixture: ComponentFixture<GoodsShipmentDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GoodsShipmentDashboardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GoodsShipmentDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
