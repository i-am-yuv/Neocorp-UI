import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CashMemoComponent } from './cash-memo.component';

describe('CashMemoComponent', () => {
  let component: CashMemoComponent;
  let fixture: ComponentFixture<CashMemoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CashMemoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CashMemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
