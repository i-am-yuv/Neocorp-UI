import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BankingRoutingModule } from './banking-routing.module';
import { PayToVendorComponent } from './pay-to-vendor/pay-to-vendor.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    PayToVendorComponent
  ],
  imports: [
    CommonModule,
    BankingRoutingModule,
    SharedModule
  ]
})
export class BankingModule { }
