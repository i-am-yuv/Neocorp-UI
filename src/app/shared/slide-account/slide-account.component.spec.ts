import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlideAccountComponent } from './slide-account.component';

describe('SlideAccountComponent', () => {
  let component: SlideAccountComponent;
  let fixture: ComponentFixture<SlideAccountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SlideAccountComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SlideAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
