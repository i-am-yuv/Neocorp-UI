import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoodsShipmentComponent } from './goods-shipment.component';

describe('GoodsShipmentComponent', () => {
  let component: GoodsShipmentComponent;
  let fixture: ComponentFixture<GoodsShipmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GoodsShipmentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GoodsShipmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
