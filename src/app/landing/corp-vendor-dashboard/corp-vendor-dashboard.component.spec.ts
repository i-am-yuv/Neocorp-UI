import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CorpVendorDashboardComponent } from './corp-vendor-dashboard.component';

describe('CorpVendorDashboardComponent', () => {
  let component: CorpVendorDashboardComponent;
  let fixture: ComponentFixture<CorpVendorDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CorpVendorDashboardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CorpVendorDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
