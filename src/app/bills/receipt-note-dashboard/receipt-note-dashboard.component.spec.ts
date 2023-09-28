import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceiptNoteDashboardComponent } from './receipt-note-dashboard.component';

describe('ReceiptNoteDashboardComponent', () => {
  let component: ReceiptNoteDashboardComponent;
  let fixture: ComponentFixture<ReceiptNoteDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReceiptNoteDashboardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReceiptNoteDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
