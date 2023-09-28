import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CashMemoDashboardComponent } from './cash-memo-dashboard.component';

describe('CashMemoDashboardComponent', () => {
  let component: CashMemoDashboardComponent;
  let fixture: ComponentFixture<CashMemoDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CashMemoDashboardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CashMemoDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
