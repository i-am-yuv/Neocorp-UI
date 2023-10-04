import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { BillsRoutingModule } from './bills-routing.module';
import { PurchaseOrderComponent } from './purchase-order/purchase-order.component';
import { SharedModule } from '../shared/shared.module';
import { DutchModule } from '../dutch/dutch.module';
import { ToggleButtonModule } from 'primeng/togglebutton';

import {ConfirmationService, MessageService} from 'primeng/api'
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtInterceptor } from '../auth/JwtInterceptor';
import { ReceiptNoteComponent } from './receipt-note/receipt-note.component';
import { DebitNoteComponent } from './debit-note/debit-note.component';
import { PoDashboardComponent } from './po-dashboard/po-dashboard.component';
import { DebitNoteDashboardComponent } from './debit-note-dashboard/debit-note-dashboard.component';
import { ReceiptNoteDashboardComponent } from './receipt-note-dashboard/receipt-note-dashboard.component';
@NgModule({
  declarations: [
    PurchaseOrderComponent,
    ReceiptNoteComponent,
    DebitNoteComponent,
    PoDashboardComponent,
    DebitNoteDashboardComponent,
    ReceiptNoteDashboardComponent
  ],
  imports: [
    CommonModule,
    BillsRoutingModule,
    SharedModule,
    ToggleButtonModule
  ],providers: [
    HttpClientModule,
    MessageService,
    DatePipe,
    ConfirmationService,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
  ],
})
export class BillsModule { }
