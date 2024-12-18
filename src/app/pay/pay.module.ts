import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PayRoutingModule } from './pay-routing.module';
import { VendorComponent } from './vendor/vendor.component';
import { SharedModule } from '../shared/shared.module';
import { ReturnRefundComponent } from './return-refund/return-refund.component';
import { ReturnRefundDashboardComponent } from './return-refund-dashboard/return-refund-dashboard.component';
import { VendorDashboardComponent } from './vendor-dashboard/vendor-dashboard.component';

@NgModule({
  declarations: [
    VendorComponent,
    ReturnRefundComponent,
    ReturnRefundDashboardComponent,
    VendorDashboardComponent,
  ],
  imports: [
    CommonModule,
    PayRoutingModule,
    SharedModule
    //DutchModule
  ]
})
export class PayModule { }
