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


@NgModule({
  declarations: [
    SalesOrderComponent,
    CreditNoteComponent,
    CashMemoComponent,
    CreditNoteDashboardComponent,
    SalesOrderDashboardComponent,
    CashMemoDashboardComponent
  ],
  imports: [
    CommonModule,
    InvoiceRoutingModule,
    SharedModule,
    DutchModule,
    ToggleButtonModule
  ]
})
export class InvoiceModule { }
