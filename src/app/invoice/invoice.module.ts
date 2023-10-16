import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InvoiceRoutingModule } from './invoice-routing.module';
import { SalesOrderComponent } from './sales-order/sales-order.component';
import { SharedModule } from '../shared/shared.module';
import { DutchModule } from '../dutch/dutch.module';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { CreditNoteComponent } from './credit-note/credit-note.component';
import { CashMemoComponent } from './cash-memo/cash-memo.component';
import { CreditNoteDashboardComponent } from './credit-note-dashboard/credit-note-dashboard.component';
import { SalesOrderDashboardComponent } from './sales-order-dashboard/sales-order-dashboard.component';
import { CashMemoDashboardComponent } from './cash-memo-dashboard/cash-memo-dashboard.component';
import { VendorInvoiceComponent } from './vendor-invoice/vendor-invoice.component';
import { SalesInvoiceComponent } from './sales-invoice/sales-invoice.component';
import { SalesInvoiceDashboardComponent } from './sales-invoice-dashboard/sales-invoice-dashboard.component';
import { VendorInvoiceDashboardComponent } from './vendor-invoice-dashboard/vendor-invoice-dashboard.component';



@NgModule({
  declarations: [
    SalesOrderComponent,
    CreditNoteComponent,
    CashMemoComponent,
    CreditNoteDashboardComponent,
    SalesOrderDashboardComponent,
    CashMemoDashboardComponent,
    VendorInvoiceComponent,
    SalesInvoiceComponent,
    SalesInvoiceDashboardComponent,
    VendorInvoiceDashboardComponent,
  ],
  imports: [
    CommonModule,
    InvoiceRoutingModule,
    SharedModule,
    ToggleButtonModule
  ]
})
export class InvoiceModule { }
