import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { BillsRoutingModule } from './bills-routing.module';
import { PurchaseOrderComponent } from './purchase-order/purchase-order.component';
import { SharedModule } from '../shared/shared.module';
import { ToggleButtonModule } from 'primeng/togglebutton';

import {ConfirmationService, MessageService} from 'primeng/api'
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtInterceptor } from '../auth/JwtInterceptor';
import { ReceiptNoteComponent } from './receipt-note/receipt-note.component';
import { DebitNoteComponent } from './debit-note/debit-note.component';
import { PoDashboardComponent } from './po-dashboard/po-dashboard.component';
import { DebitNoteDashboardComponent } from './debit-note-dashboard/debit-note-dashboard.component';
import { ReceiptNoteDashboardComponent } from './receipt-note-dashboard/receipt-note-dashboard.component';
import { GoodsShipmentComponent } from './goods-shipment/goods-shipment.component';
import { GoodsShipmentDashboardComponent } from './goods-shipment-dashboard/goods-shipment-dashboard.component';
import { GoodsReceiptComponent } from './goods-receipt/goods-receipt.component';
import { GoodsReceiptDashboardComponent } from './goods-receipt-dashboard/goods-receipt-dashboard.component';

@NgModule({
  declarations: [
    PurchaseOrderComponent,
    ReceiptNoteComponent,
    DebitNoteComponent,
    PoDashboardComponent,
    DebitNoteDashboardComponent,
    ReceiptNoteDashboardComponent,
    GoodsShipmentComponent,
    GoodsShipmentDashboardComponent,
    GoodsReceiptComponent,
    GoodsReceiptDashboardComponent
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
