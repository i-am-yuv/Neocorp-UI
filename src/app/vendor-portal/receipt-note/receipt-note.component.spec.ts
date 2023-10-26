import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceiptNoteComponent } from './receipt-note.component';

describe('ReceiptNoteComponent', () => {
  let component: ReceiptNoteComponent;
  let fixture: ComponentFixture<ReceiptNoteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReceiptNoteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReceiptNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
