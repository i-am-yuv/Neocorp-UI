import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InvoicingRoutingModule } from './invoicing-routing.module';
import { VendorsComponent } from './vendors/vendors.component';
import { CutomersComponent } from './cutomers/cutomers.component';
import { InvoicesComponent } from './invoices/invoices.component';
import { DutchModule } from '../dutch/dutch.module';


@NgModule({
  declarations: [
    VendorsComponent,
    CutomersComponent,
    InvoicesComponent
  ],
  imports: [
    CommonModule,
    InvoicingRoutingModule,
    DutchModule
  ]
})
export class InvoicingModule { }
