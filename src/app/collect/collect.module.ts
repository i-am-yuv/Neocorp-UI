import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CollectRoutingModule } from './collect-routing.module';
import { PoInvoiceComponent } from './po-invoice/po-invoice.component';
import { DutchModule } from '../dutch/dutch.module';
import { SharedModule } from '../shared/shared.module';
import { CustomerComponent } from './customer/customer.component';
import { PoInvoiceDashboardComponent } from './po-invoice-dashboard/po-invoice-dashboard.component';
import { CustomerDashboardComponent } from './customer-dashboard/customer-dashboard.component';


@NgModule({
  declarations: [
    PoInvoiceComponent,
    CustomerComponent,
    PoInvoiceDashboardComponent,
    CustomerDashboardComponent
  ],
  imports: [
    CommonModule,
    CollectRoutingModule,
    SharedModule
  ]
})
export class CollectModule { }
