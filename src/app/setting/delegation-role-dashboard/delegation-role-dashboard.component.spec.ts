import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DelegationRoleDashboardComponent } from './delegation-role-dashboard.component';

describe('DelegationRoleDashboardComponent', () => {
  let component: DelegationRoleDashboardComponent;
  let fixture: ComponentFixture<DelegationRoleDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DelegationRoleDashboardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DelegationRoleDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
