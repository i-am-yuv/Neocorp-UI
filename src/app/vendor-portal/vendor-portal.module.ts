import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VendorPortalRoutingModule } from './vendor-portal-routing.module';
import { InvoiceComponent } from './invoice/invoice.component';
import { SharedModule } from '../shared/shared.module';
import { DebitNoteComponent } from './debit-note/debit-note.component';
import { CashmemoComponent } from './cashmemo/cashmemo.component';
import { ReceiptNoteComponent } from './receipt-note/receipt-note.component';



@NgModule({
  declarations: [
    InvoiceComponent,
    DebitNoteComponent,
    CashmemoComponent,
    ReceiptNoteComponent
  ],
  imports: [
    CommonModule,
    VendorPortalRoutingModule,
    SharedModule
  ]
})
export class VendorPortalModule { }
