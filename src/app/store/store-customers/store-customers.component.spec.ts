import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreCustomersComponent } from './store-customers.component';

describe('StoreCustomersComponent', () => {
  let component: StoreCustomersComponent;
  let fixture: ComponentFixture<StoreCustomersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StoreCustomersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StoreCustomersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
