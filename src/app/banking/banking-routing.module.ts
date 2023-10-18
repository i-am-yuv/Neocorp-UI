import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from '../shared/layout/layout.component';
import { PayToVendorComponent } from './pay-to-vendor/pay-to-vendor.component';
import { BeneficiaryComponent } from './beneficiary/beneficiary.component';
import { BeneficiaryDashboardComponent } from './beneficiary-dashboard/beneficiary-dashboard.component';
import { PaymentsComponent } from './payments/payments.component';

const routes: Routes = [
  {
    path: 'payToVendor',
    component: LayoutComponent,
    children: [
      { path: '', component: PayToVendorComponent },
      { path: 'amount/:amount', component: PayToVendorComponent },
      { path: 'pi/:id', component: PayToVendorComponent },
      { path: 'pi/:id/amount/:amount', component: PayToVendorComponent },
    ],
  },
  {
    path: 'beneficiary',
    component: LayoutComponent,
    children: [
      { path: 'create', component: BeneficiaryComponent },
      { path: 'edit/:id', component: BeneficiaryComponent },
    ],
  },
  {
    path: 'beneficiaries',
    component: LayoutComponent,
    children: [
      { path: '', component: BeneficiaryDashboardComponent }
    ],
  },
  {
    path: 'payments',
    component: LayoutComponent,
    children: [
      { path: '', component: PaymentsComponent }
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BankingRoutingModule { }
