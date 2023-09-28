import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CollectRoutingModule } from './collect-routing.module';
import { PoInvoiceComponent } from './po-invoice/po-invoice.component';
import { DutchModule } from '../dutch/dutch.module';
import { SharedModule } from '../shared/shared.module';
import { CustomerComponent } from './customer/customer.component';


@NgModule({
  declarations: [
    PoInvoiceComponent,
    CustomerComponent
  ],
  imports: [
    CommonModule,
    CollectRoutingModule,
    DutchModule,
    SharedModule
  ]
})
export class CollectModule { }
