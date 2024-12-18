import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BankingRoutingModule } from './banking-routing.module';
import { PayToVendorComponent } from './pay-to-vendor/pay-to-vendor.component';
import { SharedModule } from '../shared/shared.module';
import { BeneficiaryComponent } from './beneficiary/beneficiary.component';
import { BeneficiaryDashboardComponent } from './beneficiary-dashboard/beneficiary-dashboard.component';
import { PaymentsComponent } from './payments/payments.component';
import { TrackingComponent } from './tracking/tracking.component';
import { AccountsComponent } from './accounts/accounts.component';
import { SlideAccountComponent } from '../shared/slide-account/slide-account.component';

@NgModule({
  declarations: [
    PayToVendorComponent,
    BeneficiaryComponent,
    BeneficiaryDashboardComponent,
    PaymentsComponent,
    TrackingComponent,
    AccountsComponent
  ],
  imports: [
    CommonModule,
    BankingRoutingModule,
    SharedModule
  ]
})
export class BankingModule { }
