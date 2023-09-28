import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DebitNoteDashboardComponent } from './debit-note-dashboard.component';

describe('DebitNoteDashboardComponent', () => {
  let component: DebitNoteDashboardComponent;
  let fixture: ComponentFixture<DebitNoteDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DebitNoteDashboardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DebitNoteDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
