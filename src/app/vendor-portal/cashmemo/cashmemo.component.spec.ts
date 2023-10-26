import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CashmemoComponent } from './cashmemo.component';

describe('CashmemoComponent', () => {
  let component: CashmemoComponent;
  let fixture: ComponentFixture<CashmemoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CashmemoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CashmemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
