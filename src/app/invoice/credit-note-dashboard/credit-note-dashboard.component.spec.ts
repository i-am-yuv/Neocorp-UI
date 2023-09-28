import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditNoteDashboardComponent } from './credit-note-dashboard.component';

describe('CreditNoteDashboardComponent', () => {
  let component: CreditNoteDashboardComponent;
  let fixture: ComponentFixture<CreditNoteDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreditNoteDashboardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreditNoteDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
