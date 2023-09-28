import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DelegationRoleComponent } from './delegation-role.component';

describe('DelegationRoleComponent', () => {
  let component: DelegationRoleComponent;
  let fixture: ComponentFixture<DelegationRoleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DelegationRoleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DelegationRoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
